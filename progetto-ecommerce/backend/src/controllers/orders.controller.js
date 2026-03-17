const db = require('../config/db');

async function createOrder(req, res) {
  const { items, shipping, total } = req.body;

  if (!items?.length || !shipping) {
    return res.status(400).json({ error: 'Dati ordine incompleti' });
  }

  const { firstName, lastName, email, address, city, zip, country } = shipping;

  if (!firstName || !lastName || !email || !address || !city || !zip || !country) {
    return res.status(400).json({ error: 'Tutti i campi di spedizione sono obbligatori' });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Verifica disponibilità prodotti e scalabilità quantità
    for (const item of items) {
      const [rows] = await conn.query(
        'SELECT quantity FROM products WHERE id = ? FOR UPDATE',
        [item.product.id]
      );
      if (rows.length === 0) {
        throw new Error(`Prodotto ID ${item.product.id} non trovato`);
      }
      if (rows[0].quantity < item.qty) {
        throw new Error(`Quantità insufficiente per "${item.product.name}"`);
      }
    }

    // Inserisci ordine
    const [orderResult] = await conn.query(
      `INSERT INTO orders (total, first_name, last_name, email, address, city, zip, country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [total, firstName, lastName, email, address, city, zip, country]
    );
    const orderId = orderResult.insertId;

    // Inserisci righe ordine e scala la quantità
    for (const item of items) {
      await conn.query(
        `INSERT INTO order_items (order_id, product_id, qty, unit_price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product.id, item.qty, item.product.price]
      );
      await conn.query(
        'UPDATE products SET quantity = quantity - ? WHERE id = ?',
        [item.qty, item.product.id]
      );
    }

    await conn.commit();
    res.status(201).json({ orderId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(422).json({ error: err.message || 'Errore nella creazione dell\'ordine' });
  } finally {
    conn.release();
  }
}

async function getAll(req, res) {
  try {
    const [orders] = await db.query(
      'SELECT * FROM orders ORDER BY created_at DESC'
    );
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name AS product_name
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero degli ordini' });
  }
}

async function getById(req, res) {
  try {
    const [rows] = await db.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Ordine non trovato' });
    }
    const order = rows[0];
    const [items] = await db.query(
      `SELECT oi.*, p.name AS product_name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = ?`,
      [order.id]
    );
    order.items = items;
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Errore nel recupero dell\'ordine' });
  }
}

module.exports = { createOrder, getAll, getById };

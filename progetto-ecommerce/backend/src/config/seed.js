require('dotenv').config();
const mysql  = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seed() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  console.log('🌱 Inserimento dati di seed...');

  // Admin
  const hash = await bcrypt.hash('admin123', 12);
  await conn.query(`
    INSERT IGNORE INTO admins (username, password)
    VALUES ('admin', ?)
  `, [hash]);

  // Prodotti di esempio
  const products = [
    ['Orologio Minimalista', 'Design épuré con movimento svizzero. Cassa in acciaio satinato 40mm.', 249.00, 5, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', 'Accessori'],
    ['Borsa in Pelle', 'Pelle italiana vegetale conciata. Capiente e versatile, artigianale.', 189.00, 3, 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400', 'Borse'],
    ['Sneakers Urban', 'Tomaia in mesh tecnico, suola in gomma riciclata. Comfort assoluto.', 129.00, 0, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 'Scarpe'],
    ['Occhiali Vintage', 'Montatura in acetato handmade. Lenti polarizzate UV400.', 95.00, 8, 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400', 'Accessori'],
    ['Cappello Fedora', 'Feltro di lana merino. Forma classica, tesa media. Made in Italy.', 75.00, 0, 'https://images.unsplash.com/photo-1521369909029-2afed882baee?w=400', 'Cappelli'],
    ['Cintura Intrecciata', 'Pelle bovina piena fiore. Lavorazione intrecciata artigianale.', 65.00, 12, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', 'Accessori'],
  ];

  for (const p of products) {
    await conn.query(`
      INSERT IGNORE INTO products (name, description, price, quantity, image_url, category)
      VALUES (?, ?, ?, ?, ?, ?)
    `, p);
  }

  console.log('✅ Seed completato. Admin: admin / admin123 — Prodotti: 6 inseriti');
  await conn.end();
}

seed().catch(err => {
  console.error('❌ Seed fallito:', err);
  process.exit(1);
});

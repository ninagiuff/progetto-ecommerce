require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const conn = await mysql.createConnection({
    host:     process.env.DB_HOST,
    port:     Number(process.env.DB_PORT) || 3306,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  console.log('🔄 Esecuzione migration...');

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
  await conn.query(`USE \`${process.env.DB_NAME}\``);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
      id          INT AUTO_INCREMENT PRIMARY KEY,
      name        VARCHAR(255)   NOT NULL,
      description TEXT,
      price       DECIMAL(10,2)  NOT NULL,
      quantity    INT            NOT NULL DEFAULT 0,
      image_url   VARCHAR(500),
      category    VARCHAR(100),
      created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
      id           INT AUTO_INCREMENT PRIMARY KEY,
      total        DECIMAL(10,2) NOT NULL,
      status       ENUM('pending','confirmed','shipped','delivered','cancelled') DEFAULT 'confirmed',
      first_name   VARCHAR(100) NOT NULL,
      last_name    VARCHAR(100) NOT NULL,
      email        VARCHAR(255) NOT NULL,
      address      VARCHAR(255) NOT NULL,
      city         VARCHAR(100) NOT NULL,
      zip          VARCHAR(20)  NOT NULL,
      country      VARCHAR(10)  NOT NULL,
      created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS order_items (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      order_id   INT           NOT NULL,
      product_id INT           NOT NULL,
      qty        INT           NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (order_id)   REFERENCES orders(id)   ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  await conn.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      username   VARCHAR(100) NOT NULL UNIQUE,
      password   VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  console.log('✅ Migration completata. Tabelle create: products, orders, order_items, admins');
  await conn.end();
}

migrate().catch(err => {
  console.error('❌ Migration fallita:', err);
  process.exit(1);
});

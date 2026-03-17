const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit:    10,
  queueLimit:         0,
  timezone:           '+00:00',
});

// Test connessione all'avvio
pool.getConnection()
  .then(conn => {
    console.log('✅ Connessione MySQL stabilita');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Errore connessione MySQL:', err.message);
    process.exit(1);
  });

module.exports = pool;

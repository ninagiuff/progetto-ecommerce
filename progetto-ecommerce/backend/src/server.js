require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const authRoutes     = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const ordersRoutes   = require('./routes/orders.routes');

const app  = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin:      process.env.CORS_ORIGIN || 'http://localhost:4200',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders',   ordersRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Rotta ${req.method} ${req.path} non trovata` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Errore interno del server' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server in ascolto su http://localhost:${PORT}`);
});

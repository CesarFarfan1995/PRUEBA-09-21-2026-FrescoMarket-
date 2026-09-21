const path = require('path');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./modules/auth/auth.routes');
const productsRoutes = require('./modules/products/products.routes');
const { errorMiddleware } = require('./middleware/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);

app.use(errorMiddleware);

module.exports = { app };

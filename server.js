require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const statsRoutes = require('./routes/stats');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// --- API routes ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/stats', statsRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true, name: 'Gadgets in BD API' }));

// --- Static frontend ---
app.use(express.static(path.join(__dirname, 'public')));

// Fallback to index.html for any non-API route (simple multi-page site, so this
// mostly just covers unknown paths — each real page is its own .html file).
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// --- Error handler ---
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on our end. Please try again.' });
});

app.listen(PORT, () => {
  console.log(`\n  Gadgets in BD running at http://localhost:${PORT}\n`);
});

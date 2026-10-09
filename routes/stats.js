const express = require('express');
const { readDB } = require('../data/store');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireAdmin, (req, res) => {
  const db = readDB();

  const totalRevenue = db.orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const lowStock = db.products.filter((p) => p.stock <= 5).length;

  res.json({
    totalRevenue,
    totalOrders: db.orders.length,
    pendingOrders: db.orders.filter((o) => o.status === 'pending').length,
    totalProducts: db.products.length,
    lowStock,
    totalCustomers: db.users.filter((u) => u.role === 'customer').length
  });
});

module.exports = router;

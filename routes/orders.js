const express = require('express');
const crypto = require('crypto');

const { readDB, writeDB } = require('../data/store');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

const VALID_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const VALID_PAYMENTS = ['cod', 'bkash', 'nagad'];

// POST /api/orders  { items: [{productId, qty}], shipping: {name, phone, address, city}, paymentMethod }
router.post('/', requireAuth, (req, res) => {
  const { items, shipping, paymentMethod } = req.body || {};

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Your cart is empty.' });
  }
  if (!shipping || !shipping.name || !shipping.phone || !shipping.address || !shipping.city) {
    return res.status(400).json({ error: 'Full shipping details are required.' });
  }
  if (!VALID_PAYMENTS.includes(paymentMethod)) {
    return res.status(400).json({ error: 'Choose a valid payment method (COD, bKash, or Nagad).' });
  }

  const db = readDB();
  const orderItems = [];
  let total = 0;

  for (const { productId, qty } of items) {
    const product = db.products.find((p) => p.id === productId);
    if (!product) {
      return res.status(400).json({ error: `A product in your cart is no longer available.` });
    }
    const quantity = Math.max(1, Number(qty) || 1);
    if (product.stock < quantity) {
      return res.status(400).json({ error: `Only ${product.stock} left in stock for "${product.name}".` });
    }
    orderItems.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      icon: product.icon,
      qty: quantity
    });
    total += product.price * quantity;
  }

  // Decrement stock now that the order is confirmed.
  for (const item of orderItems) {
    const product = db.products.find((p) => p.id === item.productId);
    product.stock -= item.qty;
  }

  const shippingFee = total >= 3000 ? 0 : 80;

  const order = {
    id: crypto.randomUUID(),
    userId: req.user.id,
    items: orderItems,
    subtotal: total,
    shippingFee,
    total: total + shippingFee,
    shipping,
    paymentMethod,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(order);
  writeDB(db);

  res.status(201).json({ order });
});

router.get('/my', requireAuth, (req, res) => {
  const db = readDB();
  const orders = db.orders
    .filter((o) => o.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ orders });
});

router.get('/', requireAuth, requireAdmin, (req, res) => {
  const db = readDB();
  const orders = [...db.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const withCustomer = orders.map((o) => {
    const user = db.users.find((u) => u.id === o.userId);
    return { ...o, customerEmail: user ? user.email : 'unknown' };
  });
  res.json({ orders: withCustomer });
});

router.put('/:id/status', requireAuth, requireAdmin, (req, res) => {
  const { status } = req.body || {};
  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).json({ error: `Status must be one of: ${VALID_STATUSES.join(', ')}.` });
  }

  const db = readDB();
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  order.status = status;
  writeDB(db);
  res.json({ order });
});

module.exports = router;

const express = require('express');
const crypto = require('crypto');

const { readDB, writeDB } = require('../data/store');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products?category=&search=&sort=&minPrice=&maxPrice=
router.get('/', (req, res) => {
  const { category, search, sort, minPrice, maxPrice } = req.query;
  const db = readDB();
  let items = db.products;

  if (category && category !== 'All') {
    items = items.filter((p) => p.category === category);
  }
  if (search) {
    const q = String(search).toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (minPrice) items = items.filter((p) => p.price >= Number(minPrice));
  if (maxPrice) items = items.filter((p) => p.price <= Number(maxPrice));

  switch (sort) {
    case 'price-asc':
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      items = [...items].sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      items = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    default:
      break;
  }

  res.json({
    items,
    categories: [...new Set(db.products.map((p) => p.category))]
  });
});

router.get('/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found.' });

  const related = db.products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  res.json({ product, related });
});

router.post('/', requireAuth, requireAdmin, (req, res) => {
  const { name, brand, category, price, oldPrice, stock, description, icon, color, specs, featured } =
    req.body || {};

  if (!name || !category || price == null || stock == null) {
    return res.status(400).json({ error: 'Name, category, price, and stock are required.' });
  }

  const db = readDB();
  const product = {
    id: crypto.randomUUID(),
    name,
    brand: brand || 'Generic',
    category,
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : null,
    stock: Number(stock),
    rating: 0,
    reviews: 0,
    icon: icon || '📦',
    color: color || '#12172B',
    specs: Array.isArray(specs) ? specs : [],
    description: description || '',
    featured: Boolean(featured),
    createdAt: new Date().toISOString()
  };

  db.products.push(product);
  writeDB(db);
  res.status(201).json({ product });
});

router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found.' });

  const allowed = [
    'name', 'brand', 'category', 'price', 'oldPrice', 'stock',
    'description', 'icon', 'color', 'specs', 'featured', 'rating', 'reviews'
  ];
  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  db.products[idx] = { ...db.products[idx], ...updates };
  writeDB(db);
  res.json({ product: db.products[idx] });
});

router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex((p) => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Product not found.' });

  const [removed] = db.products.splice(idx, 1);
  writeDB(db);
  res.json({ product: removed });
});

module.exports = router;

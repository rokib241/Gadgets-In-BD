const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { readDB, writeDB } = require('../data/store');
const { requireAuth, JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

function toPublicUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role };
}

function signToken(u) {
  return jwt.sign(
    { id: u.id, name: u.name, email: u.email, role: u.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

router.post('/register', (req, res) => {
  const { name, email, password } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are all required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const db = readDB();
  const exists = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    passwordHash: bcrypt.hashSync(password, 10),
    role: 'customer',
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  writeDB(db);

  const token = signToken(user);
  res.status(201).json({ token, user: toPublicUser(user) });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = readDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }

  const token = signToken(user);
  res.json({ token, user: toPublicUser(user) });
});

router.get('/me', requireAuth, (req, res) => {
  const db = readDB();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: toPublicUser(user) });
});

module.exports = router;

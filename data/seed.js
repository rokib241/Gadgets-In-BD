const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const seedProducts = require('./seedProducts');

const DB_PATH = path.join(__dirname, 'db.json');

function seed({ force = false } = {}) {
  if (fs.existsSync(DB_PATH) && !force) {
    console.log('data/db.json already exists — skipping seed (pass --force to reset).');
    return;
  }

  const now = new Date().toISOString();

  const products = seedProducts.map((p) => ({
    id: crypto.randomUUID(),
    createdAt: now,
    ...p
  }));

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gadgetsinbd.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

  const users = [
    {
      id: crypto.randomUUID(),
      name: 'Store Admin',
      email: adminEmail,
      passwordHash: bcrypt.hashSync(adminPassword, 10),
      role: 'admin',
      createdAt: now
    }
  ];

  const db = { users, products, orders: [] };
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));

  console.log(`Seeded ${products.length} products.`);
  console.log(`Admin login -> email: ${adminEmail}  password: ${adminPassword}`);
}

if (require.main === module) {
  const force = process.argv.includes('--force');
  seed({ force });
}

module.exports = { seed };

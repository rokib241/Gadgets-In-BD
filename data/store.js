// A tiny synchronous JSON-file "database".
// Good enough for a demo/portfolio-scale store; swap for Postgres/Mongo later
// by keeping the same readDB()/writeDB() contract.

const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');

function ensureSeeded() {
  if (!fs.existsSync(DB_PATH)) {
    // Lazily seed on first run so `npm start` alone is enough to boot the app.
    require('./seed').seed();
  }
}

function readDB() {
  ensureSeeded();
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

module.exports = { readDB, writeDB, DB_PATH };

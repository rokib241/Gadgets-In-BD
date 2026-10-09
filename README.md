# Gadgets in BD

A full-stack e-commerce site for a Bangladeshi electronics store — smartphones, laptops,
audio, wearables, accessories, and gaming gear. Built with a plain Node/Express backend
and a dependency-free HTML/CSS/JS frontend, so there's no build step: install once, then
`npm start`.

## Features

**Storefront**
- Product catalog with category filters, search, and sorting (price, rating, newest)
- Product detail pages with specs, quantity selector, and related items
- Cart (persisted in the browser) with live subtotal and free-delivery threshold
- Checkout with Cash on Delivery, bKash, and Nagad payment options
- Customer accounts: register, sign in, and view order history with live status

**Admin dashboard** (`/admin.html`)
- Revenue, order, product, and customer stats at a glance
- Full product CRUD (add, edit, delete, manage stock and specs)
- Order management with status updates (pending → processing → shipped → delivered)

**Backend**
- REST API secured with JWT auth and bcrypt password hashing
- Role-based access control (customer vs. admin)
- Stock is validated and decremented atomically when an order is placed
- Data is stored in a JSON file (`data/db.json`) — no database server to install.
  Swap in Postgres/Mongo later without changing the API surface if you outgrow it.

## Getting started

```bash
npm install
cp .env.example .env      # then edit .env if you want a different admin password/secret
npm start
```

Open **http://localhost:4000**.
The database seeds itself automatically on first run (17 sample products + one admin
account) — you don't need to run anything extra. To reset it back to the seed data later:

```bash
npm run seed -- --force
```

### Admin login

The seed script prints the admin credentials to the console on first run. By default
(from `.env.example`):

- Email: `admin@gadgetsinbd.com`
- Password: `Admin@12345`

**Change these (and `JWT_SECRET`) in `.env` before deploying anywhere real.**

## Project structure

```
gadgets-in-bd/
├── server.js              Express app entry point
├── routes/                 auth, products, orders, stats
├── middleware/auth.js       JWT verification + admin gate
├── data/
│   ├── store.js             tiny JSON-file "database" (read/write)
│   ├── seedProducts.js      the 17 seed products
│   ├── seed.js               builds data/db.json on first run
│   └── db.json               generated at runtime (git-ignored)
└── public/                  the whole frontend (static files, no build step)
    ├── *.html                one file per page
    ├── css/style.css          design system (tokens, components)
    └── js/
        ├── api.js, auth.js, cart.js, ui.js   shared helpers
        └── pages/*.js                         one script per page
```

## API reference

All endpoints are under `/api`. Protected routes expect `Authorization: Bearer <token>`.

| Method | Path                     | Auth   | Description                       |
|--------|--------------------------|--------|------------------------------------|
| POST   | /auth/register           | —      | Create a customer account          |
| POST   | /auth/login               | —      | Log in, returns a JWT              |
| GET    | /auth/me                  | user   | Current user info                  |
| GET    | /products                 | —      | List/filter products               |
| GET    | /products/:id             | —      | Product detail + related items     |
| POST   | /products                 | admin  | Create a product                   |
| PUT    | /products/:id             | admin  | Update a product                   |
| DELETE | /products/:id             | admin  | Delete a product                   |
| POST   | /orders                   | user   | Place an order from cart items     |
| GET    | /orders/my                | user   | Your own order history             |
| GET    | /orders                   | admin  | All orders (with customer email)   |
| PUT    | /orders/:id/status        | admin  | Update an order's status           |
| GET    | /stats                    | admin  | Dashboard summary numbers          |

## Notes on going to production

This ships as a solid, working demo — before pointing it at real customers, you'd want to:
- Move from the JSON file store to a real database (Postgres/MongoDB) for concurrent writes
- Add a real payment gateway integration for bKash/Nagad instead of the "confirm on delivery" flow
- Add rate limiting and input sanitization on the API
- Set a strong, unique `JWT_SECRET` and serve over HTTPS

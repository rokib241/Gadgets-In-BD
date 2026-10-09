const cart = {
  KEY: 'gbd_cart', // array of { productId, qty }

  get: () => JSON.parse(localStorage.getItem(cart.KEY) || '[]'),

  save: (items) => localStorage.setItem(cart.KEY, JSON.stringify(items)),

  count: () => cart.get().reduce((sum, i) => sum + i.qty, 0),

  add: (productId, qty = 1) => {
    const items = cart.get();
    const existing = items.find((i) => i.productId === productId);
    if (existing) existing.qty += qty;
    else items.push({ productId, qty });
    cart.save(items);
    cart.renderBadge(true);
  },

  setQty: (productId, qty) => {
    let items = cart.get();
    if (qty <= 0) {
      items = items.filter((i) => i.productId !== productId);
    } else {
      const existing = items.find((i) => i.productId === productId);
      if (existing) existing.qty = qty;
    }
    cart.save(items);
    cart.renderBadge();
  },

  remove: (productId) => {
    const items = cart.get().filter((i) => i.productId !== productId);
    cart.save(items);
    cart.renderBadge();
  },

  clear: () => {
    localStorage.removeItem(cart.KEY);
    cart.renderBadge();
  },

  renderBadge: (bump = false) => {
    const el = document.getElementById('cartCount');
    if (!el) return;
    const n = cart.count();
    el.textContent = n;
    el.style.display = n > 0 ? 'flex' : 'none';
    if (bump) {
      el.classList.remove('bump');
      void el.offsetWidth; // restart animation
      el.classList.add('bump');
    }
  }
};

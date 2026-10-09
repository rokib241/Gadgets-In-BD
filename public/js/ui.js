function toast(message, type = 'ok') {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = message;
  el.className = type === 'error' ? 'error show' : 'show';
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.classList.remove('show'); }, 2600);
}

function formatBDT(amount) {
  return '৳' + Number(amount).toLocaleString('en-BD');
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function initNav() {
  cart.renderBadge();

  const accountSlot = document.getElementById('accountSlot');
  const adminLink = document.getElementById('adminLink');

  if (accountSlot) {
    if (auth.isLoggedIn()) {
      const user = auth.getUser();
      accountSlot.innerHTML = `
        <a href="/orders.html" class="nav-icon-link">👤 ${escapeHtml(user.name.split(' ')[0])}</a>
        <button class="nav-icon-link" id="logoutBtn" style="border:none;background:none;">Sign out</button>
      `;
      document.getElementById('logoutBtn').addEventListener('click', auth.logout);
    } else {
      accountSlot.innerHTML = `<a href="/login.html" class="nav-icon-link">👤 Sign in</a>`;
    }
  }

  if (adminLink) {
    adminLink.style.display = auth.isAdmin() ? 'inline-flex' : 'none';
  }

  const searchInput = document.getElementById('navSearchInput');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        window.location.href = `/products.html?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }
}

const CATEGORY_ICONS = {
  Smartphones: '📱',
  Laptops: '💻',
  Audio: '🎧',
  Wearables: '⌚',
  Accessories: '🔋',
  Gaming: '🎮'
};

function renderCategoryStrip(categories, active) {
  const el = document.getElementById('categoryStrip');
  if (!el) return;
  const chips = ['All', ...categories].map((c) => {
    const isActive = (active || 'All') === c;
    return `<a href="/products.html${c === 'All' ? '' : '?category=' + encodeURIComponent(c)}"
              class="chip${isActive ? ' active' : ''}">${CATEGORY_ICONS[c] ? CATEGORY_ICONS[c] + ' ' : ''}${escapeHtml(c)}</a>`;
  });
  el.innerHTML = chips.join('');
}

function productCardHTML(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  const stockClass = p.stock <= 5 ? 'low' : 'in';
  const stockLabel = p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock';
  return `
    <div class="card">
      <a href="/product.html?id=${p.id}" class="card-media" style="background:${p.color}22;">
        ${discount ? `<span class="card-badge">-${discount}%</span>` : ''}
        <span>${p.icon}</span>
      </a>
      <div class="card-body">
        <span class="card-brand">${escapeHtml(p.brand)}</span>
        <a href="/product.html?id=${p.id}"><h3 class="card-name">${escapeHtml(p.name)}</h3></a>
        <div class="card-meta">
          <span class="stock-dot ${stockClass}"></span> ${stockLabel}
          ${p.rating ? `<span>· ★ ${p.rating}</span>` : ''}
        </div>
        <div class="price-row">
          <span class="price">${formatBDT(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatBDT(p.oldPrice)}</span>` : ''}
        </div>
        <button class="btn btn-primary btn-sm btn-block card-add" data-add-to-cart="${p.id}" ${p.stock === 0 ? 'disabled' : ''}>
          ${p.stock === 0 ? 'Out of stock' : 'Add to cart'}
        </button>
      </div>
    </div>`;
}

function bindAddToCartButtons(root = document) {
  root.querySelectorAll('[data-add-to-cart]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      cart.add(btn.getAttribute('data-add-to-cart'), 1);
      toast('Added to cart');
    });
  });
}

document.addEventListener('DOMContentLoaded', initNav);

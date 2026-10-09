(function () {
  const id = new URLSearchParams(window.location.search).get('id');
  let qty = 1;
  let product = null;

  async function load() {
    if (!id) { window.location.href = '/products.html'; return; }
    try {
      const data = await api.getProduct(id);
      product = data.product;
      renderProduct(product);
      renderRelated(data.related);
    } catch (err) {
      document.getElementById('pdWrap').innerHTML = `<p class="text-soft">${escapeHtml(err.message)}</p>`;
    }
  }

  function renderProduct(p) {
    document.title = `${p.name} — Gadgets in BD`;
    const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;

    document.getElementById('pdWrap').innerHTML = `
      <div class="pd-media" style="background:${p.color}22;">${p.icon}</div>
      <div>
        <span class="card-brand">${escapeHtml(p.brand)}</span>
        <h1 style="margin-top:.2em; font-size:2rem;">${escapeHtml(p.name)}</h1>
        <div class="card-meta text-sm">
          <span class="stock-dot ${p.stock <= 5 ? 'low' : 'in'}"></span>
          ${p.stock === 0 ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left in stock` : 'In stock'}
          ${p.rating ? `<span>· ★ ${p.rating} (${p.reviews} reviews)</span>` : ''}
        </div>
        <div class="price-row" style="margin-top:14px;">
          <span class="price" style="font-size:26px;">${formatBDT(p.price)}</span>
          ${p.oldPrice ? `<span class="price-old">${formatBDT(p.oldPrice)}</span>` : ''}
          ${discount ? `<span class="badge cancelled">-${discount}%</span>` : ''}
        </div>
        <p class="mt-16">${escapeHtml(p.description)}</p>

        <div class="pd-specs">
          ${p.specs.map((s) => `<div class="pd-spec-row"><span class="k">${escapeHtml(s.label)}</span><span class="v">${escapeHtml(s.value)}</span></div>`).join('')}
        </div>

        <div class="qty-row">
          <span class="text-sm text-soft">Quantity</span>
          <div class="qty-control">
            <button id="qtyMinus" type="button">−</button>
            <span id="qtyValue">1</span>
            <button id="qtyPlus" type="button">+</button>
          </div>
        </div>

        <div class="flex gap-12">
          <button class="btn btn-primary" id="addBtn" ${p.stock === 0 ? 'disabled' : ''}>
            🛒 Add to cart
          </button>
          <a href="/checkout.html" class="btn btn-accent" id="buyNowBtn" style="${p.stock === 0 ? 'pointer-events:none;opacity:.5;' : ''}">
            Buy now
          </a>
        </div>
        <p class="text-sm text-soft mt-16">💳 Cash on Delivery · bKash · Nagad &nbsp;·&nbsp; 🚚 Free delivery over ৳3,000 &nbsp;·&nbsp; 🔄 7-day replacement</p>
      </div>
    `;

    const qtyValue = document.getElementById('qtyValue');
    document.getElementById('qtyMinus').addEventListener('click', () => {
      qty = Math.max(1, qty - 1);
      qtyValue.textContent = qty;
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
      qty = Math.min(p.stock || 1, qty + 1);
      qtyValue.textContent = qty;
    });
    document.getElementById('addBtn').addEventListener('click', () => {
      cart.add(p.id, qty);
      toast(`Added ${qty} × ${p.name} to cart`);
    });
    document.getElementById('buyNowBtn').addEventListener('click', () => {
      cart.add(p.id, qty);
    });
  }

  function renderRelated(related) {
    const grid = document.getElementById('relatedGrid');
    if (!related.length) {
      document.getElementById('relatedSection').style.display = 'none';
      return;
    }
    grid.innerHTML = related.map(productCardHTML).join('');
    bindAddToCartButtons(grid);
  }

  load();
})();

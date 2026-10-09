(async function () {
  const items = cart.get();

  if (items.length === 0) {
    document.getElementById('cartEmpty').style.display = 'block';
    document.getElementById('cartLayout').style.display = 'none';
    return;
  }

  try {
    const { items: allProducts } = await api.listProducts();
    const byId = Object.fromEntries(allProducts.map((p) => [p.id, p]));

    // Drop any cart lines whose product no longer exists.
    const validItems = items.filter((i) => byId[i.productId]);
    if (validItems.length !== items.length) cart.save(validItems);

    if (validItems.length === 0) {
      document.getElementById('cartEmpty').style.display = 'block';
      document.getElementById('cartLayout').style.display = 'none';
      return;
    }

    render(validItems, byId);
  } catch (err) {
    toast(err.message, 'error');
  }

  function render(items, byId) {
    document.getElementById('cartLayout').style.display = 'grid';
    const linesEl = document.getElementById('cartLines');

    linesEl.innerHTML = items.map(({ productId, qty }) => {
      const p = byId[productId];
      return `
        <div class="cart-line" data-line="${productId}">
          <a href="/product.html?id=${p.id}" class="thumb" style="background:${p.color}22;">${p.icon}</a>
          <div>
            <a href="/product.html?id=${p.id}"><div class="name">${escapeHtml(p.name)}</div></a>
            <div class="unit">${formatBDT(p.price)} each</div>
          </div>
          <div class="qty-control">
            <button type="button" data-minus="${p.id}">−</button>
            <span>${qty}</span>
            <button type="button" data-plus="${p.id}" ${qty >= p.stock ? 'disabled' : ''}>+</button>
          </div>
          <div class="flex" style="flex-direction:column; align-items:flex-end; gap:8px;">
            <span class="price mono">${formatBDT(p.price * qty)}</span>
            <button type="button" class="btn-ghost text-sm" data-remove="${p.id}">Remove</button>
          </div>
        </div>`;
    }).join('');

    const subtotal = items.reduce((sum, i) => sum + byId[i.productId].price * i.qty, 0);
    const shipping = subtotal >= 3000 || subtotal === 0 ? 0 : 80;

    document.getElementById('sumSubtotal').textContent = formatBDT(subtotal);
    document.getElementById('sumShipping').textContent = shipping === 0 ? 'Free' : formatBDT(shipping);
    document.getElementById('sumTotal').textContent = formatBDT(subtotal + shipping);

    linesEl.querySelectorAll('[data-plus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-plus');
        const current = cart.get().find((i) => i.productId === id);
        cart.setQty(id, current.qty + 1);
        location.reload();
      });
    });
    linesEl.querySelectorAll('[data-minus]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-minus');
        const current = cart.get().find((i) => i.productId === id);
        cart.setQty(id, current.qty - 1);
        location.reload();
      });
    });
    linesEl.querySelectorAll('[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        cart.remove(btn.getAttribute('data-remove'));
        toast('Removed from cart');
        location.reload();
      });
    });
  }
})();

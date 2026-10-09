(async function () {
  if (!auth.requireLogin('/checkout.html')) return;

  const items = cart.get();
  if (items.length === 0) {
    window.location.href = '/cart.html';
    return;
  }

  let byId = {};
  try {
    const { items: allProducts } = await api.listProducts();
    byId = Object.fromEntries(allProducts.map((p) => [p.id, p]));
  } catch (err) {
    toast(err.message, 'error');
    return;
  }

  const validItems = items.filter((i) => byId[i.productId]);
  const subtotal = validItems.reduce((sum, i) => sum + byId[i.productId].price * i.qty, 0);
  const shipping = subtotal >= 3000 ? 0 : 80;

  document.getElementById('summaryLines').innerHTML = validItems.map((i) => {
    const p = byId[i.productId];
    return `<div class="mini-line"><span>${escapeHtml(p.name)} × ${i.qty}</span><span class="mono">${formatBDT(p.price * i.qty)}</span></div>`;
  }).join('');
  document.getElementById('ckSubtotal').textContent = formatBDT(subtotal);
  document.getElementById('ckShipping').textContent = shipping === 0 ? 'Free' : formatBDT(shipping);
  document.getElementById('ckTotal').textContent = formatBDT(subtotal + shipping);

  document.querySelectorAll('.pay-option').forEach((el) => {
    el.addEventListener('click', () => {
      document.querySelectorAll('.pay-option').forEach((o) => o.classList.remove('selected'));
      el.classList.add('selected');
      el.querySelector('input').checked = true;
    });
  });

  const user = auth.getUser();
  if (user?.name) document.getElementById('name').value = user.name;

  document.getElementById('checkoutForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('formError');
    errorBox.style.display = 'none';

    const payload = {
      items: validItems.map((i) => ({ productId: i.productId, qty: i.qty })),
      shipping: {
        name: document.getElementById('name').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        address: document.getElementById('address').value.trim(),
        city: document.getElementById('city').value.trim()
      },
      paymentMethod: document.querySelector('input[name="payment"]:checked').value
    };

    const btn = document.getElementById('placeOrderBtn');
    btn.disabled = true;
    btn.textContent = 'Placing order…';

    try {
      const { order } = await api.placeOrder(payload);
      cart.clear();
      window.location.href = `/orders.html?placed=${order.id}`;
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Place order';
    }
  });
})();

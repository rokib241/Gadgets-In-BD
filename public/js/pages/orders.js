(async function () {
  if (!auth.requireLogin('/orders.html')) return;

  const placedId = new URLSearchParams(window.location.search).get('placed');
  if (placedId) document.getElementById('placedBanner').style.display = 'block';

  try {
    const { orders } = await api.myOrders();

    if (orders.length === 0) {
      document.getElementById('emptyOrders').style.display = 'block';
      return;
    }

    document.getElementById('ordersList').innerHTML = orders.map((o) => `
      <div class="order-card">
        <div class="order-head">
          <div>
            <div class="order-id">ORDER #${o.id.slice(0, 8).toUpperCase()}</div>
            <div class="text-sm text-soft">${new Date(o.createdAt).toLocaleString('en-BD', { dateStyle: 'medium', timeStyle: 'short' })}</div>
          </div>
          <span class="badge ${o.status}">${o.status}</span>
        </div>
        ${o.items.map((i) => `
          <div class="order-item-row">
            <span>${i.icon} ${escapeHtml(i.name)} × ${i.qty}</span>
            <span class="mono">${formatBDT(i.price * i.qty)}</span>
          </div>
        `).join('')}
        <div class="order-item-row" style="border-top:1px solid var(--line); margin-top:6px; padding-top:10px; font-weight:700;">
          <span>Total (${o.paymentMethod.toUpperCase()})</span>
          <span class="mono">${formatBDT(o.total)}</span>
        </div>
        <p class="text-sm text-soft mt-8" style="margin-bottom:0;">Delivering to ${escapeHtml(o.shipping.address)}, ${escapeHtml(o.shipping.city)}</p>
      </div>
    `).join('');
  } catch (err) {
    toast(err.message, 'error');
  }
})();

(async function () {
  try {
    const { items, categories } = await api.listProducts();

    renderCategoryStrip(categories, 'All');

    const categoryGrid = document.getElementById('categoryGrid');
    categoryGrid.innerHTML = categories.map((c) => `
      <a href="/products.html?category=${encodeURIComponent(c)}" class="card" style="text-align:center; padding:22px 10px; align-items:center;">
        <span style="font-size:32px;">${CATEGORY_ICONS[c] || '📦'}</span>
        <h3 class="mt-8" style="margin-bottom:0;">${escapeHtml(c)}</h3>
      </a>
    `).join('');

    const featured = items.filter((p) => p.featured).slice(0, 8);
    const featuredGrid = document.getElementById('featuredGrid');
    featuredGrid.innerHTML = (featured.length ? featured : items.slice(0, 8))
      .map(productCardHTML)
      .join('');
    bindAddToCartButtons(featuredGrid);
  } catch (err) {
    toast(err.message, 'error');
  }
})();

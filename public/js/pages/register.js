(function () {
  if (auth.isLoggedIn()) {
    window.location.href = '/index.html';
    return;
  }

  document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('formError');
    errorBox.style.display = 'none';

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Creating account…';

    try {
      const { token, user } = await api.register({
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      });
      auth.save(token, user);
      window.location.href = '/index.html';
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Create account';
    }
  });
})();

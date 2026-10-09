(function () {
  if (auth.isLoggedIn()) {
    window.location.href = '/index.html';
    return;
  }

  document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = document.getElementById('formError');
    errorBox.style.display = 'none';

    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.textContent = 'Signing in…';

    try {
      const { token, user } = await api.login({
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value
      });
      auth.save(token, user);
      const next = new URLSearchParams(window.location.search).get('next');
      window.location.href = next || '/index.html';
    } catch (err) {
      errorBox.textContent = err.message;
      errorBox.style.display = 'block';
      btn.disabled = false;
      btn.textContent = 'Sign in';
    }
  });
})();

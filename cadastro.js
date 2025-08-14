document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const MAX_USERNAME = 20;
  const MAX_PASSWORD = 26;

  if (!username || !email || !password) {
    document.getElementById('mensagem').innerText = 'Preencha todos os campos.';
    return;
  }

  if (username.length > MAX_USERNAME) {
    document.getElementById('mensagem').innerText = `Nome de usuário deve ter no máximo ${MAX_USERNAME} letras.`;
    return;
  }

  if (password.length > MAX_PASSWORD) {
    document.getElementById('mensagem').innerText = `Senha deve ter no máximo ${MAX_PASSWORD} caracteres.`;
    return;
  }

  fetch('cadastrar_usuario.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.text())
  .then(data => {
    document.getElementById('mensagem').innerText = data;
    if (data.toLowerCase().includes('sucesso')) {
      this.reset();
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('mensagem').innerText = 'Erro ao conectar com o servidor.';
  });
});
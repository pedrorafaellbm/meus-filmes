document.getElementById('register-form').addEventListener('submit', function (e) { 
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const mensagemEl = document.getElementById('mensagem');

  if (!username || !email || !password) {
    mensagemEl.innerText = 'Preencha todos os campos.';
    return;
  }

  fetch('cadastrar_usuario.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.json())
  .then(data => {
    mensagemEl.innerText = data.message;
    if (data.success) {
      // Redireciona automaticamente para login.html
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000);
    }
  })
  .catch(err => {
    console.error(err);
    mensagemEl.innerText = 'Erro ao conectar com o servidor.';
  });
});
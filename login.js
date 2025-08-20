document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    document.getElementById('mensagem-login').innerText = 'Preencha todos os campos.';
    return;
  }

  fetch('login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.text())
  .then(data => {
    document.getElementById('mensagem-login').innerText = data;

    if (data.toLowerCase().includes('bem-sucedido') || data.toLowerCase().includes('sucesso')) {
      setTimeout(() => { 
        window.location.href = 'dashboard.html'; 
      }, 1000);
    }
  })
  .catch(err => {
    console.error(err);
    document.getElementById('mensagem-login').innerText = 'Erro ao conectar com o servidor.';
  });
});
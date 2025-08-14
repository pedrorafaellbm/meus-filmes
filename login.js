document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    document.getElementById('mensagem-login').innerText = 'Preencha todos os campos.';
    return;
  }

  // Enviar dados para o PHP
  fetch('login_usuario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.text())
  .then(data => {
    document.getElementById('mensagem-login').innerText = data;

    if (data.toLowerCase().includes('bem-vindo') || data.toLowerCase().includes('welcome')) {
      // Redireciona para a página principal (exemplo)
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    }
  })
  .catch(error => console.error('Erro:', error));
});
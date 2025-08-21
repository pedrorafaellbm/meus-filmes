document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const mensagemEl = document.getElementById('mensagem-login');

  if (!username || !password) {
    mensagemEl.innerText = 'Preencha todos os campos.';
    return;
  }

  fetch('login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.json())
  .then(data => {
    mensagemEl.innerText = data.message;

    if (data.success) {
      // Salvar usuário no localStorage
      localStorage.setItem('usuario', JSON.stringify({
        id: data.user.id,
        username: data.user.username,
        perfis: data.user.perfis || []
      }));

      // Redirecionar para perfis.html
      setTimeout(() => { 
        window.location.href = 'perfis.html'; 
      }, 1000);
    }
  })
  .catch(err => {
    console.error(err);
    mensagemEl.innerText = 'Erro ao conectar com o servidor.';
  });
});
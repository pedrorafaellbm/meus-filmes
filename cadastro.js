document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    document.getElementById('mensagem').innerText = currentLang === 'pt' 
      ? 'Preencha todos os campos.' 
      : 'Please fill in all fields.';
    return;
  }

  fetch('cadastrar_usuario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.json())
  .then(data => {
    // Redireciona apenas se for sucesso, sem exibir mensagem
    if (data.success) {
      window.location.href = 'login.html';
    } else {
      // Se houver um erro, a mensagem ainda será exibida
      document.getElementById('mensagem').innerText = data.message;
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    document.getElementById('mensagem').innerText = currentLang === 'pt' ? 'Erro de conexão.' : 'Connection error.';
  });
});

// O restante do seu código de idioma...
let currentLang = 'pt';
document.getElementById('lang-toggle').addEventListener('click', function () {
  // ... seu código de tradução
});
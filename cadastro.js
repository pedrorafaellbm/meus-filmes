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

  // Envia dados para o PHP
  fetch('cadastrar_usuario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  // Converte a resposta para JSON
  .then(response => response.json())
  .then(data => {
    // Exibe a mensagem do servidor
    document.getElementById('mensagem').innerText = data.message;

    // Se o cadastro foi um sucesso, redireciona o usuário
    if (data.success) {
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1000); // Redireciona após 1 segundo (tempo para o usuário ler a mensagem)
    }
  })
  .catch(error => {
    console.error('Erro:', error);
    document.getElementById('mensagem').innerText = currentLang === 'pt' ? 'Erro de conexão.' : 'Connection error.';
  });
});

// O restante do seu código de idioma pode continuar o mesmo.
let currentLang = 'pt';
document.getElementById('lang-toggle').addEventListener('click', function () {
  // ... seu código de tradução
});
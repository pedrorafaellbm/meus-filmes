document.getElementById('register-form').addEventListener('submit', function (e) { 
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  const MAX_USERNAME = 20;
  const MAX_PASSWORD = 26;
  const mensagemEl = document.getElementById('mensagem');

  // Validação básica
  if (!username || !email || !password) {
    mensagemEl.innerText = 'Preencha todos os campos.';
    return;
  }

  if (username.length > MAX_USERNAME) {
    mensagemEl.innerText = `Nome de usuário deve ter no máximo ${MAX_USERNAME} letras.`;
    return;
  }

  if (password.length > MAX_PASSWORD) {
    mensagemEl.innerText = `Senha deve ter no máximo ${MAX_PASSWORD} caracteres.`;
    return;
  }

  // Envia os dados para o PHP
  fetch('cadastrar_usuario.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(res => res.text()) // Recebe o retorno como texto
  .then(data => {
    mensagemEl.innerText = data; // Apenas exibe a resposta do PHP
    this.reset(); // Limpa o formulário
  })
  .catch(err => {
    console.error(err);
    mensagemEl.innerText = 'Erro ao conectar com o servidor.';
  });
});
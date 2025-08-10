document.getElementById('register-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    document.getElementById('mensagem').innerText = 'Preencha todos os campos.';
    return;
  }

  // Armazena o usuário no localStorage (sem segurança real)
  const user = { username, email, password };
  localStorage.setItem('usuario', JSON.stringify(user));

  document.getElementById('mensagem').innerText = 'Conta criada com sucesso!';
  this.reset();
});


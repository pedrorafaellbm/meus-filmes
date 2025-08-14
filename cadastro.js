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

  // Enviar dados para o PHP
  fetch('cadastrar_usuario.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: `username=${encodeURIComponent(username)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  })
  .then(response => response.text())
  .then(data => {
    document.getElementById('mensagem').innerText = data;

    // Limpar formulário se cadastro bem-sucedido
    if (data.toLowerCase().includes('sucesso') || data.toLowerCase().includes('successfully')) {
      this.reset();
    }
  })
  .catch(error => console.error('Erro:', error));
});

// Idioma
let currentLang = 'pt';

document.getElementById('lang-toggle').addEventListener('click', function () {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';

  if (currentLang === 'en') {
    document.getElementById('main-title').innerText = 'Unlimited movies, TV shows and more';
    document.getElementById('form-title').innerText = 'Create Account';
    document.getElementById('username').placeholder = 'Username (min. 20 letters)';
    document.getElementById('email').placeholder = 'Email';
    document.getElementById('password').placeholder = 'Password (min. 26 characters)';
    document.getElementById('register-button').innerText = 'Register';
    document.getElementById('login-link-text').innerHTML = 'Already have an account? <a href="#">Sign In</a>';
    this.innerText = 'PT';
  } else {
    document.getElementById('main-title').innerText = 'Filmes, programas de TV e muito mais ilimitados';
    document.getElementById('form-title').innerText = 'Criar conta';
    document.getElementById('username').placeholder = 'Nome de usuário (mín. 20 letras)';
    document.getElementById('email').placeholder = 'Email';
    document.getElementById('password').placeholder = 'Senha (mín. 26 caracteres)';
    document.getElementById('register-button').innerText = 'Registrar';
    document.getElementById('login-link-text').innerHTML = 'Já tem uma conta? <a href="#">Entrar</a>';
    this.innerText = 'EN';
  }

  document.getElementById('mensagem').innerText = '';
});
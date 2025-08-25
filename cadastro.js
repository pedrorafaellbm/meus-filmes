document.getElementById('register-form').addEventListener('submit', function(e) {
  // Evita que o formulário recarregue a página
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const mensagem = document.getElementById('mensagem');

  // Verifica se os campos estão preenchidos
  if (!username || !email || !password) {
    mensagem.innerText = currentLang === 'pt' ? 'Preencha todos os campos.' : 'Please fill in all fields.';
    return;
  }

  // Prepara os dados para enviar via POST
  const formData = new FormData();
  formData.append('username', username);
  formData.append('email', email);
  formData.append('password', password);

  // Envia os dados para o PHP usando fetch
  fetch('cadastrar_usuario.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      // Verifica se a resposta foi bem-sucedida antes de tentar ler o JSON
      if (!response.ok) {
        throw new Error('Erro na resposta do servidor.');
      }
      return response.json();
    })
    .then(data => {
      // Exibe a mensagem do PHP
      mensagem.innerText = data.message;
      
      // Se o cadastro foi um sucesso, redireciona o usuário após 2 segundos
      if (data.success) {
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 2000); 
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      mensagem.innerText = currentLang === 'pt' ? 'Erro ao conectar com o servidor.' : 'Server connection error.';
    });
});

// Lógica para a troca de idioma
let currentLang = 'pt';
document.getElementById('lang-toggle').addEventListener('click', function() {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  if (currentLang === 'en') {
    document.getElementById('main-title').innerText = 'Unlimited movies, TV shows and more';
    document.getElementById('form-title').innerText = 'Create Account';
    document.getElementById('username').placeholder = 'Username (min. 20 letters)';
    document.getElementById('email').placeholder = 'Email';
    document.getElementById('password').placeholder = 'Password (min. 26 characters)';
    document.getElementById('register-button').innerText = 'Register';
    document.getElementById('login-link-text').innerHTML = 'Already have an account? <a href="login.html">Sign In</a>';
    this.innerText = 'PT';
  } else {
    document.getElementById('main-title').innerText = 'Filmes, programas de TV e muito mais ilimitados';
    document.getElementById('form-title').innerText = 'Criar conta';
    document.getElementById('username').placeholder = 'Nome de usuário (mín. 20 letras)';
    document.getElementById('email').placeholder = 'Email';
    document.getElementById('password').placeholder = 'Senha (mín. 26 caracteres)';
    document.getElementById('register-button').innerText = 'Registrar';
    document.getElementById('login-link-text').innerHTML = 'Já tem uma conta? <a href="login.html">Entrar</a>';
    this.innerText = 'EN';
  }
  document.getElementById('mensagem').innerText = '';
});
document.getElementById('login-form').addEventListener('submit', function(e) {
  // Evita que o formulário recarregue a página
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const mensagem = document.getElementById('mensagem');

  // Verifica se os campos estão preenchidos
  if (!email || !password) {
    mensagem.innerText = currentLang === 'pt' ? 'Preencha todos os campos.' : 'Please fill in all fields.';
    return;
  }

  // Prepara os dados para enviar via POST
  const formData = new FormData();
  formData.append('email', email);
  formData.append('password', password);

  // Envia os dados para o PHP (supondo um arquivo login_usuario.php)
  fetch('login_usuario.php', {
      method: 'POST',
      body: formData
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro na resposta do servidor.');
      }
      return response.json();
    })
    .then(data => {
      mensagem.innerText = data.message;
      
      // Se o login foi um sucesso, redireciona o usuário após 2 segundos
      if (data.success) {
        setTimeout(() => {
          // Redireciona para a página de perfis
          window.location.href = 'perfis.html';
        }, 2000); 
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      mensagem.innerText = currentLang === 'pt' ? 'Erro ao conectar com o servidor.' : 'Server connection error.';
    });
});

// Lógica para a troca de idioma (manter a consistência)
let currentLang = 'pt';
document.getElementById('lang-toggle').addEventListener('click', function() {
  currentLang = currentLang === 'pt' ? 'en' : 'pt';
  if (currentLang === 'en') {
    document.getElementById('main-title').innerText = 'Unlimited movies, TV shows and more';
    document.getElementById('form-title').innerText = 'Sign In';
    document.getElementById('email').placeholder = 'Email';
    document.getElementById('password').placeholder = 'Password';
    document.getElementById('login-button').innerText = 'Sign In';
    document.getElementById('cadastro-link-text').innerHTML = 'Don\'t have an account? <a href="cadastro.html">Sign Up</a>';
    this.innerText = 'PT';
  } else {
    document.getElementById('main-title').innerText = 'Filmes, programas de TV e muito mais ilimitados';
    document.getElementById('form-title').innerText = 'Entrar';
    document.getElementById('email').placeholder = 'Email';
    document.getElementById('password').placeholder = 'Senha';
    document.getElementById('login-button').innerText = 'Entrar';
    document.getElementById('cadastro-link-text').innerHTML = 'Não tem uma conta? <a href="cadastro.html">Criar conta</a>';
    this.innerText = 'EN';
  }
  document.getElementById('mensagem').innerText = '';
});

// Lógica para o formulário de login
document.getElementById('login-form').addEventListener('submit', function(e) {
  // Evita que o formulário recarregue a página
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const mensagem = document.getElementById('mensagem');

  // Verifica se os campos estão preenchidos
  if (!username || !password) {
    mensagem.innerText = 'Preencha todos os campos.';
    return;
  }

  // Prepara os dados para enviar via POST
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);

  // Envia os dados para o PHP usando fetch
  fetch('login_usuario.php', {
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

      // Se o login foi um sucesso, redireciona o usuário para a área de perfis
      if (data.success) {
        setTimeout(() => {
          // Redireciona para o arquivo de perfis
          window.location.href = 'perfis.html'; 
        }, 2000); 
      }
    })
    .catch(error => {
      console.error('Erro:', error);
      mensagem.innerText = 'Erro ao conectar com o servidor.';
    });
});

const storageKey = 'usuario';

// Função para pegar usuário do localStorage
function getUsuario() {
  const usuarioStr = localStorage.getItem(storageKey);
  if (!usuarioStr) return null;
  return JSON.parse(usuarioStr);
}

// Salvar usuário com perfis
function setUsuario(usuario) {
  localStorage.setItem(storageKey, JSON.stringify(usuario));
}

// Carregar perfis na tela
function carregarPerfis() {
  const usuario = getUsuario();
  if (!usuario) {
    alert('Usuário não encontrado! Faça login primeiro.');
    return;
  }
  if (!usuario.perfis) usuario.perfis = [];

  const container = document.getElementById('perfil-lista');
  container.innerHTML = '';

  usuario.perfis.forEach((perfil, i) => {
    const div = document.createElement('div');
    div.className = 'perfil';
    div.title = perfil.nome;
    div.dataset.index = i;

    div.innerHTML = `
      <img src="https://i.pravatar.cc/150?u=${encodeURIComponent(perfil.nome)}" alt="${perfil.nome}" />
      <div class="perfil-nome">${perfil.nome}</div>
    `;

    div.addEventListener('click', () => {
      localStorage.setItem('perfil-selecionado', JSON.stringify(perfil));
      window.location.href = 'index.html';
    });

    container.appendChild(div);
  });
}

// Adicionar novo perfil
function adicionarPerfil(nome) {
  if (!nome || nome.trim().length === 0) return false;
  const usuario = getUsuario();
  if (!usuario) return false;

  if (!usuario.perfis) usuario.perfis = [];

  if (usuario.perfis.find(p => p.nome.toLowerCase() === nome.toLowerCase())) {
    alert('Perfil já existe com esse nome.');
    return false;
  }

  usuario.perfis.push({ nome: nome.trim() });
  setUsuario(usuario);
  carregarPerfis();
  return true;
}

// Executa após carregar a página
document.addEventListener('DOMContentLoaded', () => {
  carregarPerfis();

  const modalElement = document.getElementById('modalPerfil');
  const modal = new bootstrap.Modal(modalElement);
  const btnAddPerfil = document.getElementById('btn-add-perfil');
  const btnSalvarPerfil = document.getElementById('salvarPerfil');
  const inputNomePerfil = document.getElementById('novoPerfilNome');

  btnAddPerfil.addEventListener('click', () => {
    inputNomePerfil.value = '';
    modal.show();
  });

  btnSalvarPerfil.addEventListener('click', () => {
    const nome = inputNomePerfil.value.trim();
    if (nome.length < 3) {
      alert('Digite um nome com pelo menos 3 caracteres.');
      return;
    }
    const added = adicionarPerfil(nome);
    if (added) {
      modal.hide();
    }
  });
});
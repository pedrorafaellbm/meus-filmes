// Função para carregar os perfis do usuário logado
async function carregarPerfis() {
    const perfisGrid = document.getElementById('perfis-grid');
    perfisGrid.innerHTML = ''; // Limpa a grade antes de adicionar os perfis

    try {
        const response = await fetch('obter_perfis.php');
        const data = await response.json();

        if (data.success) {
            data.perfis.forEach(perfil => {
                const perfilItem = document.createElement('div');
                perfilItem.className = 'perfil-item';
                perfilItem.dataset.id = perfil.id;
                perfilItem.innerHTML = `
                    <img src="${perfil.avatar_url}" alt="Avatar de ${perfil.nome}" class="perfil-img">
                    <div class="perfil-nome">${perfil.nome}</div>
                `;
                perfilItem.addEventListener('click', () => selecionarPerfil(perfil.id));
                perfisGrid.appendChild(perfilItem);
            });

            // Adiciona a opção para criar um novo perfil
            const adicionarPerfil = document.createElement('div');
            adicionarPerfil.className = 'perfil-item adicionar-perfil';
            adicionarPerfil.innerHTML = `<span>+</span>`;
            adicionarPerfil.dataset.bsToggle = "modal";
            adicionarPerfil.dataset.bsTarget = "#modalCriarPerfil";
            perfisGrid.appendChild(adicionarPerfil);

        } else {
            console.error('Erro ao carregar perfis:', data.message);
            // Redireciona para o login se não estiver autenticado
            if (data.message.includes('autenticado')) {
                window.location.href = 'login.html';
            }
        }
    } catch (error) {
        console.error('Erro de rede ao carregar perfis:', error);
    }
}

// Função para selecionar um perfil e salvar na sessão
async function selecionarPerfil(perfilId) {
    try {
        const response = await fetch('selecionar_perfil.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ perfil_id: perfilId })
        });
        const data = await response.json();

        if (data.success) {
            // Redireciona para a página principal após a seleção
            window.location.href = 'inicio.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro ao selecionar perfil:', error);
    }
}

// Lógica do formulário de criação de perfil no modal
document.getElementById('form-criar-perfil').addEventListener('submit', async function(e) {
    e.preventDefault();
    const nomePerfil = document.getElementById('nomePerfil').value;
    const mensagemModal = document.getElementById('mensagem-modal');

    const formData = new FormData();
    formData.append('nome', nomePerfil);

    try {
        const response = await fetch('criar_perfil.php', {
            method: 'POST',
            body: formData
        });
        const data = await response.json();
        
        mensagemModal.textContent = data.message;
        
        if (data.success) {
            // Fecha o modal e recarrega a lista de perfis
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalCriarPerfil'));
            modal.hide();
            await carregarPerfis();
        }
    } catch (error) {
        console.error('Erro ao criar perfil:', error);
        mensagemModal.textContent = 'Erro ao conectar com o servidor.';
    }
});

// Event listener para o botão de sair
document.getElementById('sair-btn').addEventListener('click', async () => {
    try {
        const response = await fetch('logout.php');
        const data = await response.json();
        if (data.success) {
            window.location.href = 'login.html';
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro ao sair:', error);
    }
});


// Carrega os perfis quando a página é carregada
document.addEventListener('DOMContentLoaded', carregarPerfis);

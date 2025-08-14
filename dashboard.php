<?php
session_start();
require 'conexao.php'; // arquivo com a conexão ao MySQL

// Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    header("Location: login.html");
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// Busca os perfis do usuário logado
$sql = "SELECT id, nome FROM perfis WHERE usuario_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$perfis = [];
while ($row = $result->fetch_assoc()) {
    $perfis[] = $row;
}

$stmt->close();
$conn->close();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Escolha um Perfil</title>
    <link rel="stylesheet" href="dashboard.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
<div class="perfil-container">
    <h2>Escolha um perfil</h2>
    <div id="perfil-lista" class="d-flex gap-3 flex-wrap">
        <?php foreach ($perfis as $perfil): ?>
            <div class="perfil" onclick="selecionarPerfil(<?= $perfil['id'] ?>)">
                <img src="https://i.pravatar.cc/150?u=<?= urlencode($perfil['nome']) ?>" alt="<?= htmlspecialchars($perfil['nome']) ?>">
                <div class="perfil-nome"><?= htmlspecialchars($perfil['nome']) ?></div>
            </div>
        <?php endforeach; ?>
    </div>
    <button class="btn btn-warning mt-3" onclick="abrirModal()">+ Adicionar Perfil</button>
</div>

<!-- Modal -->
<div class="modal fade" id="modalPerfil" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content bg-dark text-white">
      <div class="modal-header">
        <h5 class="modal-title">Novo Perfil</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <input type="text" id="novoPerfilNome" class="form-control" placeholder="Nome do perfil">
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
        <button type="button" class="btn btn-warning" onclick="salvarPerfil()">Salvar</button>
      </div>
    </div>
  </div>
</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
<script>
function selecionarPerfil(idPerfil) {
    window.location.href = "index.php?perfil_id=" + idPerfil;
}

function abrirModal() {
    let modal = new bootstrap.Modal(document.getElementById('modalPerfil'));
    document.getElementById('novoPerfilNome').value = "";
    modal.show();
}

function salvarPerfil() {
    const nome = document.getElementById('novoPerfilNome').value.trim();
    if (nome.length < 3) {
        alert("Digite um nome com pelo menos 3 caracteres.");
        return;
    }

    fetch('salvar_perfil.php', {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: 'nome=' + encodeURIComponent(nome)
    })
    .then(res => res.text())
    .then(res => {
        if (res === 'ok') {
            location.reload();
        } else {
            alert(res);
        }
    });
}
</script>
</body>
</html>
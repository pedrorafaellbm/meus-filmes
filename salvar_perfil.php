<?php
session_start();
require 'conexao.php';

if (!isset($_SESSION['usuario_id'])) {
    echo "Usuário não logado.";
    exit();
}

$nome = trim($_POST['nome'] ?? '');
if (strlen($nome) < 3) {
    echo "Nome inválido.";
    exit();
}

$usuario_id = $_SESSION['usuario_id'];

// Verifica se já existe
$sql = "SELECT id FROM perfis WHERE usuario_id = ? AND nome = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $usuario_id, $nome);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo "Já existe um perfil com esse nome.";
    exit();
}
$stmt->close();

// Insere no banco
$sql = "INSERT INTO perfis (usuario_id, nome) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $usuario_id, $nome);
if ($stmt->execute()) {
    echo "ok";
} else {
    echo "Erro ao salvar.";
}
$stmt->close();
$conn->close();
<?php
// Inicia a sessão para acessar a variável de usuário logado
session_start();

// Inclui o arquivo de conexão com o banco de dados
require 'conexao.php';

// Define o cabeçalho para que a resposta seja em formato JSON
header('Content-Type: application/json');

// 1. Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado. Por favor, faça login novamente.']);
    exit();
}

// 2. Valida o nome do perfil recebido
$nome = trim($_POST['nome'] ?? '');
if (strlen($nome) < 3) {
    echo json_encode(['success' => false, 'message' => 'Nome de perfil inválido. O nome deve ter pelo menos 3 caracteres.']);
    exit();
}

// Obtém o ID do usuário logado
$usuario_id = $_SESSION['usuario_id'];

// 3. Verifica se um perfil com o mesmo nome já existe para este usuário
$sql = "SELECT id FROM perfis WHERE usuario_id = ? AND nome = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $usuario_id, $nome);
$stmt->execute();
$stmt->store_result();

if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'Já existe um perfil com esse nome.']);
    $stmt->close();
    $conn->close();
    exit();
}
$stmt->close();

// 4. Insere o novo perfil no banco de dados
$sql = "INSERT INTO perfis (usuario_id, nome) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("is", $usuario_id, $nome);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Perfil criado com sucesso!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar o perfil: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>

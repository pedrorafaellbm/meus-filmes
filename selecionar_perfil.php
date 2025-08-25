<?php
// Inicia a sessão para armazenar o ID do perfil
session_start();

// Inclui o arquivo de conexão
require 'conexao.php';

// Define o cabeçalho para retornar JSON
header('Content-Type: application/json');

// 1. Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit();
}

// 2. Recebe o ID do perfil via POST
$perfil_id = $_POST['perfil_id'] ?? null;

if (is_null($perfil_id)) {
    echo json_encode(['success' => false, 'message' => 'ID do perfil não fornecido.']);
    exit();
}

// 3. Verifica se o perfil pertence ao usuário logado
$stmt = $conn->prepare("SELECT id FROM perfis WHERE id = ? AND usuario_id = ?");
$stmt->bind_param("ii", $perfil_id, $_SESSION['usuario_id']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Perfil pertence ao usuário: salva o ID do perfil na sessão
    $_SESSION['perfil_id'] = $perfil_id;
    echo json_encode(['success' => true, 'message' => 'Perfil selecionado com sucesso!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Acesso negado.']);
}

$stmt->close();
$conn->close();
?>

<?php
// Inicia a sessão para acessar a variável de usuário logado
session_start();

// Inclui o arquivo de conexão com o banco de dados
require 'conexao.php';

// Define o cabeçalho para que a resposta seja em formato JSON
header('Content-Type: application/json');

// 1. Verifica se o usuário está logado
if (!isset($_SESSION['usuario_id'])) {
    echo json_encode(['success' => false, 'message' => 'Usuário não autenticado.']);
    exit();
}

// Obtém o ID do usuário logado
$usuario_id = $_SESSION['usuario_id'];

// 2. Prepara a consulta SQL para buscar os perfis do usuário
$sql = "SELECT id, nome, avatar_url FROM perfis WHERE usuario_id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $usuario_id);
$stmt->execute();
$result = $stmt->get_result();

$perfis = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $perfis[] = $row;
    }
}

// Retorna os perfis em formato JSON
echo json_encode(['success' => true, 'perfis' => $perfis]);

$stmt->close();
$conn->close();
?>

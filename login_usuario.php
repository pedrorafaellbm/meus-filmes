<?php
// Inicia a sessão para armazenar o ID do usuário
session_start();

// Inclui o arquivo de conexão com o banco de dados
require 'conexao.php';

// Define o cabeçalho para retornar JSON
header('Content-Type: application/json');

// Verifica se a requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Prepara a consulta para buscar o usuário pelo email
    $stmt = $conn->prepare("SELECT id, password FROM usuario WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        // Verifica a senha
        if (password_verify($password, $user['password'])) {
            // Login bem-sucedido: armazena o ID do usuário na sessão
            $_SESSION['usuario_id'] = $user['id'];
            echo json_encode(['success' => true, 'message' => 'Login bem-sucedido! Redirecionando...']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
}

$conn->close();
?>

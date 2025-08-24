<?php
// Define o cabeçalho para retornar uma resposta em JSON
header('Content-Type: application/json');

// Credenciais do banco de dados
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

// Cria a conexão com o banco de dados
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

// Verifica se houve erro na conexão
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados.']);
    exit;
}

// Verifica se a requisição foi feita com o método POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitiza e obtém os dados do formulário
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    // Prepara a consulta SQL para buscar o usuário pelo email
    $stmt = $conn->prepare("SELECT password FROM usuarios WHERE email = ?");
    
    // Verifica se a preparação da consulta falhou
    if ($stmt === false) {
        echo json_encode(['success' => false, 'message' => 'Erro na preparação da consulta: ' . $conn->error]);
        exit;
    }
    
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();
    
    // Verifica se o email foi encontrado
    if ($stmt->num_rows > 0) {
        $stmt->bind_result($hashed_password);
        $stmt->fetch();
        
        // Verifica se a senha fornecida corresponde à senha criptografada no banco de dados
        if (password_verify($password, $hashed_password)) {
            // Login bem-sucedido
            echo json_encode(['success' => true, 'message' => 'Login bem-sucedido! Redirecionando...']);
        } else {
            // Senha incorreta
            echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos.']);
        }
    } else {
        // Email não encontrado
        echo json_encode(['success' => false, 'message' => 'Email ou senha incorretos.']);
    }

    $stmt->close();
} else {
    // Método de requisição inválido
    echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
}

// Fecha a conexão com o banco de dados
$conn->close();
?>

<?php
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

// Configura o cabeçalho para retornar JSON
header('Content-Type: application/json');

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);

    // Verifica se os campos não estão vazios antes de tentar a inserção
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios.']);
        exit;
    }

    // AQUI: A linha foi alterada para usar a tabela 'usuario'
    $stmt = $conn->prepare("INSERT INTO usuario (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuário cadastrado com sucesso! Redirecionando...']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar usuário: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
}

$conn->close();
?>
<?php
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

// Configura o cabeçalho para retornar JSON
header('Content-Type: application/json');

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);


if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão: ' . $conn->connect_error]);
    exit;
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);

    // Prepara e executa a inserção no banco
    $stmt = $conn->prepare("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
        // Retorna sucesso para o JavaScrip        echo json_encode(['success' => true, 'message' => 'Usuário cadastrado com sucesso!']);
    } else {
        // Retorna falha para o JavaScript
        echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar usuário: ' . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>
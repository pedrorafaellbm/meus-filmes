<?php
header('Content-Type: application/json');

$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => "Erro de conexão: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $password = trim($_POST['password']);

    // AQUI ESTÁ A ALTERAÇÃO: Trocando a tabela de 'usuarios' para 'usuario'
    $stmt = $conn->prepare("SELECT id, username, password FROM usuario WHERE username=? OR email=? LIMIT 1");
    $stmt->bind_param("ss", $username, $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows === 1) {
        $stmt->bind_result($id, $usernameDB, $hashedPassword);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            echo json_encode([
                'success' => true,
                'message' => 'Login bem-sucedido!'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Senha incorreta.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuário não encontrado.']);
    }

    $stmt->close();
} else {
    echo json_encode(['success' => false, 'message' => 'Requisição inválida']);
}

$conn->close();

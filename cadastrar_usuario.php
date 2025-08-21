<?php
header('Content-Type: application/json'); // força retorno JSON

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
    $email = trim($_POST['email']);
    $password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);

    $stmt = $conn->prepare("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
        $user_id = $stmt->insert_id;
        echo json_encode([
            'success' => true,
            'message' => 'Usuário cadastrado com sucesso!',
            'user' => [
                'id' => $user_id,
                'username' => $username
            ]
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => "Erro ao cadastrar usuário: " . $stmt->error
        ]);
    }

    $stmt->close();
}
$conn->close();
?>
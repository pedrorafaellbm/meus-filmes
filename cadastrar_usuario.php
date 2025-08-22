<?php
header('Content-Type: application/json'); // força retorno JSON

$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
    echo json_encode(['success' => false, 'message' => "Erro de conexão: " . $conn->connect_error]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
@@ -18,13 +21,23 @@
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
        echo "Usuário cadastrado com sucesso!";
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
        echo "Erro ao cadastrar usuário: " . $stmt->error;
        echo json_encode([
            'success' => false,
            'message' => "Erro ao cadastrar usuário: " . $stmt->error
        ]);
    }

    $stmt->close();
}

$conn->close();
?>
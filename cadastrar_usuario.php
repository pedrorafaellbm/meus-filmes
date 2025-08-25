<?php
// Credenciais do banco de dados
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

// Configura o cabeçalho para retornar JSON
header('Content-Type: application/json');

// Cria a conexão com o banco de dados
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

// Verifica se houve erro na conexão
if ($conn->connect_error) {
    echo json_encode(['success' => false, 'message' => 'Erro de conexão com o banco de dados.']);
    exit;
}

// Verifica se a requisição é POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sanitiza e obtém os dados do formulário
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);

    // Verifica se os campos não estão vazios
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(['success' => false, 'message' => 'Todos os campos são obrigatórios.']);
        exit;
    }

    // Prepara a consulta SQL para inserção na tabela 'usuario'
    $stmt = $conn->prepare("INSERT INTO usuario (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Usuário cadastrado com sucesso! Redirecionando...']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Erro ao cadastrar usuário: ' . $stmt->error]);
    }

    $stmt->close();
} else {
    // Retorna erro se o método de requisição for inválido
    echo json_encode(['success' => false, 'message' => 'Método de requisição inválido.']);
}

// Fecha a conexão
$conn->close();
?>

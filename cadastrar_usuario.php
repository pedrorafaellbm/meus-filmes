<?php
header('Content-Type: text/plain; charset=utf-8');

// Conexão com MySQL
$host = "localhost";
$dbname = "streaming";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Recebe os dados do POST
    $username = trim($_POST['username'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $password = trim($_POST['password'] ?? '');

    // Validações
    if (!$username || !$email || !$password) {
        echo "Preencha todos os campos.";
        exit;
    }
    if (strlen($username) < 20) {
        echo "O nome de usuário precisa ter pelo menos 20 caracteres.";
        exit;
    }
    if (strlen($password) < 26) {
        echo "A senha precisa ter pelo menos 26 caracteres.";
        exit;
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "E-mail inválido.";
        exit;
    }

    // Verifica se o email já existe
    $stmt = $pdo->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo "Este e-mail já está cadastrado.";
        exit;
    }

    // Insere usuário no banco
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $stmt = $pdo->prepare("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)");
    $stmt->execute([$username, $email, $hashedPassword]);

    echo "Conta criada com sucesso!";
} catch (PDOException $e) {
    echo "Erro ao conectar: " . $e->getMessage();
}
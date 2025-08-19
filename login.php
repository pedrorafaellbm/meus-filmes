<?php
header('Content-Type: text/plain; charset=utf-8');
session_start();

$host = "localhost";
$dbname = "streaming";
$user = "root";
$pass = "";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $usernameOrEmail = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if (!$usernameOrEmail || !$password) {
        echo "Preencha todos os campos.";
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE username = ? OR email = ?");
    $stmt->execute([$usernameOrEmail, $usernameOrEmail]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userData) {
        echo "Usuário ou email não encontrado.";
        exit;
    }

    if (!password_verify($password, $userData['password'])) {
        echo "Senha incorreta.";
        exit;
    }

    $_SESSION['usuario_id'] = $userData['id'];
    $_SESSION['username'] = $userData['username'];
    echo "Login bem-sucedido!";
} catch (PDOException $e) {
    echo "Erro ao conectar: " . $e->getMessage();
}
?>
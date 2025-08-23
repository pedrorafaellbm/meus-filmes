<?php
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

// Cria a conexão com o banco de dados
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Erro de conexão: " . $conn->connect_error);
}

// Verifica se os dados do formulário foram enviados
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username']);
    $email = trim($_POST['email']);
    $password = password_hash(trim($_POST['password']), PASSWORD_DEFAULT);

    // Prepara e executa a inserção no banco
    $stmt = $conn->prepare("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $password);

    if ($stmt->execute()) {
        // Redireciona o usuário para a página de login
        header("Location: login.html");
        exit; // Garante que o script pare de ser executado
    } else {
        echo "Erro ao cadastrar usuário: " . $stmt->error;
    }

    $stmt->close();
}

$conn->close();
?>
Passo 2: O HTML
O seu HTML precisa ser um formulário que envie os dados para o PHP de forma tradicional, ou seja, com a página recarregando.

Ajuste o seu código HTML.

HTML

<form id="register-form" class="cadastro-form" action="cadastrar_usuario.php" method="post">
  <h2 id="form-title">Criar conta</h2>
  <input type="text" id="username" name="username" placeholder="Nome de usuário (mín. 20 letras)" required>
  <input type="email" id="email" name="email" placeholder="Email" required>
  <input type="password" id="password" name="password" placeholder="Senha (mín. 26 caracteres)" required>
  <button type="submit" id="register-button">Registrar</button>
  <p id="mensagem" class="mensagem"></p>
</form>
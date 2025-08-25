<?php
// Configurações do banco de dados
$servername = "localhost";
$usernameDB = "root";
$passwordDB = "";
$dbname = "streaming";

// Cria a conexão
$conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Conexão falhou: " . $conn->connect_error);
}
?>

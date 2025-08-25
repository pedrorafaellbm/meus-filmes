<?php
// Inicia a sessão
session_start();

// Limpa todas as variáveis da sessão
$_SESSION = array();

// Se for preciso destruir a sessão, também destrói o cookie de sessão.
// Nota: Isso irá destruir a sessão, e não apenas os dados da sessão!
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Finalmente, destrói a sessão
session_destroy();

// Retorna uma resposta de sucesso para o JavaScript
echo json_encode(['success' => true, 'message' => 'Logout bem-sucedido!']);
?>

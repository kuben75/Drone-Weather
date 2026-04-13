<?php
session_start([
    'cookie_httponly' => true,
    'cookie_secure' => true
]);
require_once __DIR__ . '/helpers.php';
function checkLogin(): bool
{
    if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin']) {
        return false;
    }
    if (time() > ($_SESSION['expire'] ?? 0)) {
        destroySession();
        redirect('index.php');
        return false;
    }
    return  true;
}
$isloggedin = checkLogin();
?>
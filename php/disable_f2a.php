<?php
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/verify_Authorization.php';
require_once __DIR__ . '/classes/templates/singleton.php';

use JetBrains\PhpStorm\NoReturn;
use templates\DatabaseConnector;
if (!verifyUser()) {
    destroySession();
    redirect('../index.php');
    exit;
}
#[NoReturn] function disable2FA(): void
{
    $stmt = DatabaseConnector::getInstance()->prepare("UPDATE users SET is_2fa_enabled = 0, 2fa_secret = NULL WHERE id = ?");
    $stmt->bind_param("i", $_SESSION['id']);
    $stmt->execute();
    $stmt->close();
    DatabaseConnector::destroyInstance();
    unset($_SESSION['is_2fa_enabled']);
    redirect('../dashboard.php');
    exit;
}
disable2FA();
?>
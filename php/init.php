<?php
session_start();

$isLoggedIn = $_SESSION['loggedin'] ?? false;
$user_id = $_SESSION['id'] ?? 0;

if (!isset($isLoggedIn) || !$isLoggedIn || time() > $_SESSION['expire']) {
    session_destroy();
    setcookie(session_name(), '', time() - 3600, '/');
}?>
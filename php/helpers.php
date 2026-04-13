<?php

use JetBrains\PhpStorm\NoReturn;

function destroySession(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        session_unset();
        session_destroy();
        setcookie(session_name(), '', time() - 3600, '/');
    }
}

#[NoReturn] function redirect($url): void
{
    header('Location: ' . $url);
    exit;
}

?>
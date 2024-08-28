<?php
session_start();

$isLoggedIn = $_SESSION['loggedin'] ?? false;

header('Content-Type: application/json');
echo json_encode($isLoggedIn);
?>

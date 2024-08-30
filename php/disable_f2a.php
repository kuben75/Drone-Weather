<?php
session_start();
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)){
    session_destroy();
    header("Location: index.php");
    exit;
}
$user_id = $_SESSION['id'];
$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
}
$stmt = $con->prepare("UPDATE users SET is_2fa_enabled = 0, 2fa_secret = NULL WHERE id = ?");

$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->close();
$con->close();

unset($_SESSION['is_2fa_enabled']);
header("Location: ../dashboard.php");
exit();
?>
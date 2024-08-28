<?php
session_start();
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)){
    session_destroy();
    header("Location: index.php");
    exit;
}

$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
}

$stmt = $con->prepare("SELECT username, email, password, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $_SESSION['id']);
$stmt->execute();
$stmt->bind_result($_SESSION['username'], $email, $password, $created);
$stmt->fetch();
$stmt->close();

?>

<section class="dashboard__header">
    <h2 class="dashboard__title">Kalendarz</h2>
</section>


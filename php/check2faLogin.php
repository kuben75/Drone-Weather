<?php
session_start();

header('Content-type: application/json');

require '../vendor/autoload.php';
use PragmaRX\Google2FA\Google2FA;

if (!isset($_SESSION['id']) || !$_SESSION['is_2fa_enabled']) {
    session_destroy();
    header("Location: ../index.php");
    exit();
}
$google2fa = new Google2FA();
$userId = $_SESSION['id'];
$submittedCode = str_replace(' ', '', $_POST['2fa_code']);

$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'Połączenie z bazą danych nie powiodło się: ' . $con->connect_error]);
    exit();
}

$stmt = $con->prepare("SELECT 2fa_secret FROM users WHERE id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$stmt->bind_result($secret);
$stmt->fetch();
$stmt->close();
$con->close();

$isValid = $google2fa->verifyKey($secret, $submittedCode);

if ($isValid) {
    $_SESSION['loggedin'] = true;
    $_SESSION['2fa_verified'] = true;
    echo json_encode(['status' => 'success', 'message' => 'Zalogowano pomyślnie']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Podany kod jest nieprawidłowy, spróbuj ponownie']);
    $_SESSION['loggedin'] = false;
    $_SESSION['2fa_verified'] = false;
}
?>
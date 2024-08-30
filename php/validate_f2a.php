<?php
session_start();
require '../vendor/autoload.php';

use PragmaRX\Google2FA\Google2FA;

header('Content-Type: application/json');

if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)) {
    session_destroy();
    echo json_encode(['status' => 'error', 'message' => 'Sesja wygasła.']);
    exit;
}

$google2fa = new Google2FA();
$submittedCode = str_replace(' ', '', $_POST['2fa_code']);
$secret = $_POST['secret'];

if (empty($submittedCode) || empty($secret)) {
    echo json_encode(['status' => 'error', 'message' => 'Wypełnij wymagane pola']);
    exit;
}

$isValid = $google2fa->verifyKey($secret, $submittedCode);

if ($isValid) {
    $con = new mysqli("localhost", "root", "", "users");
    if ($con->connect_error) {
        echo json_encode(['status' => 'error', 'message' => 'Połączenie z bazą danych nie powiodło się: ' . $con->connect_error]);
        exit;
    }

    $userId = $_SESSION['id'];
    $stmt = $con->prepare("UPDATE users SET is_2fa_enabled = 1, 2fa_secret = ? WHERE id = ?");
    $stmt->bind_param("si", $secret, $userId);

    if ($stmt->execute()) {
        $_SESSION['is_2fa_enabled'] = true;
        echo json_encode(['status' => 'success', 'message' => 'Weryfikacja dwustopniowa została włączona! Zostaniesz przekierowany do panelu użytkownika']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Nie udało się zaktualizować ustawień użytkownika. Spróbuj ponownie.']);
    }

    $stmt->close();
    $con->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Podany kod weryfikacyjny jest nieprawidłowy, spróbuj ponownie']);
}
?>

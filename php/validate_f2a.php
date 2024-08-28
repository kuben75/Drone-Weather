<?php
session_start();
require '../vendor/autoload.php';

use PragmaRX\Google2FA\Google2FA;

if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)){
    session_destroy();
    header("Location: index.php");
    exit;
}

$google2fa = new Google2FA();

$submittedCode = $_POST['2fa_code'];
$secret = $_POST['secret'];

if (empty($submittedCode) || empty($secret)) {
    $_SESSION['message'] = "Wypełnij wymagane pole";
} else {
    $isValid = $google2fa->verifyKey($secret, $submittedCode);

    if ($isValid) {

        $con = new mysqli("localhost", "root", "", "users");
        if ($con->connect_error) {
            die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
        }

        $userId = $_SESSION['id'];
        $stmt = $con->prepare("UPDATE users SET is_2fa_enabled = 1, 2fa_secret = ? WHERE id = ?");
        $stmt->bind_param("si", $secret, $userId);
        $stmt->execute();
        $stmt->close();
        $con->close();

        $_SESSION['message'] = "Weryfikacja dwustopniowa została włączona!";
    } else {
        $_SESSION['message'] = "Podany kod weryfikacyjny jest nieprawidłowy, spróbuj ponownie";
    }
}

header("Location: ../dashboard.php");
exit;
?>

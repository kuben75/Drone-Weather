<?php
session_start();
require '../vendor/autoload.php';

use PragmaRX\Google2FA\Google2FA;

if (!isset($_SESSION['id']) || !$_SESSION['is_2fa_enabled']) {
    session_destroy();
    header("Location: ../index.php");
    exit();
}

$google2fa = new Google2FA();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $submittedCode = $_POST['2fa_code'];

    $con = new mysqli("localhost", "root", "", "users");
    if ($con->connect_error) {
        die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
    }

    $userId = $_SESSION['id'];
    $stmt = $con->prepare("SELECT 2fa_secret FROM users WHERE id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $stmt->bind_result($secret);
    $stmt->fetch();
    $stmt->close();
    $con->close();

    if ($google2fa->verifyKey($secret, $submittedCode)) {
        $_SESSION['loggedin'] = true;
        $_SESSION['2fa_verified'] = true;
        header("Location: ../index.php");
        exit();
    } else {
        $_SESSION['message'] = "Nieprawidłowy kod weryfikacyjny, spróbuj ponownie";
    }
}
?>

<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Weryfikacja dwuskładnikowa</title>
    <link rel="stylesheet" href="../css/2fa.css" />
</head>
<body>
<main class="main__content">
    <section class="main__content__title">
        <span class="main__content__title--span">Weryfikacja dwustopniowa</span>
    </section>
<section class="modal">
    <section class="modal__auth">
        <section class="modal__auth__left">
            <section class="modal__auth__left__header">Wprowadź kod</section>
            <section class="modal__auth__footer">Wprowadź kod QR poniżej</section>
            <form action="enter_2fa.php" method="POST" autocomplete="off">
                <input type="text" id="2fa_code" name="2fa_code" placeholder="Kod weryfikacyjny" required>
                <button type="submit">Zweryfikuj</button>
                <div class="modal__error-text">
                    <?php
                    if (isset($_SESSION['message'])) {
                        echo $_SESSION['message'];
                        unset($_SESSION['message']);
                    }
                    ?>
                </div>
            </form>
        </section>
        <section class="modal__auth__right">
            <section class="modal__auth__right__header">Uwierzytelnianie dwuskładnikowe Google</section>
            <section class="modal__auth__right__content"> Wprowadź kod weryfikacyjny wygenerowany przez aplikację na Twoim telefonie</section>
        </section>
    </section>
</section>

    <section class="modal__content__button">
    <a href="../index.php" class="modal__content__button--return">Powrót do strony głównej</a>
    </section>
</main>
</body>
</html>

<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../classes/reset_password_management.php';
    $token = $_GET["token"];
    $token_hash = hash("sha256", $token);
    $management = new PasswordManager($token_hash);
    $management->callDatabase();
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset hasła</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="../../css/registration.css" />

</head>
<body>
<main class="main-content">
<form action="" method="post" class="main-content__form" data-action="process-reset-password.php" data-redirecturl="../../index.php" data-redirect="true" id="form__validation">
    <h1 class="main-content__heading">Nowe hasło</h1>
    <hr>
    <section class="modal__error-text"></section>
    <input type="hidden" name="token" value="<?= htmlspecialchars($token) ?>">
    <label for="password"><p class="main-content__paragraph">Nowe hasło</p></label>
    <input type="password" name="password" id="password">
    <label for="password-repeat"><p class="main-content__paragraph">Powtórz nowe hasło</p></label>
    <input type="password" name="password-repeat" id="password-repeat">
    <div class="modal__error-text"></div>
    <button type="submit" class="registerbtn">Zmień hasło</button>
</form>
</main>
</body>
<script type="module" src="../../dist/validation.js"></script>
</html>
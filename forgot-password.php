<?php
require_once __DIR__ . '/php/helpers.php';
require_once __DIR__ . '/php/init.php';
require_once __DIR__ . '/php/db_connection.php';
require_once __DIR__ . '/php/verify_Authorization.php';
if (verifyUser()) {
    redirect('index.php');
}
?>

<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Logowanie</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="css/registration.css" />
</head>
<body>
<header class="header">
    <nav class="nav">
        <div class="nav__brand">
            <div class="nav__logo"><a href="index.php"></a></div>
        </div>
        <div class="nav__menu">
            <ul class="nav__menu-list">
                <li class="nav__menu-item">
                    <div class="nav__language">
                        <ul class="nav__language-list">
                            <li class="nav__language-item">
                                <a href="#" class="nav__language-selector translate" data-translate="selectLanguage">Wybierz język
                                    <span class="nav__language-arrow">▼</span>
                                </a>
                                <ul class="nav__language-dropdown">
                                    <li class="nav__language-dropdown-item">
                                        <a href="?lang=pl" data-id="pl">
                                            <img src="img/pl_img.svg" alt="Polska Flaga"> PL
                                        </a>
                                    </li>
                                    <li class="nav__language-dropdown-item">
                                        <a href="?lang=en" data-id="en">
                                            <img src="img/en_img.svg" alt="Brytyjska Flaga"> EN
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</header>
<main class="main-content">
    <form action="" method="POST" class="main-content__form" id="form__validation" data-redirecturl="php/recovery/email.php" data-action="php/recovery/forgot-password.php" data-redirect="true" autocomplete="off">

        <div class="main-content__container">
            <h1 class="main-content__heading">Zapomniałeś hasła?</h1>
            <hr>
            <div class="main-content__form--message">Wystarczy, że podasz swój e-mail, a my pomożemy Ci ustawić nowe hasło.</div>
            <label for="username">
                <p class="main-content__paragraph">Email</p>
            </label>
            <input type="email" name="email" placeholder="Wpisz email" id="email" required>
            <hr>

            <div class="modal__error-text"></div>
            <button type="submit" class="registerbtn">Dalej</button>
        </div>
    </form>

</main>
</body>
<script type="module" src="dist/validation.js"></script>

</html>
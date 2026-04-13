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
    <title>Rejestracja</title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="css/utils/_variables.css" />
    <link rel="stylesheet" href="css/header.css" />
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
                      <a href="#" class="nav__language-selector translate" data-translate="selectLanguage">
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
        <form action="" data-action="php/validate_registration.php" id="form__validation" data-redirecturl="index.php" data-redirect="true" method="POST" class="main-content__form" autocomplete="off">
            <div class="main-content__container">
                <h1 class="main-content__heading translate" data-translate="registration"></h1>
                <p class="main-content__paragraph--heading translate" data-translate="fillForm"></p>
                <hr>
                <section class="modal__error-text"></section>
                <label for="username"><p class="main-content__paragraph translate" data-translate="username"></p></label>
                <input type="text" class="translate" name="username" placeholder="Wpisz nazwę użytkownika" data-placeholder="enterUsername" id="username" required>
                <label for="email"><p class="main-content__paragraph translate" data-translate="email"></p></label>
                <input type="text" class="translate" placeholder="Wpisz Email" data-placeholder="enterEmail" name="email" id="email" required>
                <label for="psw">
                    <p class="main-content__paragraph translate" data-translate="password"></p>
                </label>
                <input type="password" class="translate" placeholder="Wpisz hasło" data-placeholder="enterPassword" name="password" id="password" required>
                <label for="psw-repeat">
                    <p class="main-content__paragraph translate" data-translate="repeatPassword"></p></label>
                <input type="password" class="translate" placeholder="Powtórz hasło" data-placeholder="repeatPassword" name="psw-repeat" id="psw-repeat" required>
                <hr>
                <button type="submit" class="registerbtn translate" data-translate="registerBtn"></button>
            </div>
            <div class="main-content__footer">
                <p class="main-content__footer--paragraph translate" data-translate="haveAccount"></p> <a href="userlogin.php" class="main-content__footer--link translate" data-translate="login"></a>
            </div>
        </form>
    </main>
<script type="module" src="dist/panelTranslation.js"></script>
<script type="module" src="dist/validation.js"></script>
</body>
</html>
<?php ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>

<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rejestracja</title>
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
        <form action="php/validate_registration.php" method="POST" class="main-content__form" autocomplete="off">
            <div class="main-content__container">
                <h1 class="main-content__heading">Rejestracja</h1>
                <p class="main-content__paragraph--heading">Wypełnij formularz w celu rejestracji</p>
                <hr>
                <div class="main-content__form--error">
                    <?php
                    session_start();
                    if (!empty($_SESSION['message'])) {
                        echo $_SESSION['message'];
                        unset($_SESSION['message']);
                    }
                    ?>
                </div>
                <label for="username"><p class="main-content__paragraph">Nazwa użytkownika</p></label>
                <input type="text" name="username" placeholder="Wpisz nazwę użytkownika" id="username" required>
                <label for="email"><p class="main-content__paragraph">Email</p></label>
                <input type="text" placeholder="Wpisz Email" name="email" id="email" required>
                <label for="psw"><p class="main-content__paragraph">Hasło</p></label>
                <input type="password" placeholder="Wpisz hasło" name="password" id="password" required>
                <label for="psw-repeat"><p class="main-content__paragraph">Powtórz hasło</p></label>
                <input type="password" placeholder="Powtórz hasło" name="psw-repeat" id="psw-repeat" required>
                <hr>
                <button type="submit" class="registerbtn">Zarejestruj się</button>
            </div>
            <div class="main-content__footer">
                <p class="main-content__paragraph">Masz już konto? <a href="userlogin.php">Zaloguj się</a>.</p>
            </div>
        </form>

    </main>


</body>
</html>
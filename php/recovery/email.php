<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../helpers.php';
$email = $_SESSION['user-email'] ?? null;
$maskedEmail = $_SESSION['masked_email'] ?? null;
if($email === null) {
    destroySession();
    header('HTTP/1.1 403 Forbidden');
    exit;
}
if(checkLogin()) {
    redirect('../index.php');
}

?>
<!doctype html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="../../css/registration.css" />
    <title>Resetowanie hasła</title>
</head>
<body>
<header class="header">
    <nav class="nav">
        <div class="nav__brand">
            <div class="nav__logo"><a href="../../index.php"></a></div>
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
                                            <img src="../../img/pl_img.svg" alt="Polska Flaga"> PL
                                        </a>
                                    </li>
                                    <li class="nav__language-dropdown-item">
                                        <a href="?lang=en" data-id="en">
                                            <img src="../../img/en_img.svg" alt="Brytyjska Flaga"> EN
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
<section class="email">
<div class="email__confirmation">
    <div class="email__confirmation__content">
        <div class="email__confirmation__icon">
            <img src="../../img/email.svg" alt="Email Icon">
        </div>
        <div class="email__confirmation__text">
            <h2>Wysłaliśmy Ci e-mail<br>Sprawdź swoją pocztę</h2>
            <p>Na adres <span class="email-address"><?php echo htmlspecialchars($maskedEmail) ?? null;?></span> wysłaliśmy wiadomość z linkiem do strony, na której ustalisz swoje nowe hasło.</p>
            <p class="email-resend">
                E-mail nie dotarł? <a href="#" data-email="<?php echo htmlspecialchars($email);?>" id="resend-email-link">Wyślij ponownie</a>
            </p>
        </div>
        <div class="email__confirmation__actions">
            <a href="https://mail.google.com/mail/u/0/#inbox" target="_blank" class="email-confirmation__button">PRZEJDŹ DO POCZTY</a>
            <a href="../../forgot-password.php" class="email-confirmation__back">WRÓĆ</a>
        </div>
    </div>
</div>
</section>
<script src="../../dist/resendMail.js"></script>
</body>
</html>
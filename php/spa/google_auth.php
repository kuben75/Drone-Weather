
<?php
session_start();
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)){
    session_destroy();
    header("Location: index.php");
    exit;
}

require '../../vendor/autoload.php';
use PragmaRX\Google2FA\Google2FA;

$google2fa = new Google2FA();
$secret = $google2fa->generateSecretKey();

$_SESSION['2fa_secret'] = $secret;
$is2fa = $_SESSION['is_2fa_enabled'] ?? false;
?>

<section class="dashboard__header">
    <h2 class="dashboard__title">Weryfikacja dwustopniowa</h2>
</section>
<?php if($is2fa == 0) :?>
<section class="dashboard__usage">
    <section class="modal">
        <section class="modal__auth">
            <section class="modal__auth__left">
                <section class="modal__auth__left__header">Wprowadź kod</section>
                <section class="modal__auth__left__content">
                    <img src="php/spa/generate_qr.php" alt="QR Code" />
                </section>
                <section class="modal__auth__footer">Wprowadź kod QR poniżej</section>

                <form action="" method="POST" id="window__form" autocomplete="off">
                    <input type="text" name="2fa_code" placeholder="Kod weryfikacyjny" required>
                    <input type="hidden" name="secret" value="<?php echo htmlspecialchars($secret); ?>">
                    <button type="submit">Zweryfikuj kod</button>
                    <div class="modal__error-text"></div>
                </form>
            </section>
            <section class="modal__auth__right">
                <section class="modal__auth__right__header">Uwierzytelnianie dwuskładnikowe Google</section>
                <section class="modal__auth__right__content"> Wprowadź kod weryfikacyjny wygenerowany przez aplikację na Twoim telefonie</section>
                <section class="modal__auth__right__footer">Ręczny kod: <?php echo $secret; ?></section>
            </section>
        </section>
    </section>
    <?php else :?>
        <section class="window">
            <section class="window__element">
                <header class="window__header">Ostrzeżenie</header>
                <div class="window__content">Czy na pewno chcesz wyłączyć weryfikację dwustopniową? W każdej chwili możesz ponownie ją włączyć w ustawieniach swojego panelu użytkownika.</div>
                <footer class="window__footer">
                    <form action="php/disable_f2a.php" method="post" autocomplete="off">
                        <button class="window__button window__button--primary" type="submit">Wyłącz</button>
                    </form>
                    <a href="dashboard.php" class="window__button window__button--secondary">Powrót na stronę główną</a>
                </footer>
            </section>
        </section>
    <?php endif ;?>
<script type="module" src="js/dashboard/main.js" defer></script>
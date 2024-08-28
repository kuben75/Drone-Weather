
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
?>

<section class="dashboard__header">
    <h2 class="dashboard__title">Weryfikacja dwustopniowa</h2>
</section>

<section class="dashboard__usage">
    <section class="modal">
        <section class="modal__auth">
            <section class="modal__auth__left">
                <section class="modal__auth__left__header">Wprowadź kod</section>
                <section class="modal__auth__left__content">
                    <img src="php/spa/generate_qr.php" alt="QR Code" />
                </section>
                <section class="modal__auth__footer">Wprowadź kod QR poniżej</section>
                <form action="php/validate_f2a.php" method="POST" autocomplete="off">
                    <input type="text" name="2fa_code" placeholder="Kod weryfikacyjny" required>
                    <input type="hidden" name="secret" value="<?php echo htmlspecialchars($secret); ?>">
                    <button type="submit">Zweryfikuj kod</button>
                    <div class="modal__error-text">
                    <?php
                    if (isset($_SESSION['message']))
                    {
                        echo htmlspecialchars($_SESSION['message']);
                        unset($_SESSION['message']);
                    }
                    ?></div>
                </form>
            </section>
            <section class="modal__auth__right">
                <section class="modal__auth__right__header">Uwierzytelnianie dwuskładnikowe Google</section>
                <section class="modal__auth__right__content"> Wprowadź kod weryfikacyjny wygenerowany przez aplikację na Twoim telefonie</section>
                <section class="modal__auth__right__footer">Ręczny kod: <?php echo $secret; ?></section>
            </section>
        </section>
    </section>

</section>


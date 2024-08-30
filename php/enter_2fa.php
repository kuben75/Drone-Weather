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
            <form action="" method="POST" id="form__validation" autocomplete="off">
                <input type="text" id="2fa_code" name="2fa_code" placeholder="Kod weryfikacyjny" required>
                <button type="submit">Zweryfikuj</button>
                <div class="modal__error-text">
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
<script type="module" src="../js/dashboard/validation.js"></script>
</body>
</html>

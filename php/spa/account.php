<?php
session_start();
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)) {
    session_destroy();
    header("Location: index.php");
    exit;
}

$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
}

$stmt = $con->prepare("SELECT username, email, password, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $_SESSION['id']);
$stmt->execute();
$stmt->bind_result($_SESSION['username'], $email, $password, $created);
$stmt->fetch();
$stmt->close();
?>
<section class="dashboard__header">
    <h2 class="dashboard__title">Szczegóły konta</h2>
    <section class="dashboard__userinfo">
        <section class="dashboard__search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Szukaj" />
        </section>
        <section class="dashboard__image">
            <img src="img/user_default.svg" alt="userphoto">
        </section>
    </section>
</section>
<!-- Podsumowanie konta -->
<section class="dashboard__summary">
    <h3 class="dashboard__summary-title">Przykładowy tekst</h3>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-user"></i>
        <span>dsadas</span>
    </div>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-envelope"></i>
        <span>dsadas</span>
    </div>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-calendar-alt"></i>
        <span>dsadsa</span>
    </div>
</section>

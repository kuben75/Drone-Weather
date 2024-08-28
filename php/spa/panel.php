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

$user_id = $_SESSION['id'];
$stmt = $con->prepare("SELECT username, email, password, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$stmt->bind_result($_SESSION['username'], $email, $password, $created);
$stmt->fetch();
$stmt->close();

$stmt1 = $con->prepare("
    SELECT 
        COUNT(*) AS count_reservation,
        SUM(CASE WHEN reserve < NOW() THEN 1 ELSE 0 END) AS flight_time,
        COUNT(DISTINCT CASE WHEN reserve < NOW() THEN CONCAT(lat, ',', lng) END) AS count_places
    FROM coords 
    WHERE user_id = ?
");
$stmt1->bind_param("i", $user_id);
$stmt1->execute();
$stmt1->bind_result($count_reservation, $flight_time, $count_places);
$stmt1->fetch();
$stmt1->close();
?>
<section class="dashboard__header">
    <h2 class="dashboard__title">Panel użytkownika</h2>
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
    <h3 class="dashboard__summary-title">Podsumowanie konta</h3>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-user"></i>
        <span>Nazwa użytkownika:</span> <?php echo htmlspecialchars($_SESSION['username']); ?>
    </div>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-envelope"></i>
        <span>Email:</span> <?php echo htmlspecialchars($email); ?>
    </div>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-calendar-alt"></i>
        <span>Data rejestracji:</span> <?php echo htmlspecialchars($created); ?>
    </div>
</section>
<!-- Statystyki -->
<section class="dashboard__usage">
    <h3 class="dashboard__usage-title">Statystyki użytkowania</h3>
    <div class="dashboard__usage-item">
        <i class="fa-solid fa-calendar-check"></i>
        <span>Liczba rezerwacji:</span> <?php echo htmlspecialchars($count_reservation); ?>
    </div>
    <div class="dashboard__usage-item">
        <i class="fa-solid fa-clock"></i>
        <span>Łączny czas lotów:</span> <?php echo htmlspecialchars($flight_time); ?> godzin
    </div>
    <div class="dashboard__usage-item">
        <i class="fa-solid fa-map"></i>
        <span>Liczba odwiedzonych miejsc:</span> <?php echo htmlspecialchars($count_places); ?>
    </div>
</section>

<section class="dashboard__usage">
    <h3 class="dashboard__usage-title">Uwierzytelnianie dwuskładnikowe</h3>
    <div class="dashboard__usage-item">
        <span>Uwierzytelnianie dwuskładnikowe dodatkowo zabezpieczy Twoje konto podczas logowania.</span>
    </div>
    <h4 class="dashboard__usage-paragraph">Status konfiguracji</h4>
    <div class="dashboard__usage-item">
        <i class="fa-solid fa-xmark" style="color: #e42121;"></i>
        <!-- <i class="fa-solid fa-check" style="color: #21bb16;"></i> -->
        <span>dsadas</span>
    </div>
    <button class="dashboard__usage-button spa" data-url="./php/spa/google_auth.php">
        Włącz
    </button>
</section>
<script type="module" src="../../js/dashboard/main.js"></script>
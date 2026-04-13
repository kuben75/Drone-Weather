<?php
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../verify_Authorization.php';
require_once __DIR__ . '/../classes/userData.php';

$is2fa = $_SESSION['is_2fa_enabled'] ?? false;
$userId = $_SESSION['id'] ?? null;
if (!verifyUser()) {
    destroySession();
    redirect('../index.php');
    exit;
}
$userDataService = new UserData();
$userData = $userDataService->getUserData($userId);
$userStats = $userDataService->getUserStats($userId);
?>
<section class="dashboard__header">
    <h2 class="dashboard__title">Panel użytkownika</h2>
    <section class="dashboard__userinfo">
        <section class="dashboard__search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Szukaj" />
        </section>
        <section class="dashboard__image">
            <?php if (!empty($userData) && isset($userData['image']) && $userData['image'] !== ''): ?>
                <img src="php/uploads/<?php echo htmlspecialchars($userData['image']) ?>" alt="User Image">
            <?php else: ?>
                <img src="img/user_default.svg" alt="User Image">
            <?php endif; ?>
        </section>
    </section>
</section>
<section class="dashboard__summary">
    <h3 class="dashboard__summary-title">Podsumowanie konta</h3>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-user"></i>
        <span>Nazwa użytkownika:</span> <?php echo htmlspecialchars($userData['username']); ?>
    </div>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-envelope"></i>
        <span>Email:</span> <?php echo htmlspecialchars($userData['email']); ?>
    </div>
    <div class="dashboard__summary-item">
        <i class="fa-solid fa-calendar-alt"></i>
        <span>Data rejestracji:</span> <?php echo htmlspecialchars($userData['created']); ?>
    </div>
</section>
<section class="dashboard__usage">
    <h3 class="dashboard__usage-title">Statystyki użytkowania</h3>
    <div class="dashboard__usage-item">
        <i class="fa-solid fa-calendar-check"></i>
        <span>Liczba rezerwacji:</span> <?php echo isset($userStats['count_reservation']) ? htmlspecialchars($userStats['count_reservation']) : '0'; ?>
    </div>
    <div class="dashboard__usage-item">
        <i class="fa-solid fa-clock"></i>
        <span>Łączny czas lotów:</span> <?php echo isset ($userStats['flight_time']) ? htmlspecialchars($userStats['flight_time']) : '0'; ?> godzin/y
    </div>
    <div class="dashboard__usage-item">
        <i class="fa-solid fa-map"></i>
        <span>Liczba odwiedzonych miejsc:</span> <?php echo isset($userStats['count_places']) ? htmlspecialchars($userStats['count_places']) : '0'; ?>
    </div>
</section>

<section class="dashboard__usage">
    <h3 class="dashboard__usage-title">Uwierzytelnianie dwuskładnikowe</h3>
    <div class="dashboard__usage-item">
        <span>Uwierzytelnianie dwuskładnikowe dodatkowo zabezpieczy Twoje konto podczas logowania.</span>
    </div>
    <h4 class="dashboard__usage-paragraph">Status konfiguracji</h4>
    <div class="dashboard__usage-item">
        <?php if($is2fa == 1): ?>
            <i class="fa-solid fa-check" style="color: #21bb16;"></i>
            <span>Włączony</span>
        <?php else: ?>
            <i class="fa-solid fa-xmark" style = "color: #e42121;" ></i>
        <span>Wyłączony</span>
        <?php endif; ?>
    </div>
    <button class="dashboard__usage-button spa" data-url="./php/spa/google_auth.php">
       <?php if($is2fa == 1): ?>
        Wyłącz
        <?php else: ?>
        Włącz
        <?php endif; ?>
    </button>
</section>
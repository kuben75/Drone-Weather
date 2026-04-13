<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';

?>
<section class="dashboard__header">
    <h2 class="dashboard__title">historia</h2>
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

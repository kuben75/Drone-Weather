<?php
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';

if (!verifyUser()) {
    destroySession();
    redirect('../index.php');
    exit;
}

?>
<section class="dashboard__header" data-search="true">
    <h2 class="dashboard__title">Historia logowania</h2>
    <section class="dashboard__userinfo">
        <section class="dashboard__search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Szukaj"/>
        </section>
        <section class="dashboard__image">
            <img src="img/user_default.svg" alt="userphoto">
        </section>
    </section>
</section>
<section class="dashboard-table">
    <header class="dashboard-table__heading">
        <a href="#" class="dashboard-table__heading__return-link spa" data-url="./php/spa/account.php">
            <i class="dashboard-table__heading__icon fa-solid fa-circle-arrow-left"></i>
            <?php echo htmlspecialchars($_SESSION['username']) ?>
        </a>
    </header>

    <section class="dashboard-table__controls">
        <p class="dashboard-table__controls__description">
            Tabela wyświetla dane powiązane z logowaniami użytkownika do panelu administracyjnego.
        </p>
        <section class="modal__error-text"></section>
        <div class="dashboard-table__controls__filter" data-search="true">
            <form action="" id="search-form" method="GET" data-redirect="false">
                <div class="dashboard-table__controls__content">
                    <label for="date-from">Data</label>
                    <div class="dashboard-table__controls__content__date">
                        <input type="date" id="date-from" name="date_from" placeholder="Od"/>
                        <span>-</span>
                        <input type="date" id="date-to" name="date_to" placeholder="Do"/>
                    </div>
                </div>
                <div class="dashboard-table__controls__content">
                    <label for="ip-address">Adres IP</label>
                    <input type="text" id="ip-address" name="ip_address" placeholder="Adres IP"/>
                </div>
                <div class="dashboard-table__controls__actions">
                    <button type="submit" id="search-button">Szukaj</button>
                    <button type="button" id="reset-button">Zresetuj wyszukiwanie</button>
                </div>
                <div class="dashboard-table__controls__message"></div>
            </form>
        </div>
        <div class="dashboard-table__controls__search">
            <button class="dashboard-table__controls__search-button" id="show-search" data-show="true">Pokaż
                wyszukiwarkę
            </button>
        </div>
        <table class="dashboard-table__results">
            <thead class="dashboard-table__results__header">
            <tr class="dashboard-table__results__row">
                <th class="dashboard-table__results__cell--header">Data logowania <span
                            class="dashboard-table__sort-icon">↓</span></th>
                <th class="dashboard-table__cell--header">Adres IP</th>
            </tr>
            </thead>
            <tbody class="dashboard-table__body">
            <tr>
                <td colspan="2" class="dashboard-table__results__cell">Ładowanie danych...</td>
            </tr>
            </tbody>
        </table>
        <section class="dashboard-table__controls--footer">
            <div class="dashboard-table__controls--footer__info">
                Łączna liczba wyników:
                <span class="dashboard-table__controls--footer__count">
        </span>
            </div>
            <div id="pagination-controls" class="dashboard-table__controls--pagination"></div>

        </section>
    </section>

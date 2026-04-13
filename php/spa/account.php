<?php
$result = [];
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';
require_once __DIR__ . '/../classes/account_management.php';
require_once __DIR__ . '/../db/UserHistoryManager.php';
if(!verifyUser()){
    destroySession();
    redirect('../../index.php');
}
$manager = new UserHistoryManager();
$historyResult = $manager->GetUserHistory($_SESSION['id']);
$lastRow = end($historyResult);
?>

<section class="dashboard__header">
    <h2 class="dashboard__title">Zarządzanie kontem</h2>
    <section class="dashboard__userinfo">
        <section class="dashboard__search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Szukaj" />
        </section>
        <section class="dashboard__image">
            <?php if (!empty($result) && isset($result[0]['image']) && $result[0]['image'] !== ''): ?>
                <img src="php/uploads/<?php echo htmlspecialchars($result[0]['image']) ?>" alt="User Image">
            <?php else: ?>
                <img src="img/user_default.svg" alt="User Image">
            <?php endif; ?>
        </section>
    </section>
</section>
<section class="dashboard__panel" data-account="true">
    <section class="dashboard__account">
        <div class="dashboard__account__header">
            <h3 class="dashboard__account__title">Ustawienia użytkownika</h3>
        </div>
        <div class="dashboard__account__element">
            <div class="dashboard__account__image">
                <?php if (!empty($result) && isset($result[0]['image']) && $result[0]['image'] !== ''): ?>
                    <img src="php/uploads/<?php echo htmlspecialchars($result[0]['image']) ?>" alt="User Image">
                <?php else: ?>
                    <img src="img/user_default.svg" alt="User Image">
                <?php endif; ?>
            </div>

            <div class="dashboard__account__info">
                    <div class="dashboard__account__wrapper">
                        <div class="row">Nazwa: <div class="result"><?php echo htmlspecialchars($result[0]['username'])?></div></div>
                    </div>
                    <div class="dashboard__wrapper">
                    <div class="row">Uprawnienia: <div class="result"></div></div>
                    </div>
                    <div class="dashboard__wrapper">
                    <div class="row">Numer telefonu: <div class="result"></div></div>
                    </div>
                    <div class="dashboard__wrapper">
                        <div class="row">Adres e-mail: <div class="result"><?php echo htmlspecialchars($result[0]['email'])?></div></div>
                    </div>
                </div>
        </div>
        <div class="dashboard__account__footer">
            <button class="dashboard__account__edit" data-click="account">Edytuj</button>
        </div>
        <section class="dashboard__modal" id="dashboard__modal__account">
            <section class="dashboard__modal__window">
                <section class="dashboard__modal__header">
                    <div class="dashboard__modal__heading">Ustawienia użytkownika</div>
                    <div class="dashboard__modal__close account-close"><i class="fa-solid fa-xmark"></i></div>
                </section>
                <section class="modal__error-text"></section>
                <section class="dashboard__modal__body">
                    <form action="" method="POST" class="dashboard__modal__form" id="account-form" autocomplete="off" enctype="multipart/form-data">
                        <div class="dashboard__modal__body__group--photo">
                            <label for="upload-photo">Zdjęcie</label>
                            <input type="file" id="upload-photo" name="photo" style="display: none;">
                            <label for="upload-photo">
                                <i class="fa-solid fa-upload"></i> Wybierz zdjęcie
                            </label>
                        </div>
                        <section class="dashboard__modal__body__group--inline">
                            <div class="dashboard__modal__body__group row">
                                <label for="first-name">Imię</label>
                                <input type="text" id="first-name" name="name" placeholder="Imię" value="<?php echo htmlspecialchars($result[0]['name']?? '')?>">
                            </div>
                            <div class="dashboard__modal__body__group row">
                                <label for="last-name">Nazwisko</label>
                                <input type="text" id="last-name" name="surname" placeholder="Nazwisko" value="<?php echo htmlspecialchars($result[0]['surname']?? '') ?>">
                            </div>
                        </section>
                        <div class="dashboard__modal__body__group">
                            <label for="language">Język</label>
                            <select id="language" name="language">
                                <option value="pl" <?php echo ($result[0]['language'] === 'pl') ? 'selected' : '' ?>>Polski</option>
                                <option value="en" <?php echo ($result[0]['language'] === 'en') ? 'selected' : ''?>>Angielski</option>
                            </select>
                        </div>
                        <div class="dashboard__modal__body__group">
                            <label for="phone">Numer telefonu</label>
                            <input type="tel" id="phone" name="phone_number" placeholder="Numer telefonu" value="<?php echo htmlspecialchars($result[0]['phone_number'] ?? '')?>">
                        </div>
                        <section class="dashboard__modal__body__group--inline">
                            <div class="dashboard__modal__body__group row">
                                <label for="login">Login</label>
                                <input type="text" id="login" name="username" placeholder="Login" value="<?php echo htmlspecialchars($result[0]['username'])?>">
                                <div class = "dashboard__modal__body__group--error" data-field="login">To pole jest wymagane</div>
                            </div>

                            <div class="dashboard__modal__body__group row">
                                <label for="contact-email">Adres e-mail do kontaktu</label>
                                <input type="email" id="contact-email" name="email" placeholder="Adres e-mail do kontaktu" value="<?php echo htmlspecialchars($result[0]['email'] ?? '')?>">
                                <div class = "dashboard__modal__body__group--error" data-field="contact-email">To pole jest wymagane</div>
                            </div>
                        </section>
                        <div class="dashboard__modal__body__group buttons">
                            <button type="submit" class="buttons__ok">Zapisz</button>
                            <button type="button" class="buttons__cancel account-close">Anuluj</button>
                        </div>
                    </form>
                </section>
            </section>
        </section>
    </section>
    <section class="dashboard__account">
        <div class="dashboard__account__header">
            <h3 class="dashboard__account__title">Zarządzanie hasłem</h3>
        </div>
        <div class="dashboard__account__footer">
            <button class="dashboard__account__edit" data-click="password">Zmień hasło</button>
        </div>
        <section class="dashboard__modal" id="dashboard__modal__password">
            <section class="dashboard__modal__window">
                <section class="dashboard__modal__header">
                    <div class="dashboard__modal__heading">Zmień hasło</div>
                    <div class="dashboard__modal__close account-close"><i class="fa-solid fa-xmark"></i></div>
                </section>
                <section class="modal__error-text"></section>
                <section class="dashboard__modal__body">
                    <form action="" method="POST" class="dashboard__modal__form" id="password-form" autocomplete="off">
                        <div class="dashboard__modal__body__group">
                            <label for="current-password">
                                <p class="main-content__paragraph">Obecne hasło</p>
                            </label>
                            <div class="dashboard__modal__body__group--input">
                                <input type="password" placeholder="Obecne hasło" name="old-password" id="current-password" required>
                                <button type="button" class="show__password">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="dashboard__modal__body__group">
                            <label for="new-password">
                                <p class="main-content__paragraph">Nowe hasło</p>
                            </label>
                            <div class="dashboard__modal__body__group--input">
                                <input type="password" placeholder="Nowe hasło" class="new__password" name="new-password" id="new-password" required>
                                <button type="button" class="show__password">
                                    <i class="fa fa-eye"></i>
                                </button>
                                <button type="button" class="generate__password">
                                    <i class="fa-solid fa-lock"></i>
                                </button>
                            </div>
                        </div>
                        <div class="dashboard__modal__body__group">
                            <label for="confirm-password">
                                <p class="main-content__paragraph">Powtórz nowe hasło</p>
                            </label>
                            <div class="dashboard__modal__body__group--input">
                                <input type="password" placeholder="Powtórz nowe hasło" class="new__password" name="repeat-password" id="confirm-password" required>
                                <button type="button" class="show__password">
                                    <i class="fa fa-eye"></i>
                                </button>
                            </div>
                        </div>
                        <div class="dashboard__modal__body__group buttons">
                            <button type="submit" class="buttons__ok">OK</button>
                            <button type="button" class="buttons__cancel account-close">Anuluj</button>
                        </div>
                    </form>
                </section>
            </section>
        </section>

    </section>
    <section class="dashboard__account">
        <div class="dashboard__account__header">
            <h3 class="dashboard__account__title">Historia logowania</h3>
            <div class="dashboard__account__title__info">
                <div class="dashboard__account__title__info__element">Ostatnie logowanie:
                    <div class="dashboard__account__title__info__element--date"><?php echo htmlspecialchars($lastRow['login_time'] ?? 'Brak danych') ?></div></div>
            </div>
        </div>
        <div class="dashboard__account__footer">
            <button class="dashboard__account__edit spa" data-url="./php/spa/history_table.php">Przeglądaj</button>
        </div>

    </section>
</section>


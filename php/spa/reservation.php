<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_authorization.php';
require_once __DIR__ . '/../get_reservation.php';
require_once __DIR__ . '/../db/AccountData.php';
try {
    if (!verifyUser()) {
        destroySession();
        redirect('../../index.php');
    }
    $i = 0;
    $result = new AccountData($_SESSION['id']);
    $data = $result->getAccountData();

    $reservationReader = new ReservationReader($_SESSION['id']);
    $reservations = $reservationReader->generateReservation();
} catch (Exception $e) {
    echo 'Błąd: ' . $e->getMessage();
    $reservations = [];
}
?>
<section class="dashboard__header">
    <h2 class="dashboard__title">Rezerwacje</h2>
    <section class="dashboard__userinfo">
        <section class="dashboard__search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" placeholder="Szukaj"/>
        </section>
        <section class="dashboard__image">
            <?php if (!empty($data) && isset($data[0]['image']) && $data[0]['image'] !== ''): ?>
                <img src="php/uploads/<?php echo htmlspecialchars($data[0]['image']) ?>" alt="User Image">
            <?php else: ?>
                <img src="img/user_default.svg" alt="User Image">
            <?php endif; ?>
        </section>
    </section>
</section>

<section class="dashboard__manager" data-reservation="true">
    <div class="dashboard__manager__header">
        <h1 class="dashboard__manager__header--heading">Lista rezerwacji</h1>
    </div>
    <table class="dashboard__manager--table">
        <thead>
        <tr>
            <td class="column">Nazwa<i class="fa-solid fa-arrow-down-long fa-xs"></i></td>
            <td class="column">Opis</td>
            <td class="column">Data rezerwacji</td>
            <td class="column">Akcje</td>
        </tr>
        </thead>

        <?php if (!empty($reservations)) : ?>
        <tbody>
        <?php foreach ($reservations as $index => $row) : ?>
            <tr class="reservation__list">
                <td class="name">
                    <i class="fa-solid fa-plane" style="color: #74C0FC;"></i>
                    <p class="view-file"><?php echo $row['drone']; ?></p>
                </td>
                <td><?php echo htmlspecialchars($row['description']); ?></td>
                <td class="date"><?php echo $row['reserve']; ?></td>
                <td class="actions">
                    <a class="btn edit-btn" data-index="<?php echo $index; ?>"><i class="fa-solid fa-pen fa-xs"></i></a>
                    <a class="btn red delete-btn" data-action="delete" data-index="<?php echo $index; ?>"><i
                                class="fa-solid fa-trash fa-xs"></i></a>
                    <section class="edit__options" data-index="<?php echo $index; ?>">
                        <ul>
                            <li><a href="#" class="edit__options--btn edit__options--btn--name" data-action="name">Zmień
                                    nazwę</a></li>
                            <li><a href="#" class="edit__options--btn edit__options--btn--reserve"
                                   data-action="reserve">Zmień datę rezerwacji</a></li>
                            <li><a href="#" class="edit__options--btn edit__options--btn--description"
                                   data-action="description">Zmień opis</a></li>
                        </ul>
                    </section>
                    <section class="dashboard__modal" id="edit-name-<?php echo $index; ?>">
                        <section class="dashboard__modal__window">
                            <section class="dashboard__modal__header">
                                <div class="dashboard__modal__heading">Edytuj nazwę</div>
                                <div class="dashboard__modal__close"><i class="fa-solid fa-xmark"></i></div>
                            </section>
                            <section class="modal__error-text"></section>
                            <section class="dashboard__modal__body">
                                <form action="" method="POST" class="dashboard__modal__form"
                                      id="modal__form-<?php echo $i++ ?>">
                                    <label for="name">Nazwa</label>
                                    <input type="text" name="name" id="name" placeholder="Nazwa" required>
                                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                    <input type="hidden" name="formType" value="edit-name">
                                    <input type="submit" value="Zapisz">
                                </form>
                            </section>
                        </section>
                    </section>
                    <section class="dashboard__modal" id="edit-reserve-<?php echo $index; ?>">
                        <section class="dashboard__modal__window">
                            <section class="dashboard__modal__header">
                                <div class="dashboard__modal__heading">Edytuj datę rezerwacji</div>
                                <div class="dashboard__modal__close"><i class="fa-solid fa-xmark"></i></div>
                            </section>
                            <section class="modal__error-text"></section>
                            <section class="dashboard__modal__body">
                                <form action="" method="POST" class="dashboard__modal__form"
                                      id="modal__form-<?php echo $i++ ?>">
                                    <label for="reserve">Wybierz datę i godzinę rezerwacji:</label>
                                    <input type="datetime-local" id="reserve" name="reserve" required>
                                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                    <input type="hidden" name="formType" value="edit-reserve">
                                    <input type="submit" value="Zapisz">
                                </form>
                            </section>
                        </section>
                    </section>
                    <section class="dashboard__modal" id="edit-description-<?php echo $index; ?>">
                        <section class="dashboard__modal__window">
                            <section class="dashboard__modal__header">
                                <div class="dashboard__modal__heading">Edytuj opis</div>
                                <div class="dashboard__modal__close"><i class="fa-solid fa-xmark"></i></div>
                            </section>
                            <section class="modal__error-text"></section>
                            <section class="dashboard__modal__body">
                                <form action="" method="POST" class="dashboard__modal__form"
                                      id="modal__form-<?php echo $i++ ?>">
                                    <label for="description">Nowy opis</label>
                                    <input type="text" name="description" id="description" placeholder="Opis" required>
                                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                    <input type="hidden" name="formType" value="edit-description">
                                    <input type="submit" value="Zapisz">
                                </form>
                            </section>
                        </section>
                    </section>
                    <section class="dashboard__modal" id="edit-delete-<?php echo $index; ?>">
                        <section class="dashboard__modal__window">
                            <section class="dashboard__modal__header">
                                <div class="dashboard__modal__heading">Usuń rezerwację</div>
                                <div class="dashboard__modal__close"><i class="fa-solid fa-xmark"></i></div>
                            </section>
                            <section class="modal__error-text"></section>
                            <section class="dashboard__modal__body">
                                <form action="" method="POST" class="dashboard__modal__form"
                                      id="modal__form-<?php echo $i++ ?>">
                                    <div class="dashboard__modal__body--description">Czy na pewno chcesz usunąć
                                        rezerwację?
                                    </div>
                                    <input type="hidden" name="id" value="<?php echo $row['id']; ?>">
                                    <input type="hidden" name="formType" value="remove-reservation">
                                    <div class="dashboard__modal__body--buttons">
                                        <input type="submit" class="remove-button" value="usuń rezerwację">
                                        <input type="button" class="cancel-button" value="Anuluj">
                                    </div>
                                </form>
                            </section>
                        </section>
                    </section>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
    <?php endif; ?>
</section>



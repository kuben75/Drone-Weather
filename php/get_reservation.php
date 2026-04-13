<?php
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/verify_authorization.php';
require_once __DIR__ . '/classes/templates/singleton.php';
require_once __DIR__ . '/classes/templates/message.php';


use jetbrains\PhpStorm\NoReturn;
use templates\DatabaseConnector;
use templates\ResponseSender;

abstract class BaseReservation
{
    protected mysqli $con;
    protected int $userId;

    public function __construct(mysqli $con, int $userId) {
        $this->con = $con;
        $this->userId = $userId;
    }

}
#[AllowDynamicProperties] class ReservationReader extends BaseReservation {
    public function __construct(int $userId) {
        parent::__construct(DatabaseConnector::getInstance(), $userId);
    }
    public function generateReservation(): array {
        return $this->callDataBase();
    }

    private function callDataBase(): array {
        $data = [];
        $stmt = $this->con->prepare("SELECT id, drone, reserve, description FROM coords WHERE user_id = ? AND reserve > NOW() ORDER BY reserve ");
        $stmt->bind_param("i", $this->userId);
        $stmt->execute();
        $result = $stmt->get_result();
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $data[$row['id']] = $row;
            }
        }
        $stmt->close();
        return $data;
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}

#[AllowDynamicProperties] class ReservationEditor extends BaseReservation {
    private dateTime $date;
    private array $result;

    public function __construct(int $userId, array $result) {
        parent::__construct(DatabaseConnector::getInstance(), $userId);
        $this->date = new DateTime();
        $this->result = $result;
    }
    #[NoReturn] public function handleRequest (?int $id, ?string $formType, array $data): void
    {
        if ($id === null || $formType === null) {
            ResponseSender::getMessage()->sendResponse('error', 'Niepoprawny format danych');
        }
        $this->checkFormType($id, $formType, $data);
    }

    #[NoReturn] private function checkFormType(int $id, string $formType, array $data): void
    {
        switch ($formType) {
            case 'edit-name':
                $this->verifyName($id, $data['name']);
            case 'edit-reserve':
                $this->verifyReservation($id, $data['reserve']);
            case 'edit-description':
                $this->verifyDescription($id, $data['description']);
            case 'remove-reservation':
                $reservationRemove = new ReservationRemover($this->userId);
                $reservationRemove->removeReservation($id, $this->userId);
            default:
                ResponseSender::getMessage()->sendResponse('error', 'Nieznany typ formularza.');
        }
    }

    #[NoReturn] private function verifyName(int $id, string $name): void
    {
        if(!empty($name) && preg_match('/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9]+$/', $name) && $name != $this->result[$id]['drone']) {
            $this->updateDatabase($id, 'drone', $name);
        }else {
            ResponseSender::getMessage()->sendResponse('error', 'Nieprawidłowa nazwa.');
        }
    }
    #[NoReturn] private function verifyReservation(int $id, string $reserve): void
    {
        $reserveDate = DateTime::createFromFormat('Y-m-d\TH:i', $reserve);
        if($reserveDate && $reserveDate > $this->date && $reserveDate != $this->result[$id]['reserve']) {
            $this->updateDatabase($id, 'reserve', $reserve);
        }
        else {
            ResponseSender::getMessage()->sendResponse('error', 'Podaj poprawny czas rezerwacji.');
        }
    }
    #[NoReturn] private function verifyDescription(int $id, string $description): void
    {
        if(!empty($description) && strlen($description) < 1000) {
            $this->updateDatabase($id, 'description', $description);
        }else {
            ResponseSender::getMessage()->sendResponse('error', 'Nieprawidłowy opis.');
        }
    }

     #[NoReturn] private function updateDatabase(int $id, string $column, string $value): void {
        if(!in_array($column, ['drone', 'reserve', 'description'])) {
            ResponseSender::getMessage()->sendResponse('error', 'Nieznana kolumna.');
        }
        $stmt = $this->con->prepare("UPDATE coords SET $column = ? WHERE id = ? AND user_id = ? ");
        $stmt->bind_param("ssi", $value, $id, $this->userId);
        $result =  $stmt->execute();
        $stmt->close();
        if($result) {
            ResponseSender::getMessage()->sendResponse('success', 'Dane zostały zaaktualizowane');
        }
        else {
            ResponseSender::getMessage()->sendResponse('error', 'Rezerwacja nie została zmieniona');
        }
    }
    public function __destruct()
    {
        DatabaseConnector::destroyInstance();
    }
}
class ReservationRemover extends BaseReservation {

    public function __construct(int $userId) {
        parent::__construct(DatabaseConnector::getInstance(), $userId);
    }
    #[NoReturn] public function removeReservation(int $id, int $userId): void {
        $stmt = $this->con->prepare ("DELETE FROM coords WHERE id = ? AND user_id = ?");
        $stmt->bind_param("ii", $id, $userId);
        $result= $stmt->execute();
        $stmt->close();
        if ($result) {
            ResponseSender::getMessage()->sendResponse('success', 'Rezerwacja została usunięta');
        } else {
            ResponseSender::getMessage()->sendResponse('error', 'Wystąpił błąd podczas usuwania rezerwacji');
        }
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}

try {
    $reservation = new ReservationReader($_SESSION['id']);
    $result = $reservation->generateReservation();
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $reader = new ReservationEditor($_SESSION['id'], $result);
        $id = $_POST['id'] ?? null;
        $formType = $_POST['formType'] ?? null;
        $data = $_POST;
        $reader->handleRequest($id, $formType, $data);
    }
}
catch (Exception $e) {
    ResponseSender::getMessage()->sendResponse( 'error',  $e->getMessage());
}

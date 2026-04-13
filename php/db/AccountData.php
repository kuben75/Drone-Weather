<?php
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';
require_once __DIR__ . '/../classes/templates/singleton.php';

use templates\DatabaseConnector;

class AccountData
{
    private int $userId;

    public function __construct( ?int $userId) {
        $this->userId = $userId;
    }

    public function getAccountData(): array {
        $stmt = DatabaseConnector::getInstance()->prepare("
            SELECT id, name, surname, username, email, phone_number, language, password, created_at, image
            FROM users 
            WHERE id = ?
        ");
        $stmt->bind_param('i', $this->userId);
        $stmt->execute();
        $result = $stmt->get_result();
        $data = $result->fetch_all(MYSQLI_ASSOC);
        $stmt->close();
        return $data;
    }

    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}
<?php
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../classes/templates/singleton.php';

use templates\DatabaseConnector;
class UserHistoryManager
{
public function GetUserHistory(int $sessionId): ?array{
    $stmt = DatabaseConnector::getInstance()->prepare("SELECT login_time, ip_address FROM login_history WHERE user_id = ? ORDER BY login_time DESC");
    $stmt->bind_param("i", $sessionId);
    $stmt->execute();
    $result = $stmt->get_result();
    $data = [];
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        $result->free();
    }
    $stmt->close();
    return $data;
}
}


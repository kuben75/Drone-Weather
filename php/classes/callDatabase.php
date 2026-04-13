<?php
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/templates/Singleton.php';
require_once __DIR__ . '/templates/message.php';

use templates\DatabaseConnector;
use templates\ResponseSender;

class DatabaseCaller{
    public function callDatabase(): void{
        try{
            $stmt = DatabaseConnector::getInstance()->prepare("SELECT reserve, id FROM `coords`");
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    $reserveTime = strtotime($row["reserve"]);
                    $this->cleanData($reserveTime, $row['id']);
                }
            }
            $stmt->close();
        }catch(Exception $e){
            ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
        }
    }
    private function cleanData(int $reserveTime, int $id): void {
        if ($reserveTime < time()) {
            $stmt = DatabaseConnector::getInstance()->prepare("UPDATE `coords`  SET lat = NULL, lng = NULL, radius = NULL, user_color = NULL, user_fillColor = NULL, user_fillOpacity = NULL, color = NULL, fillOpacity = NULL, drone = NULL WHERE id = ?");
            $stmt->bind_param("i", $id);
            $stmt->execute();
            $stmt->close();
        }
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}

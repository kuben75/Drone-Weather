<?php
require_once __DIR__ . '/templates/Singleton.php';
use templates\DatabaseConnector;
class UserData
{
    public function getUserData(int $userId): array
    {
        $stmt = DatabaseConnector::getInstance()->prepare("SELECT username, email, created_at, image FROM users WHERE id = ?");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($username, $email, $created, $image);
        $stmt->fetch();
        $stmt->close();
        return [
            'username' => $username,
            'email' => $email,
            'created' => $created,
            'image' => $image
        ];
    }
    public function getUserStats(int $userId): array
    {
        $stmt = DatabaseConnector::getInstance()->prepare("
            SELECT 
                COUNT(*) AS count_reservation,
                SUM(CASE WHEN reserve < NOW() THEN 1 ELSE 0 END) AS flight_time,
                COUNT(DISTINCT CASE WHEN reserve < NOW() THEN CONCAT(lat, ',', lng) END) AS count_places
            FROM coords 
            WHERE user_id = ?
        ");
        $stmt->bind_param("i", $userId);
        $stmt->execute();
        $stmt->bind_result($count_reservation, $flight_time, $count_places);
        $stmt->fetch();
        $stmt->close();
        return [
            'count_reservation' => $count_reservation,
            'flight_time' => $flight_time,
            'count_places' => $count_places,
        ];
    }

    public function __destruct()
    {
        DatabaseConnector::DestroyInstance();
    }
}
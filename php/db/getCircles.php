<?php
require_once __DIR__ . '/../access/access.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../classes/templates/singleton.php';

header('Content-Type: application/json');

use templates\DatabaseConnector;

class ZoneDataFetcher
{
    private $db;

    public function __construct()
    {
        $this->db = DatabaseConnector::getInstance();
    }

    public function getCircles(): array
    {
        $stmt = $this->db->prepare("SELECT lat, lng, radius, color, fillColor, fillOpacity FROM circles");
        $stmt->execute();
        $result = $stmt->get_result();
        $circles = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $circles[] = $row;
            }
            $result->free();
        }
        $stmt->close();
        return $circles;
    }

    public function getUserCircles(): array
    {
        $stmt = $this->db->prepare("
            SELECT lat, lng, radius, user_color, user_fillColor, user_fillOpacity, drone, reserve 
            FROM coords
        ");
        $stmt->execute();
        $result = $stmt->get_result();
        $userCircles = [];
        $otherCircles = [];

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                if (!empty($row['drone'])) {
                    $userCircles[] = $row;
                } else {
                    $otherCircles[] = $row;
                }
            }
            $result->free();
        }
        $stmt->close();
        return ['userCircles' => $userCircles, 'otherCircles' => $otherCircles];
    }

    public function __destruct()
    {
        DatabaseConnector::destroyInstance();
    }
}

$fetcher = new ZoneDataFetcher();

try {
    $circles = $fetcher->getCircles();
    $userCircleData = $fetcher->getUserCircles();

    echo json_encode([
        'circleData' => $circles,
        'userCircleData' => $userCircleData['userCircles'],
        'otherCircleData' => $userCircleData['otherCircles']
    ]);
} catch (Exception $e) {
    echo json_encode(['error' => $e->getMessage()]);
}

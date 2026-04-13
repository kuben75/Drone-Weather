<?php
require_once __DIR__ . '/../access/access.php';
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../verify_Authorization.php';
require_once __DIR__ . '/../classes/templates/singleton.php';
require_once __DIR__ . '/../classes/templates/message.php';

use templates\DatabaseConnector;
use templates\ResponseSender;

#[AllowDynamicProperties] class DataStorage {
    protected array $data;
    protected array $formData;
    protected float $lat;
    protected float $lng;
    public function __construct(array $data, array $formData) {
        $this->data = $data;
        $this->lat = filter_var($data['lat'] ?? 0, FILTER_VALIDATE_FLOAT);
        $this->lng = filter_var($data['lng'] ?? 0, FILTER_VALIDATE_FLOAT);
        $this->formData = $formData;

    }
}

class InputValidator extends DataStorage
{
    public function verifyUserSession(): void {
        if(!verifyUser() || !isset($_SESSION['id'])) {
            destroySession();
           redirect('../index.php');
        }
       $this->validateFormData();
    }
    public function validateFormData(): void
    {
        $reserveDate = DateTime::createFromFormat('Y-m-d\TH:i', $this->formData['reserve']);

        foreach ($this->formData as $value) {
            if (empty($value)) {
                ResponseSender::getMessage()->sendResponse('error', 'Wypełnij wymagane pola');
            }
        }
        if (!$reserveDate || $reserveDate < new DateTime) {
            ResponseSender::getMessage()->sendResponse('error', 'Podaj poprawną datę');
        }
        $this->checkLastReservation();
    }
    private function checkLastReservation(): void {
        try{
            $stmt = DatabaseConnector::getInstance()->prepare("SELECT created_at FROM coords WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
            $stmt->bind_param("i", $_SESSION['id']);
            $stmt->execute();
            $result = $stmt->get_result();
            $lastReservation = $result->fetch_assoc();
            $stmt->close();
            $this->checkLastReservationInterval($lastReservation);
        }catch(Exception $e){
            ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
        }
    }
    private function checkLastReservationInterval(?array $lastReservation): bool
    {
        if(!$lastReservation || !isset($lastReservation['created_at'])) {
            return true;
        }
        $lastReservationTime = new DateTime($lastReservation['created_at']);
        $interval = (new DateTime())->getTimestamp() - $lastReservationTime->getTimestamp();
        if ($interval < 30) {
            $remainingTime = 30 - $interval;
            ResponseSender::getMessage()->sendResponse('error', 'Odczekaj ' . $remainingTime . ' sekund przed ponowną rezerwacją');
        }
        return true;
    }
    public function __destruct()
    {
        DatabaseConnector::destroyInstance();
    }
}
class CollisionDetector extends DataStorage {
    private function harvesineDistance(float $lat1, float $lon1, float $lat2, float $lon2): float|int
    {
        $R = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);
        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLon / 2) * sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        return $R * $c * 1000;
    }
    private function areCirclesColliding(float $lat1, float $lon1, float $lat2, float $lon2, int $radius1, float $radius2): bool
    {
        $distance = $this->harvesineDistance($lat1, $lon1, $lat2, $lon2);
        return $distance < ($radius1 + $radius2);
    }
   public function checkCollision(): bool {
       try{
           $stmt = DatabaseConnector::getInstance()->prepare("SELECT lat, lng, radius FROM coords 
                    UNION SELECT lat, lng, radius FROM circles");
           $stmt->execute();
           $result = $stmt->get_result();
            while($row = $result->fetch_assoc()) {
               if($this->areCirclesColliding($this->lat, $this->lng, $row['lat'], $row['lng'], 1500, $row['radius'])) {
                   $stmt->close();
                   ResponseSender::getMessage()->sendResponse('error', 'Kolizja z innym obszarem');
               }
            }
            $result->free();
            $stmt->close();
            return true;
       }catch(Exception $e) {
           ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
       }
   }
   public function __destruct() {
        DatabaseConnector::destroyInstance();
   }
}
final class DataSaver extends DataStorage
{
    public function saveReservation(): void {
        $staticVariables = [
            'color' => 'blue',
            'fillColor' => 'blue',
            'fillOpacity' => 0.5,
            'user_color' => 'green',
            'user_fillColor' => 'green',
            'user_fillOpacity' => 0.3,
            'radius' => 1500
        ];
        try {
            $stmt = DatabaseConnector::getInstance()->prepare("INSERT INTO coords (user_id, lat, lng, radius, user_color, user_fillColor, user_fillOpacity, color, fillColor, fillOpacity, drone, reserve, created_at, description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)");
            $stmt->bind_param("iddisssssssss", $_SESSION['id'], $this->lat, $this->lng, $staticVariables['radius'], $staticVariables['user_color'], $staticVariables['user_fillColor'], $staticVariables['user_fillOpacity'], $staticVariables['color'], $staticVariables['fillColor'], $staticVariables['fillOpacity'], $this->formData['dronename'], $this->formData['reserve'], $this->formData['description']);
            if ($stmt->execute()) {
                $stmt->close();
                ResponseSender::getMessage()->sendResponse('success', 'Dane zostały zapisane');
            } else {
                $stmt->close();
                ResponseSender::getMessage()->sendResponse('error', 'Nie udało się zapisać danych');
            }
        } catch (Exception $e) {
            ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
        }
    }
    public function __destruct()
    {
        DatabaseConnector::destroyInstance();
    }
}
try{
    $data = json_decode(file_get_contents('php://input'), true);
    $formData = $data['formData'] ?? [];
    $storage = new DataStorage($data, $formData);
    $validator = new InputValidator($data, $formData);
    $validator->verifyUserSession();
    $detector = new CollisionDetector($data, $formData);
    $detector->checkCollision();
    $saver = new DataSaver($data, $formData);
    $saver->saveReservation();

}catch (Exception $e) {
    ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
}

<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
header('Content-Type: application/json');


if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)) {
    echo json_encode(['error' => 'User not logged in']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$user_id = $_SESSION['id'];
$color = 'blue';
$fillColor = 'blue';
$fillOpacity = 0.5;
$user_color = 'green';
$user_fillColor = 'green';
$user_fillOpacity = 0.3;
$lat = filter_var($data['lat'] ?? 0, FILTER_VALIDATE_FLOAT);
$lng = filter_var($data['lng'] ?? 0, FILTER_VALIDATE_FLOAT);
$formData = $data['formData'] ?? [];
$drone = $formData['dronename'] ?? '';
$reserve = $formData['reserve'] ?? '';

function validateFormData($drone, $reserve) {
    $currentDate = new DateTime();
    $reserveDate = DateTime::createFromFormat('Y-m-d\TH:i', $reserve);
    if (empty($drone) || empty($reserve)) {
        return ['error' => 'Wypełnij wymagane pola'];
    } elseif (!$reserveDate || $reserveDate < $currentDate) {
        return ['error' => 'Podaj poprawną datę'];
    }
    return null;
}

$formValidationError = validateFormData($drone, $reserve);
if ($formValidationError) {
    echo json_encode($formValidationError);
    return;
}

$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    error_log('Database connection error: ' . $con->connect_error);
    echo json_encode(['error' => 'Database connection failed']);
    exit;
}

$stmt = $con->prepare("SELECT created_at FROM coords WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();
$lastReservation = $result->fetch_assoc();
$stmt->close();

if ($lastReservation) {
    $lastReservationTime = new DateTime($lastReservation['created_at']);
    $currentTime = new DateTime();
    $interval = $currentTime->getTimestamp() - $lastReservationTime->getTimestamp();
    $remainingTime = 30 - $interval;

    if ($interval < 30) {
        if($interval < 5){
            echo json_encode(['error' => 'Musisz poczekać ' . $remainingTime . ' sekundy za następną rezerwacją']);
            $con->close();
            return;
        }
        echo json_encode(['error' => 'Musisz poczekać ' . $remainingTime . ' sekund za następną rezerwacją']);
        $con->close();
        return;
    }
}

function haversineDistance($lat1, $lon1, $lat2, $lon2) {
    $R = 6371;
    $dLat = deg2rad($lat2 - $lat1);
    $dLon = deg2rad($lon2 - $lon1);
    $a = sin($dLat / 2) * sin($dLat / 2) +
        cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
        sin($dLon / 2) * sin($dLon / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
    return $R * $c * 1000;
}

function areCirclesColliding($lat1, $lon1, $lat2, $lon2, $radius1, $radius2) {
    $distance = haversineDistance($lat1, $lon1, $lat2, $lon2);
    return $distance < ($radius1 + $radius2);
}

$radius = 1500;

$query = "SELECT lat, lng, radius FROM coords
          UNION
          SELECT lat, lng, radius FROM circles";

$result = $con->query($query);
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        if (areCirclesColliding($lat, $lng, $row['lat'], $row['lng'], $radius, $row['radius'])) {
            echo json_encode(['error' => 'Kolizja z innym obszarem']);
            $con->close();
            exit;
        }
    }
    $result->free();
}

$stmt = $con->prepare("INSERT INTO coords (user_id, lat, lng, radius, user_color, user_fillColor, user_fillOpacity, color, fillColor, fillOpacity, drone, reserve, created_at) VALUES (?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("iddissssssss", $user_id, $lat, $lng, $radius, $user_color, $user_fillColor, $user_fillOpacity,  $color, $fillColor, $fillOpacity, $drone, $reserve);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['error' => 'Błąd podczas dodawania danych']);
}
$stmt->close();
$con->close();
?>

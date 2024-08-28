<?php
session_start();
header('Content-Type: application/json');

$con = new mysqli("localhost", "root", "", "users");

if ($con->connect_error) {
    die(json_encode(['error' => "Połączenie z bazą danych nie powiodło się: " . $con->connect_error]));
}

$query = "SELECT lat, lng, radius, color, fillColor, fillOpacity FROM circles";
$result = $con->query($query);
$circles = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $circles[] = $row;
    }
    $result->free();
} else {
    echo json_encode(['error' => "Błąd zapytania: " . $con->error]);
    exit();
}
$con->close();
echo json_encode(['circleData' => $circles]);
?>

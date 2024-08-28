<?php
session_start();
$user_id = $_SESSION['id'] ?? null;
$isLoggedIn = $_SESSION['loggedin'] ?? false;

if ($isLoggedIn && $user_id) {

    $con = new mysqli("localhost", "root", "", "users");

    if ($con->connect_error) {
        die(json_encode(['error' => "Połączenie z bazą danych nie powiodło się: " . $con->connect_error]));
    }

    $queryUserCircles = "SELECT drone, reserve, user_color, user_fillColor, user_fillOpacity, lat, lng, radius FROM coords WHERE user_id = ?";
    $stmtUserCircles = $con->prepare($queryUserCircles);
    $stmtUserCircles->bind_param("i", $user_id);
    $stmtUserCircles->execute();
    $resultUserCircles = $stmtUserCircles->get_result();
    $circles1 = [];

    if ($resultUserCircles) {
        while ($row = $resultUserCircles->fetch_assoc()) {
            $circles1[] = $row;
        }
        $resultUserCircles->free();
    } else {
        echo json_encode(['error' => "Błąd zapytania: " . $con->error]);
        exit();
    }

    $queryOtherCircles = "SELECT reserve, lat, lng, radius, color, fillColor, fillOpacity FROM coords WHERE user_id != ?";
    $stmtOtherCircles = $con->prepare($queryOtherCircles);
    $stmtOtherCircles->bind_param("i", $user_id);
    $stmtOtherCircles->execute();
    $resultOtherCircles = $stmtOtherCircles->get_result();
    $circles2 = [];

    if ($resultOtherCircles) {
        while ($row = $resultOtherCircles->fetch_assoc()) {
            $circles2[] = $row;
        }
        $resultOtherCircles->free();
    } else {
        echo json_encode(['error' => "Błąd zapytania: " . $con->error]);
        exit();
    }
    $stmtUserCircles->close();
    $stmtOtherCircles->close();
    $con->close();

    echo json_encode([
        'userCircleData' => $circles1,
        'otherCircleData' => $circles2
    ]);

} else {
    echo json_encode([
        'userCircleData' => [],
        'otherCircleData' => []
    ]);
}

?>

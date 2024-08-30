<?php
function callData() {

    $con = new mysqli("localhost", "root", "", "users");
    if ($con->connect_error) {
        die("Błąd połączenia: " . $con->connect_error);
    }

    $stmt = $con->prepare("SELECT reserve, id FROM `coords`");
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $reserveTime = strtotime($row["reserve"]);
            $currentTime = time();

            if ($reserveTime < $currentTime) {
                $deleteStmt = $con->prepare("UPDATE `coords`  SET lat = NULL, lng = NULL, radius = NULL, user_color = NULL, user_fillColor = NULL, user_fillOpacity = NULL, color = NULL, fillOpacity = NULL, drone = NULL WHERE id = ?");
                $deleteStmt->bind_param("i", $row['id']);
                $deleteStmt->execute();
                $deleteStmt->close();
            }
        }
    }
    $stmt->close();
    $con->close();
}

callData();
?>

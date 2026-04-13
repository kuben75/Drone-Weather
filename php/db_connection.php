<?php
function dbConnection(): false|mysqli
{
    try {
        $con = new mysqli("localhost", "root", "", "users");
        if ($con->connect_error) {
            throw new Exception("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
        }
        return $con;
    } catch (Exception $error) {
        error_log($error->getMessage());
        return false;
    }
}
function checkDbUsers(): bool
{
    if (session_status() !== PHP_SESSION_ACTIVE) {
        session_start();
    }

    if (isset($_SESSION['id'])) {
        $con = dbConnection();
        if ($con === false) {
            return false;
        }

        $stmt = $con->prepare("SELECT id FROM users WHERE id = ?");
        if ($stmt === false) {
            error_log("Błąd przygotowania zapytania: " . $con->error);
            return false;
        }

        $stmt->bind_param("i", $_SESSION['id']);
        $stmt->execute();
        $stmt->store_result();
        $userExists = $stmt->num_rows > 0;
        $stmt->close();
        $con->close();

        if (!$userExists) {
            return false;
        }
    }

    return true;
}
?>
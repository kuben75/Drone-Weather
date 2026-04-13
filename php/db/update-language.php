<?php

use templates\DatabaseConnector;

try {
    $data = json_decode(file_get_contents("php://input"), true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $e) {
    throw new \RuntimeException("Invalid JSON data: " . $e->getMessage());
}
if (!empty($data['language'])) {
    $_SESSION['lang'] = $data['language'];
    if (isset($_SESSION['id'])) {
        require_once '../init.php';
        require_once '../db_connection.php';
        require_once '../classes/templates/singleton.php';
        $stmt = DatabaseConnector::getInstance()->prepare("UPDATE users SET language = ? WHERE id = ?");
        $stmt->bind_param("si", $data['language'], $_SESSION['id']);
        $stmt->execute();
        $stmt->close();
    }
    http_response_code(200);
    exit;
}
http_response_code(400);

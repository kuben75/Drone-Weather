<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../classes/templates/singleton.php';

use templates\DatabaseConnector;

class PasswordManager
{
 public ?string $token_hash;
 public function __construct(string $token_hash) {
     $this->token_hash = $token_hash;
 }
 public function callDatabase (): bool{
     $stmt = DatabaseConnector::getInstance()->prepare("SELECT * FROM users WHERE reset_token_hash = ?");
     $stmt->bind_param("s", $this->token_hash);
     $stmt->execute();
     $result = $stmt->get_result();
     $user =  $result->fetch_assoc();
     if(!$user) {
        die("Token jest nieprawidłowy" );
     }
     elseif (strtotime($user['reset_token_expires_at']) <= time()){
         die("token wygasł");
     }
     $stmt->close();
     return true;
 }

 public function __destruct() {
     DatabaseConnector::destroyInstance();
 }

}
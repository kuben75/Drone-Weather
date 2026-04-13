<?php
require_once __DIR__ . '/../access/access.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../classes/templates/singleton.php';
require_once __DIR__ . '/../classes/templates/message.php';
require_once __DIR__ . '/../classes/templates/UniversalValidator.php';

use JetBrains\PhpStorm\NoReturn;
use templates\DatabaseConnector;
use templates\ResponseSender;
use templates\UniversalValidator;
class Config {
    public const PASSWORD_MIN_LENGTH = 5;
    public const PASSWORD_MAX_LENGTH = 20;
}
class PasswordResetFacade {
    private TokenValidator $tokenValidator;
    private PasswordValidator $passwordValidator;
    private PasswordUpdater $passwordUpdater;
    private ResponseSender $responseSender;
    public function __construct(){
        $this->tokenValidator = new TokenValidator();
        $this->passwordValidator = new PasswordValidator(Config::PASSWORD_MIN_LENGTH, Config::PASSWORD_MAX_LENGTH);
        $this->passwordUpdater = new PasswordUpdater();
        $this->responseSender = ResponseSender::getMessage();
    }
  #[NoReturn] public function resetPassword(string $token_hash, array $passwords): void
  {
      try {
          $user = $this->tokenValidator->validateToken($token_hash);
          if (!$user) {
              throw new Exception('Token jest nieprawidłowy lub wygasł');
          }
          $errors = $this->passwordValidator->validatePasswords($passwords);
          if (!empty($errors)) {
              throw new Exception(implode(", ", $errors));
          }
          if (!$this->passwordUpdater->updatePassword($user['reset_token_hash'], $passwords['password'])) {
              throw new Exception("Wystąpił błąd podczas zapisywania hasła");
          }
          $this->responseSender->sendResponse("success", "Hasło zostało zresetowane");
      } catch (Exception $e) {
         $this->responseSender->sendResponse('error', $e->getMessage());
      }
  }
}

class TokenValidator {
    public function validateToken(string $token_hash): ?array {
        $stmt = DatabaseConnector::getInstance()->prepare("SELECT * FROM users WHERE reset_token_hash = ?");
        $stmt->bind_param("s", $token_hash);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        if (!$user || strtotime($user['reset_token_expires_at']) <= time()) {
            return null;
        }
        return $user;
    }
}
class PasswordValidator {
    private int $minLength;
    private int $maxLength;
    public function __construct(int $minLength, int $maxLength) {
        $this->minLength = $minLength;
        $this->maxLength = $maxLength;
    }
    public function validatePasswords(array $passwords): ?array
    {
        $errors = [];
        foreach ($passwords as $value) {
            if (empty($value)) {
               $errors[] = 'Wypełnij wymagane pola';
            } elseif (strlen($value) < $this->minLength || strlen($value) > $this->maxLength) {
                $errors[] =  "Hasło musi zawierać między {$this->minLength} a {$this->maxLength} znaków";
            }
        }
        if ($passwords['password'] !== $passwords['password-repeat']) {
            $errors[] = 'Hasła są inne';
        }
        return $errors;
    }
}

class PasswordUpdater {
    public function updatePassword(string $token_hash, string $new_password): bool {
        $password_hash = password_hash($new_password, PASSWORD_BCRYPT);
        $stmt = DatabaseConnector::getInstance()->prepare("UPDATE users SET password = ?, reset_token_hash = NULL, reset_token_expires_at = NULL WHERE reset_token_hash = ?");
        $stmt->bind_param("ss", $password_hash, $token_hash);
        $stmt->execute();
        if($stmt->affected_rows > 0){
            $stmt->close();
            return true;
        }
        $stmt->close();
        return false;
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}
try{
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $resetToken = $_POST['token'];
        $token_hash = hash("sha256", $resetToken);
        $passwords = [
            'password' => $_POST['password'],
            'password-repeat' => $_POST['password-repeat']
        ];
        $validator = new PasswordResetFacade();
        $validator->resetPassword($token_hash, $passwords);
    }
}catch (Exception $e) {
    ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
}

?>
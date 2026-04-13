<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/templates/singleton.php';
require_once __DIR__ . '/templates/message.php';
require_once __DIR__ . '/templates/UniversalValidator.php';
require '../access/access.php';

use JetBrains\PhpStorm\NoReturn;
use templates\DatabaseConnector;
use templates\ResponseSender;
use templates\UniversalValidator;
class NewPasswordFacade
{
    public array $data;
    private ResponseSender $sender;
    public NewPasswordValidator $validator;
    public NewPasswordSaver $passwordSaver;

    public function __construct(array $data) {
        $this->data = $data;
        $this->sender = ResponseSender::getMessage();
        $this->validator = new NewPasswordValidator();
        $this->passwordSaver = new NewPasswordSaver();
    }

    #[NoReturn] public function manageNewPassword(): void {
        $errors = [
            $this->validator->checkInput($this->data) ? true : "Wypełnij wszystkie pola",
            $this->validator->checkOldPassword($this->data) ? true : "Stare hasło jest niepoprawne",
            $this->validator->checkNewPassword($this->data) ? true : "Hasła nie spełniają wymagań, minimum 8 znaków, w tym duża litera, cyfra oraz znak specjalny",
            $this->validator->checkIsPasswordTheSame($this->data) ? true : "Nowe hasła są różne",
        ];
        foreach ($errors as $error) {
            if ($error !== true) {
                $this->sender->sendResponse("error", $error);
            }
        }
        try {
            if ($this->passwordSaver->saveNewPassword($this->data)) {
                $this->sender->sendResponse("success", "Hasło zostało zmienione");
            }
        }
        catch (Exception $e) {
            $this->sender->sendResponse("error", $e->getMessage());
        }
    }
}

class NewPasswordValidator {
    public function checkInput (array $data): bool {
        foreach ($data as $value) {
            if (empty($value)) {
                return false;
            }
        }
        return true;
    }
    public function checkOldPassword(array $data): bool {
        $stmt = DatabaseConnector::getInstance()->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->bind_param("i", $_SESSION['id']);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();
        $stmt->close();
        if(!UniversalValidator::validate($data['old-password'], 'password_verify', $user['password'])){
            return false;
        }
        return true;
    }

    public function checkNewPassword(array $data): bool {
        $rules = [
            'new_password' => ['type' => 'regex', 'rule' => '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/'],
            'repeat-password' => ['type' => 'regex', 'rule' => '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/']
        ];
        foreach ($data as $key => $value) {
            if(isset($rules[$key])){
                    if (!UniversalValidator::validate($value, $rules[$key]['type'], $rules[$key]['rule'])){
                    return false;
                }
            }
        }
        return true;
    }
    public function checkIsPasswordTheSame (array $data):bool {
        if(!UniversalValidator::validate($data['new-password'], 'match', $data['repeat-password'])){
            return false;
        }
        return true;
    }
}
class NewPasswordSaver {
  public function saveNewPassword (array $data):bool {
      try{
          $hashedPassword = password_hash($data['new-password'], PASSWORD_BCRYPT);
          $stmt= DatabaseConnector::getInstance()->prepare("UPDATE users SET password = ? WHERE id = ?");
          $stmt->bind_param("si", $hashedPassword, $_SESSION['id']);
          $stmt->execute();
          $stmt->close();
          return true;
      }
      catch(Exception $e){
          error_log($e);
          return false;
      }
  }
}
try{
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $data = $_POST;
            $validator = new NewPasswordFacade($data);
            $validator->manageNewPassword();
        }
}
catch (Exception $e){
    ResponseSender::getMessage()->sendResponse("error", $e->getMessage());
}
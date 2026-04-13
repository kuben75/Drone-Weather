<?php
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/classes/templates/singleton.php';
require_once __DIR__ . '/classes/templates/message.php';
require_once __DIR__ . '/classes/templates/UniversalValidator.php';

use templates\ResponseSender;
use templates\DatabaseConnector;
use templates\UniversalValidator;
interface ValidationStrategyInterface {
    public function validate(array $data): bool;
}
class UsernameValidation implements ValidationStrategyInterface {
    public function validate(array $data): bool
    {
        $username = $data['username'] ?? '';
        if(!UniversalValidator::validate($username, 'regex','/^(?=(.*[a-zA-Ząćęłńóśźż]){3,})[a-zA-Ząćęłńóśźż0-9]+$/u'))
        {
            ResponseSender::getMessage()->sendResponse("error", 'Nazwa użytkownika jest nieprawidłowa');
        }
        return true;
    }
}
class EmailValidation implements ValidationStrategyInterface {
    public function validate(array $data): bool
    {
        $email = $data['email'] ?? '';
        if(!UniversalValidator::validate($email, 'email', FILTER_VALIDATE_EMAIL)){
            ResponseSender::getMessage()->sendResponse("error", 'Adres email jest nieprawidłowy');
        }
        return true;
    }
}
class PasswordValidationStrategy implements ValidationStrategyInterface
{
    public function validate(array $data): bool
    {
        $password = $data['password'] ?? '';
        if(!UniversalValidator::validate($password, 'regex', '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/')){
            ResponseSender::getMessage()->sendResponse("error", 'Hasło powinno zawierać minimum 8 znaków, w tym wielką literę, cyfrę oraz znak specjalny');
        }
        return true;
    }
}
class PasswordMatchValidationStrategy implements ValidationStrategyInterface
{
    public function validate(array $data): bool
    {
        if (!UniversalValidator::validate($data['password'], 'match', $data['psw-repeat'])) {
            ResponseSender::getMessage()->sendResponse("error", 'Hasła są różne');
        }
        return true;
    }
}
class RegistrationService
{
    protected array $data;
    protected array $fieldNames;
    private array $validationStrategies;
    public function __construct(array $data) {
        $this->data = $data;
        $this->fieldNames = array_keys($data);
        $this->validationStrategies = [
            new UsernameValidation(),
            new EmailValidation(),
            new PasswordValidationStrategy(),
            new PasswordMatchValidationStrategy(),
        ];
    }
    public function doesUserExist(): bool {
        $stmt = DatabaseConnector::getInstance()->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $stmt->bind_param("ss", $this->data['username'], $this->data['email']);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0){
            $stmt->close();
            ResponseSender::getMessage()->sendResponse("error", "użytkownik istnieje");
        }
        $stmt->close();
        return $this->validateRequiredFields();
    }
    private function validateRequiredFields(): bool
    {
        foreach ($this->fieldNames as $field) {
            if (empty($this->data[$field])) {
                ResponseSender::getMessage()->sendResponse("error", "To pole jest wymagane");
            }
        }
        return $this->validateAllFields();
    }
    private function validateAllFields(): bool {
        foreach ($this->validationStrategies as $strategy) {
            if (!$strategy->validate($this->data)) {
                return false;
            }
        }
        return $this->createUserSession();
    }
    private function createUserSession(): bool
    {
        $hashedPassword = password_hash($this->data['password'], PASSWORD_BCRYPT);
        return (new UserSessionSaver($this->data, $hashedPassword))->saveUser();
    }
}
final class UserSessionSaver extends RegistrationService
{
    private string $hashedPassword;
    public function __construct(array $data, string $hashedPassword) {
        parent::__construct($data);
        $this->hashedPassword = $hashedPassword;
    }
    public function saveUser(): bool {
        try {
            $stmt = DatabaseConnector::getInstance()->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->bind_param("sss", $this->data['username'], $this->data['email'], $this->hashedPassword);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                $id = $stmt->insert_id;
                $stmt->close();
                return $this->initializeSession($id);
            } else {
                $stmt->close();
                throw new Exception("Wystąpił błąd podczas zapisywania użytkownika");
            }
        }
        catch (Exception $e) {
            ResponseSender::getMessage()->sendResponse("error", $e->getMessage());
        }
    }
    private function initializeSession(int $id): bool {
        try {
            session_regenerate_id(true);
            $_SESSION['loggedin'] = true;
            $_SESSION['id'] = $id;
            $_SESSION['created_at'] = date("Y-m-d H:i:s");
            $_SESSION['username'] = $this->data['username'];
            $_SESSION['start'] = time();
            $_SESSION['expire'] = $_SESSION['start'] + 24 * 3600;
            ResponseSender::getMessage()->sendResponse("success", "Rejestracja przebiegła pomyslnie");
        }
        catch(Exception $e){
            ResponseSender::getMessage()->sendResponse("error", $e->getMessage());
        }
    }
}

if($_SERVER['REQUEST_METHOD'] === 'POST') {
    try{
        $registration = new RegistrationService($_POST);
        $registration->doesUserExist();
    }catch(Exception $e){
        ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
    }
}

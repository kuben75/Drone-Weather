<?php
require '../vendor/autoload.php';
require_once __DIR__ . '/init.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/classes/templates/singleton.php';
require_once __DIR__ . '/classes/templates/message.php';

use JetBrains\PhpStorm\NoReturn;
use templates\ResponseSender;
use templates\DatabaseConnector;

class UserAuthenticator {
    private array $credentials;

    public function __construct(array $credentials) {
        $credentials['username'] = trim($credentials['username'] ?? '');
        $this->credentials = $credentials;
        $this->validateInputs();
    }

    private function validateInputs(): void {
        if (empty($this->credentials['username']) || empty($this->credentials['password'])) {
            ResponseSender::getMessage()->sendResponse("error", "Wypełnij wszystkie pola.");
        }
        $this->findUser();
    }

    #[NoReturn]
    private function findUser(): void {
        $stmt = DatabaseConnector::getInstance()->prepare(
            'SELECT id, password, is_2fa_enabled, language FROM users WHERE username = ?'
        );
        $stmt->bind_param("s", $this->credentials['username']);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows === 0) {
            $stmt->close();
            ResponseSender::getMessage()->sendResponse("error", "Nieprawidłowa nazwa użytkownika lub hasło.");
        }

        $stmt->bind_result($userId, $hashedPassword, $isTwoFactorEnabled, $userLang);
        $stmt->fetch();
        $stmt->close();

        $this->verifyPassword($userId, $hashedPassword, $isTwoFactorEnabled, $userLang);
    }

    #[NoReturn]
    private function verifyPassword(int $userId, ?string $hashedPassword, ?int $isTwoFactorEnabled, ?string $userLang): void {
        if (!password_verify($this->credentials['password'], $hashedPassword)) {
            ResponseSender::getMessage()->sendResponse("error", "Nieprawidłowa nazwa użytkownika lub hasło.");
        }

        $sessionManager = new UserSessionManager($this->credentials);
        $sessionManager->initializeSession($userId, $isTwoFactorEnabled ?? 0, $userLang ?? 'pl');
    }

    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}

class UserSessionManager {
    private array $credentials;

    public function __construct(array $credentials) {
        $this->credentials = $credentials;
    }

    private function logLoginAttempt(int $userId): void {
        $ipAddress = $_SERVER['REMOTE_ADDR'];
        $stmt = DatabaseConnector::getInstance()->prepare("INSERT INTO login_history (user_id, ip_address) VALUES (?, ?)");
        $stmt->bind_param("is", $userId, $ipAddress);
        $stmt->execute();
        $stmt->close();
    }

    #[NoReturn]
    public function initializeSession(int $userId, int $isTwoFactorEnabled, string $userLang): void {
        $this->logLoginAttempt($userId);
        session_regenerate_id(true);

        $_SESSION['lang'] = $userLang;
        $_SESSION['id'] = $userId;
        $_SESSION['username'] = $this->credentials['username'];
        $_SESSION['start'] = time();
        $_SESSION['expire'] = $_SESSION['start'] + (24 * 3600);
        $_SESSION['is_2fa_enabled'] = $isTwoFactorEnabled;

        $this->handleTwoFactorAuthentication($isTwoFactorEnabled);
    }

    #[NoReturn]
    private function handleTwoFactorAuthentication(int $isTwoFactorEnabled): void {
        if (!empty($_POST['remember'])) {
            setcookie("username", $this->credentials['username'], time() + 3600, "/", "", true, true);
        }
        if ($isTwoFactorEnabled) {
            ResponseSender::getMessage()->sendResponse('2fa_required', 'Wymagana jest weryfikacja dwuetapowa.');
        } else {
            $_SESSION['loggedin'] = true;
            ResponseSender::getMessage()->sendResponse('success', 'Zalogowano pomyślnie');
        }
    }

    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $authenticator = new UserAuthenticator($_POST);
    } catch (Throwable $e) {
        ResponseSender::getMessage()->sendResponse("error", "Błąd serwera: " . $e->getMessage());
    }
}
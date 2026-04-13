<?php
require_once __DIR__ . '/init.php';
require '../vendor/autoload.php';
require 'db/crypto.php';
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/verify_Authorization.php';
require_once __DIR__ . '/classes/templates/singleton.php';
require_once __DIR__ . '/classes/templates/message.php';
require_once __DIR__ . '/classes/templates/UniversalValidator.php';

use JetBrains\PhpStorm\NoReturn;
use PragmaRX\Google2FA\Exceptions\IncompatibleWithGoogleAuthenticatorException;
use PragmaRX\Google2FA\Exceptions\InvalidCharactersException;
use PragmaRX\Google2FA\Exceptions\SecretKeyTooShortException;
use PragmaRX\Google2FA\Google2FA;
use templates\DatabaseConnector;
use templates\ResponseSender;
use templates\UniversalValidator;

class TwoFactorProcessor {
    private string $submittedCode;
    private int $userId;
    private Google2FA $google2fa;

    #[NoReturn] public function __construct(string $submittedCode, int $userId) {
        $this->submittedCode = $submittedCode;
        $this->userId = $userId;
        $this->google2fa = new Google2FA();
        $this->validateInput();
        $this->process2FA();
    }

    private function validateInput(): void {
        if (empty($this->submittedCode) || !UniversalValidator::validate($this->submittedCode, 'length', 6)) {
            ResponseSender::getMessage()->sendResponse('error', 'Nieprawidłowy kod');
        }
    }

    private function GetEncryptedSecret(): string {
        $stmt = DatabaseConnector::getInstance()->prepare("SELECT 2fa_secret FROM users WHERE id = ?");
        $stmt->bind_param("i", $this->userId);
        $stmt->execute();
        $encryptedSecret = '';
        $stmt->bind_result($encryptedSecret);
        $stmt->fetch();
        $stmt->close();
        return $encryptedSecret;
    }

    /**
     * @throws IncompatibleWithGoogleAuthenticatorException
     * @throws SecretKeyTooShortException
     * @throws InvalidCharactersException
     */
    private function validate2FA($secret): bool {
        return $this->google2fa->verifyKey($secret, $this->submittedCode);
    }

    #[NoReturn] private function process2FA(): void {
        try {
            $encryptedSecret = $this->GetEncryptedSecret();
            $secret = decrypt($encryptedSecret);
            if ($this->validate2FA($secret)) {
                $_SESSION['is_2fa_enabled'] = true;
                $_SESSION['loggedin'] = true;
                ResponseSender::getMessage()->sendResponse('success', 'Weryfikacja dwustopniowa została włączona!');
            } else {
                ResponseSender::getMessage()->sendResponse('error', 'Podany kod jest nieprawidłowy, spróbuj ponownie');
            }
        } catch (IncompatibleWithGoogleAuthenticatorException | SecretKeyTooShortException | InvalidCharactersException $e) {
            ResponseSender::getMessage()->sendResponse('error', 'Wystąpił błąd z kodem 2FA: ' . $e->getMessage());
        }
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}
try {
    $userId = $_SESSION['id'] ?? null;
    if (!$userId) {
       ResponseSender::getMessage()->sendResponse('error', 'Nie jesteś zalogowany');
    }
    $submittedCode = str_replace(' ', '', $_POST['2fa_code']);
    new TwoFactorProcessor($submittedCode, $userId);

} catch (Exception $e) {
    ResponseSender::getMessage()->sendResponse('error', $e->getMessage());
}

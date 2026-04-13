<?php
require '../vendor/autoload.php';
require_once __DIR__ . '/init.php';
require 'db/crypto.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/db_connection.php';
require_once __DIR__ . '/verify_Authorization.php';
require_once __DIR__ . '/classes/templates/message.php';
require_once __DIR__ . '/classes/templates/singleton.php';

use JetBrains\PhpStorm\NoReturn;
use PragmaRX\Google2FA\Google2FA;
use templates\ResponseSender;
use templates\DatabaseConnector;
interface GoogleTwoFactorStrategy {
    public function verifyCode(?string $twoFactorCode, ?string $twoFactorSecret, Google2FA $google2FA );
}
class EmptyInputChecker implements GoogleTwoFactorStrategy {
   public function verifyCode(?string $twoFactorCode, ?string $twoFactorSecret, Google2FA $google2FA ): bool {
      if(empty($twoFactorCode) && empty($twoFactorSecret)){
         ResponseSender::getMessage()->sendResponse("error", "Wypełnij wszystkie pola");
      }
      return true;
   }
}
class TwoFactorChecker implements GoogleTwoFactorStrategy {
    public function verifyCode(?string $twoFactorCode, ?string $twoFactorSecret, Google2FA $google2FA ): bool {
        if($google2FA->verifyKey($twoFactorSecret, $twoFactorCode)) {
            return true;
        }
        return false;
    }
}
class GoogleTwoFactorManager {
    private ?string $twoFactorCode;
    private ?string $twoFactorSecret;
    private int $userID;
    private Google2FA $google2FA;
    private array $validationMethods;

    public function __construct(?string $twoFactorCode, ?string $twoFactorSecret) {
        $this->twoFactorCode = $twoFactorCode;
        $this->twoFactorSecret = $twoFactorSecret;
        $this->userID = $_SESSION['id'];
        $this->google2FA = new Google2FA();
        $this->validationMethods = [
            new EmptyInputChecker(),
            new TwoFactorChecker()
        ];
    }

    public function runValidation(): bool {
        foreach ($this->validationMethods as $method) {
            if (!$method->verifyCode($this->twoFactorCode, $this->twoFactorSecret, $this->google2FA)) {
                return false;
            }
        }
        $this->encryptKeyAndSave();
        return true;
    }

    private function encryptKeyAndSave(): void {
        $encryptedKey = encrypt($this->twoFactorSecret);
        $this->enable2FA($encryptedKey);
    }

    private function enable2FA(string $encryptedKey): void {
        try {
            $stmt = DatabaseConnector::getInstance()->prepare("UPDATE users SET is_2fa_enabled = 1, 2fa_secret = ? WHERE id = ?");
            $stmt->bind_param("si", $encryptedKey, $this->userID);
            $stmt->execute();
            $stmt->close();
            $_SESSION['is_2fa_enabled'] = true;
            ResponseSender::getMessage()->sendResponse("success", "Weryfikacja dwustopniowa została włączona!");
        } catch (Exception $e) {
            ResponseSender::getMessage()->sendResponse("error", $e->getMessage());
        }
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}

try{
    $twoFactorCode = str_replace(' ', '', $_POST['2fa_code']) ?? null;
    $twoFactorSecret = $_POST['secret'] ?? null;
    $manager = new GoogleTwoFactorManager($twoFactorCode, $twoFactorSecret);
    $manager->runValidation();
}catch(Exception $e){
    ResponseSender::getMessage()->sendResponse("error", $e->getMessage());
}
<?php
require_once __DIR__ . '/../helpers.php';
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../verify_Authorization.php';
require_once __DIR__ . '/../classes/templates/message.php';
require_once __DIR__ . '/../classes/templates/singleton.php';
require_once __DIR__ . '/../classes/templates/UniversalValidator.php';

use JetBrains\PhpStorm\NoReturn;
use templates\ResponseSender;
use templates\DatabaseConnector;
use templates\UniversalValidator;

class AccountManagement {
    private array $result;
    private array $data;

    private bool $languageChanged = false;
    private ?string $newLanguage = null;
    private bool $photoChangeAttempted;

    #[NoReturn]
    public function __construct(array $result, array $data, bool $photoChangeAttempted) {
        $this->result = $result;
        $this->data = $data;
        $this->photoChangeAttempted = $photoChangeAttempted;
        $this->verifyTypeOfData();
    }

    #[NoReturn]
    private function verifyTypeOfData(): void {
        $existingData = $this->result[0] ?? [];

        $fieldsToUpdate = ['name', 'surname', 'username', 'email', 'phone_number', 'language'];
        $editedFields = [];

        foreach ($fieldsToUpdate as $field) {
            if (isset($this->data[$field])) {
                $newValue = trim($this->data[$field]);
                $oldValue = $existingData[$field] ?? null;

                if ($newValue !== (string)$oldValue) {
                    if($field === 'language') {
                        $this->languageChanged = true;
                        $this->newLanguage = $newValue;
                    }
                    $editedFields[$field] = $newValue;
                }
            }
        }

        if (empty($editedFields) && !$this->photoChangeAttempted) {
            ResponseSender::getMessage()->sendResponse('error', 'Nie dokonano żadnych zmian.');
        }

        if (!empty($editedFields)) {
            if (!$this->validateFields($editedFields)) {
                return;
            }
        }

        $textFieldsSuccessfullyUpdated = false;
        if (!empty($editedFields)) {
            $saver = new DatabaseSaver();
            if ($saver->updateDatabase($editedFields)) {
                $textFieldsSuccessfullyUpdated = true;
                if ($this->languageChanged) {
                    $saver->updateLanguage($this->newLanguage);
                }
            } else {
                ResponseSender::getMessage()->sendResponse('error', 'Wystąpił błąd podczas aktualizacji danych profilowych.');
            }
        }

        if ($textFieldsSuccessfullyUpdated || $this->photoChangeAttempted) {
            ResponseSender::getMessage()->sendResponse('success', 'Dane zostały zaktualizowane pomyślnie.');
        } else {
            ResponseSender::getMessage()->sendResponse('error', 'Nie dokonano żadnych zmian (nieoczekiwany stan).');
        }
    }

    private function validateFields(array $editedFields): bool {

        if ((isset($editedFields['username']) && $editedFields['username'] === '') || (isset($editedFields['email']) && $editedFields['email'] === '')) {
            ResponseSender::getMessage()->sendResponse('error', 'Nie można usunąć nazwy użytkownika ani adresu e-mail.');
            return false;
        }

        $rules = [
            'name' => ['type' => 'regex', 'rule' => '/^(?=(.*[a-zA-Ząćęłńóśźż]){3,})[a-zA-Ząćęłńóśźż0-9]+$/u'],
            'surname' => ['type' => 'regex', 'rule' => '/^[a-zA-Ząćęłńóśźż]{3,25}$/u'],
            'username' => ['type' => 'regex', 'rule' => '/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9]+$/'],
            'email' => ['type' => 'email', 'rule' => FILTER_VALIDATE_EMAIL],
            'phone_number' => ['type' => 'regex', 'rule' => '/^(\d{9}|\d{3} \d{3} \d{3})$/'],
        ];

        foreach ($editedFields as $field => $value) {
            if (empty($value) && $field !== 'username' && $field !== 'email') {
                continue;
            }

            if (isset($rules[$field])) {
                $rule = $rules[$field];
                $allowEmptyForThisField = !in_array($field, ['username', 'email']);
                $result = UniversalValidator::validate($value, $rule['type'], $rule['rule'], $allowEmptyForThisField);
                if (!$result['isValid']) {
                    ResponseSender::getMessage()->sendResponse('error', $result['error']);
                    return false;
                }
            }
        }
        return true;
    }
}

class fileUploader {
    private ?array $file;
    private int $userID;
    private ?array $allowedTypes;
    private int $maxFileSize;

    public function __construct(?array $file)
    {
        $this->file = $file;
        $this->userID = $_SESSION['id'];
        $this->allowedTypes = ['jpg', 'jpeg', 'png', 'webp'];
        $this->maxFileSize = 2 * 1024 * 1024;
        if(isset($this->file) && $this->file['error'] === UPLOAD_ERR_OK) {
            $this->handleFileUpload();
        }
    }
    private function handleFileUpload(): void
    {

        $fileTmp = $this->file['tmp_name'];
        $originalName = $this->file['name'];
        $fileSize = $this->file['size'];

        $fileExtension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        if(!in_array($fileExtension, $this->allowedTypes, true)) {
            ResponseSender::getMessage()->sendResponse('error', 'Nieobsługiwany typ pliku.');
        }
        if($fileSize > $this->maxFileSize) {
            ResponseSender::getMessage()->sendResponse('error', 'Plik jest za duży.');
        }
        $newFileName = $this->userID . '_' . time() . '.' . $fileExtension;
        $uploadsDir = __DIR__ . '/../uploads/';
        $destination =  $uploadsDir . $newFileName;
        if (!is_dir($uploadsDir) && !mkdir($uploadsDir, 0755, true) && !is_dir($uploadsDir)) {
            throw new \RuntimeException(sprintf('Directory "%s" was not created', $uploadsDir));
        }
        $existingPhoto = $this->getExistingPhotoFilename($this->userID);
        if ($existingPhoto) {
            $oldFilePath = $uploadsDir . $existingPhoto;
            if (file_exists($oldFilePath)) {
                unlink($oldFilePath);
            }
        }

        if (!move_uploaded_file($fileTmp, $destination)) {
            ResponseSender::getMessage()->sendResponse('error', 'Nie udało się zapisać pliku.');
        }
        $saver = new DatabaseSaver();
        $saver->savePhotoFilenameToDatabase($this->userID, $newFileName);
    }
    private function getExistingPhotoFilename(int $userId): ?string {
        $stmt = DatabaseConnector::getInstance()->prepare("
            SELECT image FROM users WHERE id = ?
        ");
        $stmt->bind_param('i', $userId);
        $stmt->execute();
        $stmt->bind_result($filename);
        $stmt->fetch();
        $stmt->close();
        return $filename ?: null;
    }
}
class DatabaseSaver {

    #[NoReturn]
    public function updateLanguage(?string $newLanguage): void {
        $stmt = DatabaseConnector::getInstance()->prepare("
            UPDATE users SET language = ? WHERE id = ?
        ");
        $stmt->bind_param('si', $newLanguage, $_SESSION['id']);

        if ($stmt->execute()) {
            $_SESSION['lang'] = $newLanguage;
        } else {
            ResponseSender::getMessage()->sendResponse('error', 'Wystąpił błąd podczas aktualizacji języka.');
        }
        $stmt->close();
    }
    public function updateDatabase(array $editedFields): bool {
        $setParts = [];
        $values = [];

        foreach ($editedFields as $field => $value) {
            $setParts[] = "$field = ?";
            $values[] = $value;
        }

        if (empty($setParts)) {
            return false;
        }

        $values[] = $_SESSION['id'];
        $types = str_repeat('s', count($values) - 1) . 'i';
        $stmt = DatabaseConnector::getInstance()->prepare("
            UPDATE users SET " . implode(', ', $setParts) . " WHERE id = ?
        ");
        $stmt->bind_param($types, ...$values);

        $success = $stmt->execute();
        $stmt->close();
        return $success;
    }
    public function savePhotoFilenameToDatabase(int $userID, string $filename): void
    {
        $stmt = DatabaseConnector::getInstance()->prepare("
            UPDATE users SET image = ? WHERE id = ?
        ");
        $stmt->bind_param('si', $filename, $userID);
        if (!$stmt->execute()) {
            ResponseSender::getMessage()->sendResponse('error', 'Nie udało się zaktualizować zdjęcia.');
        }
        $stmt->close();
    }

    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}
try {
    require_once __DIR__ . '/../db/AccountData.php';
    $accountReader = new AccountData($_SESSION['id']);
    $result = $accountReader->getAccountData();

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $data = $_POST;
        $file = $_FILES['photo'] ?? null;

        $photoChangeAttempted = false;

        if($file && $file['error'] === UPLOAD_ERR_OK && $file['size'] > 0) {
            new fileUploader($file);
            $photoChangeAttempted = true;
        }
        new AccountManagement($result, $data, $photoChangeAttempted);
    }
} catch (Exception $e) {
    ResponseSender::getMessage()->sendResponse('error', 'Wystąpił błąd: ' . $e->getMessage());
}

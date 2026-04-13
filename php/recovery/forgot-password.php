<?php
require_once __DIR__ . '/../init.php';
require_once __DIR__ . '/../db_connection.php';
require_once __DIR__ . '/../classes/templates/singleton.php';
require_once __DIR__ . '/../access/access.php';
require_once __DIR__ . '/../classes/templates/message.php';
require_once __DIR__ . '/../mailer/mailer.php';
require_once __DIR__ . '/../classes/templates/UniversalValidator.php';
use JetBrains\PhpStorm\NoReturn;
use templates\DatabaseConnector;
use mailer\Mailer;
use templates\ResponseSender;
use templates\UniversalValidator;

class ManageEmailFacade {
    private EmailChecker $emailChecker;
    private EmailGenerator $emailGenerator;
    private TokenSaver $tokenSaver;
    private MailSender $mailSender;
    private string $token_hash;
    private string $expiry;

    public function __construct(Mailer $mailer,string $token_hash, string $expiry) {
        $this->emailChecker = new EmailChecker();
        $this->emailGenerator = new EmailGenerator($mailer);
        $this->tokenSaver = new TokenSaver();
        $this->mailSender = new MailSender($this->emailGenerator);
        $this->token_hash = $token_hash;
        $this->expiry = $expiry;
    }

    /**
     * @throws \PHPMailer\PHPMailer\Exception
     */
    #[NoReturn] public function manageEmail (string $email, string $token):void {
        $checker = [
            $this->emailChecker->validateEmail($email) ? true : 'Niepoprawny adres email',
            $this->emailChecker->checkEmailExist($email) ? true : 'Podany adres email nie istnieje.',
            $this->tokenSaver->saveToken($email, $this->token_hash, $this->expiry) ? true : 'Wystąpił błąd podczas zapisywania tokenu',
            $this->mailSender->generateMessage($email, $token) ? true : 'Wystąpił błąd podczas generowania wiadomości',
            $this->mailSender->maskEmail($email) ? true : 'Wystąpił błęd podczas maskowania adresu email',
        ];
        foreach($checker as $value){
            if($value !== true){
                ResponseSender::getMessage()->sendResponse('error', $value);
            }
        }
        ResponseSender::getMessage()->sendResponse('success', 'Link do resetowania hasła został wysłany na podany adres email');
        }
}
class EmailChecker {
    public function validateEmail ($email): bool {
        if(!UniversalValidator::validate($email, 'email', FILTER_VALIDATE_EMAIL)){
            return false;
        }
        $_SESSION['user-email'] = $email;
        return true;
    }
    public function checkEmailExist(string $email):bool {
        $stmt= DatabaseConnector::getInstance()->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $stmt->store_result();
        if($stmt->num_rows < 1){
            $stmt->close();
            return false;
        }
        return true;
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}
class EmailGenerator {
    private PHPMailer\PHPMailer\PHPMailer $mailer;
    public function __construct(Mailer $mailer) {
        $this->mailer = $mailer->getMailerInstance();
    }

    /**
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function sendEmail(string $to, string $subject, string $body): void
    {
        $this->mailer->setFrom("noreply@example.com", "Drone Weather Support");
        $this->mailer->addAddress($to);
        $this->mailer->Subject = $subject;
        $this->mailer->Body = $body;
        $this->mailer->send();
    }
}
class TokenSaver {
    public function saveToken(string $email, string $token_hash, string $expiry): bool{
        $stmt = DatabaseConnector::getInstance()->prepare("UPDATE users SET reset_token_hash = ?, reset_token_expires_at = ? WHERE email = ?");
        $stmt->bind_param('sss', $token_hash, $expiry, $email);
        $stmt->execute();
        if ($stmt->affected_rows) {
            $stmt->close();
            return true;
        }
        $stmt->close();
        return false;
    }
}

class MailSender {
    private EmailGenerator $EmailGenerator;
    public function __construct(EmailGenerator $EmailGenerator) {
        $this->EmailGenerator = $EmailGenerator;
    }

    /**
     * @throws \PHPMailer\PHPMailer\Exception
     */
    public function generateMessage(string $email, string $token): bool {
        $data = [
            'token' => $token,
            'email' => $email,
        ];
        ob_start();
        extract($data);
        require __DIR__ . "/../templates/email.php";
        $body = ob_get_clean();
        $this->EmailGenerator->sendEmail($email, "Resetowanie hasła", $body);
        return true;
    }
    public function maskEmail(string $email): bool {
        $parts = explode("@", $email);
        if (count($parts) === 2) {
            $localPart = $parts[0];
            $domain = $parts[1];
            $maskedLocalPart = substr($localPart, 0, 1) . str_repeat('*', max(0, strlen($localPart) - 1));
            $maskedEmail = $maskedLocalPart . "@" . $domain;
            $_SESSION['masked_email'] =  $maskedEmail;
            return true;
        }
        return false;
    }
    public function __destruct() {
        DatabaseConnector::destroyInstance();
    }
}
try{
    if($_SERVER["REQUEST_METHOD"] === 'POST'){
        $mailer = new Mailer();
        $token = bin2hex(random_bytes(16));
        $token_hash = hash("sha256", $token);
        $expiry = date("Y-m-d H:i:s", time() + 60 * 15);
        $email = $_POST['email'] ?? $_SESSION['user-email'];
        $manager = new ManageEmailFacade($mailer, $token_hash, $expiry);
        $manager->manageEmail($email, $token);
    }
}
catch(Exception $e){
    ResponseSender::getMessage()->sendResponse('error', 'Wystąpił nieoczekiwany błąd: ' . $e->getMessage());
}
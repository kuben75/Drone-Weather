<?php

namespace Mailer;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . "/../../vendor/autoload.php";

class Mailer
{
    private PHPMailer $mail;

    public function __construct()
    {
        $this->mail = new PHPMailer(true);
        $this->setup();
    }

    private function setup(): void
    {
        try {
            $this->mail->isSMTP();
            $this->mail->Host = "smtp.gmail.com";
            $this->mail->SMTPAuth = true;
            $this->mail->Username = "sheyabin21@gmail.com";
            $this->mail->Password = "oxvloxaikqcyawpy";
            $this->mail->Port = 587;
            $this->mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $this->mail->isHTML(true);
            $this->mail->CharSet = 'UTF-8';
        } catch (Exception $e) {
            echo "Mailer Error: " . $this->mail->ErrorInfo;
        }
    }

    public function getMailerInstance(): PHPMailer
    {
        return $this->mail;
    }
}

return new Mailer();

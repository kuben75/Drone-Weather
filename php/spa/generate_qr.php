<?php
require '../../vendor/autoload.php';

use Endroid\QrCode\Builder\Builder;
use Endroid\QrCode\Writer\PngWriter;
use PragmaRX\Google2FA\Google2FA;

session_start();

if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)){
    session_destroy();
    header("Location: index.php");
    exit;
}

$google2fa = new Google2FA();
$secret = $_SESSION['2fa_secret'] ?? $google2fa->generateSecretKey();

$qrCodeUrl = $google2fa->getQRCodeUrl(
    'localhost',
    $_SESSION['username'],
    $secret
);

$result = Builder::create()
    ->writer(new PngWriter())
    ->data($qrCodeUrl)
    ->size(300)
    ->build();

header('Content-Type: ' . $result->getMimeType());
echo $result->getString();
?>
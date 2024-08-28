<?php
session_start();

$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
}
$username = trim($_POST['username']);
$email = trim($_POST['email']);
$password = trim($_POST['password']);
$pswRepeat = trim($_POST['psw-repeat']);
if (empty($username) || empty($email) || empty($password) || empty($pswRepeat)) {
    $_SESSION['message'] = "Wypełnij wszystkie pola";
} else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $_SESSION['message'] = 'Nieprawidłowy email';

} else if (preg_match('/^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9]+$/', $username) == 0 && (strlen($username) < 3)){
    $_SESSION['message'] = 'Nieprawidłowa nazwa użytkownika';

} else if (strlen($password) > 20 || strlen($password) < 5) {
    $_SESSION['message'] = 'Hasło musi zawierać między 5 a 20 znaków';

} else if ($password !== $pswRepeat) {
    $_SESSION['message'] = "Hasła się nie zgadzają.";

} else {
    $stmt = $con->prepare('SELECT id FROM users WHERE username = ? OR email = ?');
    if ($stmt) {
        $stmt->bind_param("ss", $username, $email);
        $stmt->execute();
        $stmt->store_result();
        if ($stmt->num_rows > 0) {
            $_SESSION['message'] = "Użytkownik istnieje";
        } else {
            $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
            $stmt = $con->prepare("INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, NOW())");
            $stmt->bind_param("sss", $username, $email, $hashedPassword);

            if ($stmt->execute()) {
                $id = $stmt->insert_id;
                session_regenerate_id(true);
                $_SESSION['loggedin'] = true;
                $_SESSION['id'] = $id;
                $_SESSION['created_at'] = date("Y-m-d H:i:s");
                $_SESSION['username'] = $username;
                $_SESSION['start'] = time();
                $_SESSION['expire'] = $_SESSION['start'] + 1800;
                header("Location: ../index.php");
                exit();
            } else {
                $_SESSION['message'] = "Błąd";
            }
        }
        $stmt->close();
    }
}
$con->close();
header("Location: ../registration.php");
exit();
?>

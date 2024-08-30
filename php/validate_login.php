<?php
session_start();
$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
}

$username = $_POST['username'];
$password = $_POST['password'];

if (empty($username) || empty($password)) {
    $_SESSION["message"] = "Wypełnij wszystkie pola";
    header('Location: ../userlogin.php');
    exit();
}

if ($stmt = $con->prepare("SELECT id, password, is_2fa_enabled FROM users WHERE username=?")) {
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->bind_result($id, $hashedPassword, $is_2fa_enabled);
        $stmt->fetch();

        if (password_verify($password, $hashedPassword)) {
            session_regenerate_id(true);
            $_SESSION['id'] = $id;
            $_SESSION['username'] = $username;
            $_SESSION['start'] = time();
            $_SESSION['expire'] = $_SESSION['start'] + (24 * 3600);
            $_SESSION['is_2fa_enabled'] = $is_2fa_enabled;
            if (!empty($_POST['remember'])) {
                setcookie("username", $username, time() + 3600, "/", "", true, true);
            }
            if ($is_2fa_enabled) {
                header("Location: enter_2fa.php");
                exit();
            } else {
                $_SESSION['loggedin'] = true;
                header("Location: ../index.php");
                exit();
            }
        } else {
            $_SESSION["message"] = "Nieprawidłowa nazwa użytkownika lub hasło";
        }
    } else {
        $_SESSION["message"] = "Nieprawidłowa nazwa użytkownika lub hasło";
    }

    $stmt->close();
} else {
    echo "error" . $con->error;
}

$con->close();
header('Location: ../userlogin.php');
exit();
?>

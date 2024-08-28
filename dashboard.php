<?php
session_start();
if (!isset($_SESSION['loggedin']) || !$_SESSION['loggedin'] || time() > ($_SESSION['expire'] ?? 0)) {
    session_destroy();
    header("Location: index.php");
    exit;
}
$con = new mysqli("localhost", "root", "", "users");
if ($con->connect_error) {
    die("Połączenie z bazą danych nie powiodło się: " . $con->connect_error);
}

$stmt = $con->prepare("SELECT username, email, password, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $_SESSION['id']);
$stmt->execute();
$stmt->bind_result($_SESSION['username'], $email, $password, $created);
$stmt->fetch();
$stmt->close();
?>

<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Panel użytkownika</title>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="css/dashboard.css"/>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">

	</head>
	<body>
    <nav class="nav">
                <ul class="nav__list">
                    <li class="nav__item">
                        <a href="#" class="nav__link spa" data-url="./php/spa/panel.php">
                            <i class="fa-solid fa-chalkboard-user"></i>
                            <span class="nav__description">Panel</span>
                        </a>
                    </li>
                    <li class="nav__item ">
                        <a href="#" class="nav__link spa" data-url="./php/spa/calendar.php">
                            <i class="fa-solid fa-calendar-alt"></i>
                            <span class="nav__description">Kalendarz</span>
                        </a>
                    </li>
                    <li class="nav__item ">
                        <a href="#" class="nav__link spa"  data-url="./php/spa/reservation.php">
                            <i class="fa-solid fa-map-location-dot"></i>
                            <span class="nav__description">Zarządanie rezerwacjami</span>
                        </a>
                    </li>
                    <li class="nav__item ">
                        <a href="#" class="nav__link spa" data-url="./php/spa/account.php">
                            <i class="fa-solid fa-user-pen"></i>
                            <span class="nav__description">Zarządanie kontem</span>
                        </a>
                    </li>
                    <li class="nav__item ">
                        <a href="#" class="nav__link spa" data-url="./php/spa/security.php">
                        <i class="fa-solid fa-shield-halved"></i>
                            <span class="nav__description">Bezpieczeństwo konta</span>
                        </a>
                    </li>
                    <li class="nav__item" id="link-history">
                        <a href="#" class="nav__link spa" data-url="./php/spa/history.php">
                            <i class="fa-solid fa-clock-rotate-left"></i>
                            <span class="nav__description">Historia</span>
                        </a>
                    </li>
                    <li class="nav__item">
                        <a href="#" class="nav__link spa" data-header="./php/spa/header.php">
                            <i class="fa-solid fa-house"></i>
                            <span class="nav__description"> Powrót do strony głównej</span>
                        </a>
                    </li>
                    <li class="nav__item logout">
                        <a href="#" class="nav__link spa" data-logouturl="./php/spa/logout.php">
                            <i class="fa-solid fa-arrow-right-from-bracket"></i>
                            <span class="nav__description">Wyloguj się</span>
                        </a>
                    </li>
                </ul>
            </nav>
    <main class="dashboard">

</main>
            <script type="module" src="js/dashboard/main.js"></script>
	</body>
</html>
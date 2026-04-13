-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Paź 10, 2024 at 07:26 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `users`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `circles`
--

CREATE TABLE `circles` (
  `id` int(11) NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `radius` int(11) NOT NULL,
  `color` varchar(20) NOT NULL,
  `fillColor` varchar(20) NOT NULL,
  `fillOpacity` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `circles`
--

INSERT INTO `circles` (`id`, `lat`, `lng`, `radius`, `color`, `fillColor`, `fillOpacity`) VALUES
(1, 52.42050199790142, 16.826022730003853, 2500, 'red', '#f03', 0.5),
(2, 53.58609802847799, 14.90168469372876, 2500, 'red', '#f03', 0.5),
(3, 51.10432681948524, 16.885724058031233, 2500, 'red', '#f03', 0.5),
(4, 50.475500211223874, 19.081534998635686, 2500, 'red', '#f03', 0.5),
(5, 50.07757676482803, 19.785244821603488, 2500, 'red', '#f03', 0.5),
(6, 50.11173428655892, 22.02629833246739, 2500, 'red', '#f03', 0.5),
(7, 51.23998352471328, 22.715254725553596, 2500, 'red', '#f03', 0.5),
(8, 52.44886258730588, 20.65230835652003, 2500, 'red', '#f03', 0.5),
(9, 52.269090205750466, 20.90817568419123, 2500, 'red', '#f03', 0.5),
(10, 52.16680128939028, 20.96981725220046, 2500, 'red', '#f03', 0.5),
(11, 53.4818697478617, 20.937890649629658, 2500, 'red', '#f03', 0.5),
(12, 54.37842994361663, 18.470725127402247, 2500, 'red', '#f03', 0.5),
(13, 53.09857657845142, 17.974163750348172, 2500, 'red', '#f03', 0.5),
(14, 52.138483855512774, 15.79405483590891, 2500, 'red', '#f03', 0.5),
(15, 51.71992339658355, 19.39105186846259, 2500, 'red', '#f03', 0.5),
(16, 51.39161590030565, 21.207008501410364, 2500, 'red', '#f03', 0.5);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `coords`
--

CREATE TABLE `coords` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `lat` double NOT NULL,
  `lng` double NOT NULL,
  `radius` int(11) NOT NULL DEFAULT 1500,
  `user_color` varchar(20) NOT NULL,
  `user_fillColor` varchar(20) NOT NULL,
  `user_fillOpacity` varchar(20) NOT NULL,
  `color` varchar(20) NOT NULL,
  `fillColor` varchar(20) NOT NULL,
  `fillOpacity` float NOT NULL,
  `drone` varchar(255) NOT NULL,
  `reserve` datetime NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `description` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `coords`
--

INSERT INTO `coords` (`id`, `user_id`, `lat`, `lng`, `radius`, `user_color`, `user_fillColor`, `user_fillOpacity`, `color`, `fillColor`, `fillOpacity`, `drone`, `reserve`, `created_at`, `description`) VALUES
(56, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-18 13:27:00', '2024-09-16 10:50:11', 'dziekunejewaj'),
(57, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-21 08:41:00', '2024-09-16 10:51:57', 'costam dzieki'),
(58, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-08 13:27:00', '2024-09-17 06:48:59', 'dasdasdasdasd'),
(59, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-25 08:41:00', '2024-09-17 11:28:25', 'no opis jakis tam'),
(60, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-27 13:27:00', '2024-09-18 11:27:22', 'tak sobie testuje'),
(61, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-20 13:31:00', '2024-09-18 11:31:27', 'super latanie dronem'),
(62, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-23 08:41:00', '2024-09-19 06:33:15', 'kdskakdskasdkdksak'),
(63, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-21 09:26:00', '2024-09-20 07:27:00', 'opiskroraeoad'),
(64, 60, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-21 09:31:00', '2024-09-20 07:31:49', 'dsadsa'),
(65, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-21 10:44:00', '2024-09-20 08:45:03', 'opis jakistam'),
(66, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-09-28 10:45:00', '2024-09-20 08:45:33', 'gggggggggggg'),
(67, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-10-01 15:26:00', '2024-09-30 13:26:29', 'sdadasdsads'),
(68, 54, 0, 0, 0, '', '', '', '', 'blue', 0, '', '2024-10-05 15:30:00', '2024-09-30 13:30:24', 'dasdas'),
(71, 54, 52.488282041715, 17.451782226563, 1500, 'green', 'green', '0.3', 'blue', 'blue', 0.5, 'gownomaciejka', '2024-10-25 10:08:00', '2024-10-07 08:08:49', 'dsadasdasdas'),
(72, 54, 52.425589651674, 17.064514160156, 1500, 'green', 'green', '0.3', 'blue', 'blue', 0.5, 'pomocy', '2024-10-18 15:06:00', '2024-10-09 13:06:33', 'dddddddddddd'),
(73, 54, 52.49663714203, 16.784362792969, 1500, 'green', 'green', '0.3', 'blue', 'blue', 0.5, 'jaja', '2024-10-24 18:17:00', '2024-10-09 16:17:16', 'pomocy jestem w pociongu help dsaaaaaaaaaaa');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(20) DEFAULT NULL,
  `surname` varchar(30) DEFAULT NULL,
  `username` varchar(70) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone_number` varchar(20) DEFAULT NULL,
  `language` varchar(20) NOT NULL DEFAULT 'pl',
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_2fa_enabled` tinyint(1) DEFAULT 0,
  `2fa_secret` varchar(255) DEFAULT NULL,
  `reset_token_hash` varchar(64) DEFAULT NULL,
  `reset_token_expires_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `surname`, `username`, `email`, `phone_number`, `language`, `password`, `created_at`, `is_2fa_enabled`, `2fa_secret`, `reset_token_hash`, `reset_token_expires_at`) VALUES
(52, NULL, NULL, 'kuben', 'test@gmail.com', NULL, 'pl', '$2y$10$Fi333vgBfCMMEc/F2YtnG.VSHTfQB5dCFnpxKC/OaJ3i/mdvn3HDa', '2024-09-06 11:10:46', 1, 'SU11Qy9kZmZhSFhJZU90M1Niek5XOHRBdnprRU53WXJpUW5URi9EU2lLOD06OnU0ekxLYXpsNHloNlZWc1I2bjNacXc9PQ==', NULL, NULL),
(54, 'dsadsadsad', 'dsadsa', 'kuba1', 'dsjdsj@testiwoanie.pl', NULL, 'pl', '$2y$10$ZiCTEQeEfbfSI5m2NnuhwuxrPk631tiP95yfNmF9bjKXaHOhpRBVG', '2024-09-06 11:15:06', 0, NULL, NULL, NULL),
(55, NULL, NULL, 'testowanie', 'testowanie@gmail.com', NULL, 'pl', '$2y$10$17/7qgLeccNhzTSd/wYroOF2Tzs5ahLOhTDt/x/lWwIGz59uwBDqS', '2024-09-07 13:17:28', 0, NULL, NULL, NULL),
(57, NULL, NULL, 'dsadsadas', 'sdadasdsa@gmdsamd.pl', NULL, 'pl', '$2y$10$JoWzqk/dO8L4QeWMPVkTwehY/tXlm.X/w/S.oJjvCOWwNk7QDeXtW', '2024-09-10 11:34:14', 0, NULL, NULL, NULL),
(58, NULL, NULL, 'dsadsa', 'dsadas@gmail.com', NULL, 'pl', '$2y$10$LZuULpNywca73BOBCfMrheSh01ilSUrjw7srHmAuh1yoopTFeRjca', '2024-09-10 11:34:28', 0, NULL, NULL, NULL),
(59, NULL, NULL, 'adsdsadas', 'sadd@gds.pl', NULL, 'pl', '$2y$10$3GAUoXUIvGo/ZaQe0dSSa.//Z5SvNI5luWA6G/07LEK.dDER/Kep6', '2024-09-10 11:37:22', 0, NULL, NULL, NULL),
(60, NULL, NULL, 'dsad', 'dskdkasdk@gmail.opllp', NULL, 'pl', '$2y$10$2ZAYjAyejtJIRRRyh2v/N.Ps4Msd4sdEP/P3x1bGeabDeRWYeQu0O', '2024-09-20 07:29:25', 0, NULL, NULL, NULL);

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `circles`
--
ALTER TABLE `circles`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `coords`
--
ALTER TABLE `coords`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `reset_token_hash` (`reset_token_hash`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `circles`
--
ALTER TABLE `circles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `coords`
--
ALTER TABLE `coords`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `coords`
--
ALTER TABLE `coords`
  ADD CONSTRAINT `coords_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 28, 2024 at 01:09 PM
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
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(70) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_2fa_enabled` tinyint(1) DEFAULT 0,
  `2fa_secret` varchar(32) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  ADD UNIQUE KEY `email` (`email`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

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

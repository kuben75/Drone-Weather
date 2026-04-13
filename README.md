#  Drone Weather - Airspace Management System

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PHP](https://img.shields.io/badge/PHP_8-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MariaDB](https://img.shields.io/badge/MariaDB-003545?style=for-the-badge&logo=mariadb&logoColor=white)](https://mariadb.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)
[![SASS](https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)

Drone Weather is an advanced web application designed for Unmanned Aerial Vehicle (UAV) operators. It addresses the critical need for safe flight planning by integrating real-time meteorological data with an interactive airspace zone reservation system.

Built entirely **from scratch (Vanilla)** without relying on heavy frameworks (such as React or Laravel), this project demonstrates a profound understanding of software engineering fundamentals, application architecture, and design patterns.

---

##  Technical Highlights 

This project is the result of intensive learning and the implementation of software engineering best practices. Key architectural achievements include:

* **Custom SPA & Dependency Injection (Frontend):** Instead of using off-the-shelf solutions, I implemented a custom DI container in TypeScript alongside a Single Page Application routing system. This ensures modularity, testability, and a seamless user experience without page reloads.
* **Design Patterns (Backend):** The PHP 8 logic heavily relies on proven design patterns such as *Singleton* (database connection management), *Facade* (handling complex processes like password resets), and *Strategy* (dynamic validation for login/registration forms).
* **Advanced Mathematics (Haversine Formula):** Implemented a collision detection algorithm on the map. The application calculates the great-circle distance between two sets of geographical coordinates on a sphere to prevent overlapping flight reservation zones.
* **Rigorous Security:**
    * Built-in **Google 2FA** (Two-Factor Authentication).
    * Full protection against SQL Injection using Prepared Statements.
    * Sensitive data encryption (OpenSSL) and secure management of sessions and time-limited one-time tokens.
* **Automated Database Management:** A custom "Garbage Collector" script that automatically frees up flight zones on the map immediately after their reservation time expires.

---

##  Key Features

###  Interactive Map & Reservations
* Integration with the Leaflet.js API.
* Browse predefined zones (e.g., airports) and areas currently reserved by other users.
* Reserve your own flight zones directly on the map (with built-in collision prevention).

###  Weather Safety Verification
* Connection to a real-time weather API (WeatherAPI).
* Dynamic analysis of atmospheric conditions (wind speed, gusts, visibility, UV index) providing an immediate flight safety status indicator.

###  User Dashboard & Calendar
* Custom-built calendar system (rendered via PHP) to easily track upcoming reservations.
* Activity logs tracking login history alongside IP addresses for enhanced security.
* Dynamic internationalization (i18n - EN/PL) with user preferences saved in both the database and LocalStorage.

---

##  Architecture & Tech Stack

**Frontend:**
* **Language:** TypeScript (compiled to ES6 Modules)
* **Styling:** SCSS (architecture based on variables and modules), Flexbox/Grid
* **Libraries:** Leaflet.js

**Backend:**
* **Language:** PHP 8.x (Strict typing, Namespaces, OOP)
* **Database:** MariaDB (MySQL-compatible, relational structure with foreign keys)
* **Packages (Composer):** PHPMailer (SMTP handling), Google2FA, QrCode

---

##  Screenshots
<img width="2512" height="1288" alt="image" src="https://github.com/user-attachments/assets/ce558f75-14f7-4cc6-b65e-e272e29d7f00" />

<img width="2501" height="1291" alt="image" src="https://github.com/user-attachments/assets/0d2229e2-5fd1-4d6c-a1f8-f70df14c42f3" />

<img width="2502" height="1290" alt="image" src="https://github.com/user-attachments/assets/91d1d41e-3422-4a53-8162-5a74875a7f52" />

<img width="2501" height="1280" alt="image" src="https://github.com/user-attachments/assets/e30a8dee-b431-4f7c-b36c-1d8baf84af8d" />

<img width="2511" height="1283" alt="image" src="https://github.com/user-attachments/assets/645a1b6b-bc2a-4cd3-aa7d-08cae5ae32a2" />

<img width="2517" height="1292" alt="image" src="https://github.com/user-attachments/assets/c8acc2d5-0b6c-48e6-a6ba-1b9570713a20" />

<img width="2508" height="1288" alt="image" src="https://github.com/user-attachments/assets/997c1109-53b7-467d-add6-7761ae175d73" />

<img width="2500" height="1292" alt="image" src="https://github.com/user-attachments/assets/7416025e-727d-402a-b1aa-20c122790fbb" />

<img width="2512" height="1283" alt="image" src="https://github.com/user-attachments/assets/d7b8a53a-703a-49af-9bb2-3ef4ffc24bd8" />

---

##  Local Setup

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/kuben75/drone-weather.git
   ```
2. Set up a local environment (e.g., XAMPP)
3. Import the database structure file (sql/database.sql) into your MySQL server
4. Update the database credentials in the php/db_connection.php file.
5. Install backend dependencies using Composer:
   ```bash
   composer install
   ```
6. (Optional) Configure your own API key in the WeatherAPI class and SMTP details in the Mailer class.
7. Open the project in your browser.

## Author

Jakub Ławniczak
Zuzanna Szatkowska

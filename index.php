<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
require 'php/init.php';
require 'php/callDataBase.php';
?>
<!doctype html>
<html lang="pl">

<head>
  <meta charset="UTF-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Drone weather</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <script src="https://kit.fontawesome.com/e6e67f4e19.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
</head>

<body>
  <header class="header">
    <nav class="nav">
      <div class="nav__brand">
        <div class="nav__logo"></div>
      </div>
      <div class="nav__menu">
        <button class="nav__menu-toggle nav__menu-toggle--hidden">
          <span></span>
        </button>
        <ul class="nav__menu-list">

          <li class="nav__menu-item">
            <a href="#weather" class="nav__menu-link translate" data-translate="weather" id="#weathSlide"></a>
          </li>
          <li class="nav__menu-item">
            <a href="#mapslide" class="nav__menu-link translate" data-translate="map" id="#mapSlide"></a>
          </li>
          <li class="nav__menu-item">
            <a href="#contact" class="nav__menu-link translate" data-translate="contact" id="#contactSlide"></a>
          </li>
          <li class="nav__menu-item">
            <div class="nav__language">
              <ul class="nav__language-list">
                <li class="nav__language-item">
                  <a href="#" class="nav__language-selector translate" data-translate="selectLanguage">
                    <span class="nav__language-arrow">▼</span>
                  </a>
                  <ul class="nav__language-dropdown">
                    <li class="nav__language-dropdown-item">
                      <a href="?lang=pl" data-id="pl">
                        <img src="img/pl_img.svg" alt="Polska Flaga"> PL
                      </a>
                    </li>
                    <li class="nav__language-dropdown-item">
                      <a href="?lang=en" data-id="en">
                        <img src="img/en_img.svg" alt="Brytyjska Flaga"> EN
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
          <?php if ($isLoggedIn): ?>
          <li class="nav__menu-item">
            <div class="nav__account">
              <ul class="nav__account-list">
                <li class="nav__account-item">
                  <a href="#" class="nav__account-selector">
                    <img src="./img/user_default.svg" alt="Avatar" class="nav__account-avatar">
                    <span class="nav__account-arrow">▼</span>
                  </a>
                  <ul class="nav__account-dropdown">
                    <li class="nav__account-dropdown-item">
                      <a href="dashboard.php">Mój profil</a>
                    </li>
                    <li class="nav__account-dropdown-item">
                      <a href="php/spa/logout.php">Wyloguj się</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
          <?php else: ?>
          <li class="nav__menu-item">
            <div class="nav__account">
              <ul class="nav__account-list">
                <li class="nav__account-item">
                  <a href="#" class="nav__account-selector">Moje konto
                    <span class="nav__account-arrow">▼</span>
                  </a>
                  <ul class="nav__account-dropdown">
                    <li class="nav__account-dropdown-item">
                      <a href="registration.php">Zarejestruj się</a>
                    </li>
                    <li class="nav__account-dropdown-item">
                      <a href="userlogin.php">Zaloguj się</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </li>
          <?php endif; ?>
        </ul>
      </div>
    </nav>
    <div class="header__title">
      <h1>Drone weather</h1>
    </div>
  </header>
  <section class="temp-switch" id="weather">
    <label class="temp-switch__label">
      <input type="checkbox" id="temp-toggle" class="temp-switch__input" />
      <div class="temp-switch__slider"></div>
      <span class="temp-switch__cels">°C</span>
      <span class="temp-switch__fahr">°F</span>
    </label>
  </section>

  <main class="main-content">
    <section class="main-content__tables">
      <div class="main-content__wrapper">
        <div class="main-content__top">
          <div class="main-content__top-city">
            <h1 class="main-content__top-city-name"></h1>
          </div>
          <div class="main-content__main-info">
            <div class="main-info__input-container">
              <form name="myForm" method="post" autocomplete="off">
                <input class="main-info__input-container-text translate" id="myInput" type="text"
                  placeholder="Wpisz nazwę miasta..." data-placeholder="inputPlaceholder" aria-label="Nazwa miasta" />
              </form>
              <p class="main-info__input-container-warning" aria-live="polite"></p>
            </div>
          </div>
          <div class="main-content__top-time">
            <h2 class="main-content__local-time"></h2>
          </div>
        </div>
        <div class="main-content__middle">
          <div class="main-content__middle-temperature">
            <p class="main-content__temperature"></p>
            <img src="./img/unknown.png" alt="Obrazek przedstawiający pogodę" class="main-content__middle-photo" />
          </div>
        </div>

        <div class="main-content__bottom">
          <div class="main-content__headings">
            <p class="headings__weather translate" data-translate="weatherCheck"></p>
            <p class="headings__cloud-cover translate" data-translate="cloudCoverage"></p>
            <p class="headings__visibility translate" data-translate="visibility"></p>
          </div>
          <div class="main-content__weather-info">
            <p class="weather-info__weather"></p>
            <p class="weather-info__cloud"></p>
            <p class="weather-info__visibility"></p>
          </div>
          <div class="main-content__headings">
            <p class="headings__wind-speed translate" data-translate="windSpeed"></p>
            <p class="headings__wind-direction translate" data-translate="windDirection"></p>
            <p class="headings__wind-degree translate" data-translate="windDegre"></p>
          </div>
          <div class="main-content__weather-info">
            <p class="weather-info__wind"></p>
            <p class="weather-info__wind-direction"></p>
            <p class="weather-info__wind-degree"></p>
          </div>
          <div class="main-content__headings">
            <p class="headings__wind-gusts translate" data-translate="windGusts"></p>
            <p class="headings__humidity translate" data-translate="humidity"></p>
            <p class="headings__uv-index translate" data-translate="uvIndex"></p>
          </div>
          <div class="main-content__weather-info">
            <p class="weather-info__gust"></p>
            <p class="weather-info__humidity"></p>
            <p class="weather-info__uv"></p>
          </div>
        </div>
      </div>

      <div class="main-content__table">
        <div class="table__title">
          <h2 class="table__title-text translate" data-translate="tabbleTitle"></h2>
          <ol class="table__list">
            <li class="table__list-item" style="--cardColor:#f2f2f2">
              <div class="table__list-content">
                <div class="table__list-heading-one translate" data-translate="weather"></div>
                <span class="table__weather-condition"></span>
              </div>
            </li>
            <li class="table__list-item" style="--cardColor:#f2f2f2">
              <div class="table__list-content">
                <div class="table__list-heading-two translate" data-translate="cloudCoverage"></div>
                <span class="table__cloud-cover"></span>
              </div>
            </li>
            <li class="table__list-item" style="--cardColor:#f2f2f2">
              <div class="table__list-content">
                <div class="table__list-heading-three translate" data-translate="visibility"></div>
                <span class="table__visibility"></span>
              </div>
            </li>
            <li class="table__list-item" style="--cardColor:#f2f2f2">
              <div class="table__list-content">
                <div class="table__list-heading-four translate" data-translate="windSpeed"></div>
                <span class="table__wind-speed"></span>
              </div>
            </li>
            <li class="table__list-item" style="--cardColor:#f2f2f2">
              <div class="table__list-content">
                <div class="table__list-heading-five translate" data-translate="windGusts"></div>
                <span class="table__wind-gusts"></span>
              </div>
            </li>
            <li class="table__list-item" style="--cardColor:#f2f2f2">
              <div class="table__list-content">
                <div class="table__list-heading-six translate" data-translate="humidity"></div>
                <span class="table__humidity"></span>
              </div>
            </li>
            <li class="table__list-item" style="--cardColor:#f2f2f2">
              <div class="table__list-content">
                <div class="table__list-heading-sev translate" data-translate="uvIndex"></div>
                <span class="table__uv-index"></span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>
    <section class="weather-data" id="mapslide">
      <div class="weather-data__element weather-data__element--one">
        <div class="weather-data__header">
          <h1 class="weather-data__time0"></h1>
        </div>
        <div class="weather-data__body">
          <div class="weather-data__image0">
            <img src="./img/unknown.png" alt="Obrazek przedstawiający pogodę" class="weather-data__photo0" />
          </div>
        </div>
        <div class="weather-data__footer">
          <h1 class="weather-data__temperature0"></h1>
        </div>
      </div>

      <div class="weather-data__element weather-data__element--two">
        <div class="weather-data__header">
          <h1 class="weather-data__time1"></h1>
        </div>
        <div class="weather-data__body">
          <div class="weather-data__image">
            <img src="./img/unknown.png" alt="Obrazek przedstawiający pogodę" class="weather-data__photo1" />
          </div>
        </div>
        <div class="weather-data__footer">
          <h1 class="weather-data__temperature1"></h1>
        </div>
      </div>

      <div class="weather-data__element weather-data__element--three">
        <div class="weather-data__header">
          <h1 class="weather-data__time2"></h1>
        </div>
        <div class="weather-data__body">
          <div class="weather-data__image">
            <img src="./img/unknown.png" alt="Obrazek przedstawiający pogodę" class="weather-data__photo2" />
          </div>
        </div>
        <div class="weather-data__footer">
          <h1 class="weather-data__temperature2"></h1>
        </div>
      </div>

      <div class="weather-data__element weather-data__element--four">
        <div class="weather-data__header">
          <h1 class="weather-data__time3"></h1>
        </div>
        <div class="weather-data__body">
          <div class="weather-data__image">
            <img src="./img/unknown.png" alt="Obrazek przedstawiający pogodę" class="weather-data__photo3" />
          </div>
        </div>
        <div class="weather-data__footer">
          <h1 class="weather-data__temperature3"></h1>
        </div>
      </div>

      <div class="weather-data__element weather-data__element--five">
        <div class="weather-data__header">
          <h1 class="weather-data__time4"></h1>
        </div>
        <div class="weather-data__body">
          <div class="weather-data__image">
            <img src="./img/unknown.png" alt="Obrazek przedstawiający pogodę" class="weather-data__photo4" />
          </div>
        </div>
        <div class="weather-data__footer">
          <h1 class="weather-data__temperature4"></h1>
        </div>
      </div>

      <div class="weather-data__element weather-data__element--six">
        <div class="weather-data__header">
          <h1 class="weather-data__time5"></h1>
        </div>
        <div class="weather-data__body">
          <div class="weather-data__image">
            <img src="./img/unknown.png" alt="Obrazek przedstawiający pogodę" class="weather-data__photo5" />
          </div>
        </div>
        <div class="weather-data__footer">
          <h1 class="weather-data__temperature5"></h1>
        </div>
      </div>
    </section>
    <section class="search__container">
      <input type="text" id="cityId" class="search__container-input translate" data-placeholder="inputPlaceholder"
        placeholder="Wpisz nazwę miasta...">
      <button class="search__container-button translate" data-translate="search" data-action="search"></button>
    </section>
      <section class="notification">
          <span class="notification__content"><strong>Sukces! </strong>udało ci się zarejestrować lot dronem!</span>
          <button class="notification__button" aria-label="Zamknij okno">
                <i class="fa-solid fa-x" aria-hidden="true"></i>
                  </button>
      </section>
      <?php if ($isLoggedIn): ?>
      <section class="modal">
          <div class="modal__window">
              <div class="modal__header">
                  <h2 class="modal__title">Zarezerwuj lot dronem</h2>
                  <button class="modal__close-btn" aria-label="Zamknij okno">
                      <i class="fa-solid fa-x" aria-hidden="true"></i>
                  </button>
              </div>
              <div class="modal__content">
                  <form action="" method="POST" class="modal__form" autocomplete="off">
                      <div class="modal__error-text"> <?php
                          if (isset($_SESSION['message'])) {
                              echo $_SESSION['message'];
                              unset($_SESSION['message']);
                          }
                          ?>
                      </div>
                      <div class="modal__form-group">
                          <label for="dronename" class="modal__label">Nazwa drona</label>
                          <input type="text" name="dronename" id="dronename" class="modal__input" placeholder="Wpisz nazwę drona" required>
                      </div>
                      <div class="modal__form-group">
                          <label for="meeting" class="modal__label">Wybierz datę i godzinę rezerwacji:</label>
                          <input type="datetime-local" id="reserve" name="reserve" class="modal__input">
                      </div>
                      <div class="modal__form-group modal__form-group--actions">
                          <button type="submit" class="modal__submit-btn">Zarejestruj lot</button>
                      </div>
                  </form>
              </div>
          </div>
      </section>
      <?php else : ?>
      <section class="modal__error">
          <div class="modal__window">
              <div class="modal__header">
                  <h2 class="modal__title">Ostrzeżenie</h2>
                  <button class="modal__close-btn" aria-label="Zamknij okno">
                      <i class="fa-solid fa-x" aria-hidden="true"></i>
                  </button>
              </div>
              <div class="modal__content">
                  <span class="modal__content-text">Musisz być zalogowany aby skorzystać z usługi rezerwacji </span>
              </div>
              <div class="modal__footer">
            <button class="modal__button modal__button--register"><a href="registration.php">Załóż konto</a></button>
             <button class="modal__button modal__button--login"><a href="userlogin.php">Zaloguj się</a></button>
            </div>

          </div>
      </section>
      <?php endif ; ?>
      <section id="map" class="map">
    </section>
  </main>
  <footer id="contact" class="contact">
    <h2 class="contact__title translate" data-translate="contact"></h2>
    <div class="contact__underline"></div>

    <div class="contact__container">
      <div class="contact__container-head">
        <h3 class="contact__container-title translate" data-translate="Headquarters"></h3>
        <p class="contact__container-address">ul. Ładna 43</p>
        <p class="contact__container-address">64-510 Wronki</p>
        <p class="contact__container-phone">+48 000 000 000</p>
        <p class="contact__container-email">droneweather@gmail.com</p>
      </div>
      <div class="contact__container-social-media">
        <h3 class="contact__container-social-title">Social Media</h3>
        <i class="contact__container-social-icon fa-brands fa-facebook"></i>
        <i class="contact__container-social-icon fa-brands fa-instagram"></i>
        <i class="contact__container-social-icon fa-brands fa-twitter"></i>
        <i class="contact__container-social-icon fa-brands fa-tiktok"></i>
      </div>
    </div>
    <div class="contact__container-shadow"></div>
  </footer>
  <script type="module" src="js/main.js"></script>
</body>

</html>
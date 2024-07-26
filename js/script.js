const input = document.querySelector(".main-info__input-container-text")
const cityName = document.querySelector(".main-content__top-city-name")
const localTime = document.querySelector(".main-content__local-time")
const warning = document.querySelector(".main-info__input-container-warning")
const photo = document.querySelector(".main-content__middle-photo")
const weather = document.querySelector(".weather-info__weather")
const temperature = document.querySelector(".main-content__temperature")
const humidity = document.querySelector(".weather-info__humidity")
const wind = document.querySelector(".weather-info__wind")
const cloud = document.querySelector(".weather-info__cloud")
const gust = document.querySelector(".weather-info__gust")
const windDir = document.querySelector(".weather-info__wind-direction")
const windDegree = document.querySelector(".weather-info__wind-degree")
const uv = document.querySelector(".weather-info__uv")
const vis = document.querySelector(".weather-info__visibility")
const weatherCondition = document.querySelector(`.table__weather-condition`)
const cloudCondition = document.querySelector(`.table__cloud-cover`)
const visCondition = document.querySelector(`.table__visibility`)
const speedCondition = document.querySelector(`.table__wind-speed`)
const gustCondition = document.querySelector(`.table__wind-gusts`)
const humCondition = document.querySelector(`.table__humidity`)
const uvCondition = document.querySelector(`.table__uv-index`)
const languagePl = document.querySelector('#pl-lang')
const languageEn = document.querySelector("#en-lang")
const headings = document.querySelectorAll('h4.heading-title')
let currentLanguage = 'pl'

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString(); 
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";

}
function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i].trim();
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}


const API_LINK = "https://api.weatherapi.com/v1/forecast.json?key="
const API_KEY = "c47ad91c29a24a908a9115318240207"

let weatherData = {};

const loadWeatherData = () => {
  return fetch('http://localhost/nauka/json/weatherData.json')
    .then(response => response.json())
    .then(data => {
      weatherData = data;
    })
    .catch(error => console.error('Error loading weather data:', error));
}
const loadWeatherTranslations = () => {
  return fetch('http://localhost/nauka/json/weatherTranslations.json')
    .then(response => response.json())
    .then(data => {
      weatherTranslations = data;
    })
    .catch(error => console.error('Error loading weather data:', error));
}


const changeLanguage = (lang) => {
  currentLanguage = lang
  console.log(`Changing language to ${lang}`);
  document.querySelector('.table__title-text').textContent = weatherTranslations.translations[lang].tabbleTitle
  document.querySelector('.main-info__input-container-text').placeholder = weatherTranslations.translations[lang].inputPlaceholder
  document.querySelector('.nav__language-selector').textContent = weatherTranslations.translations[lang].selectLanguage
  document.querySelector('.headings__weather').textContent = weatherTranslations.translations[lang].weatherCheck
  document.querySelector('.headings__cloud-cover').textContent = weatherTranslations.translations[lang].cloudCoverage
  document.querySelector('.headings__visibility').textContent = weatherTranslations.translations[lang].visibility
  document.querySelector('.headings__wind-speed').textContent = weatherTranslations.translations[lang].windSpeed
  document.querySelector('.headings__wind-direction').textContent = weatherTranslations.translations[lang].windDirection
  document.querySelector('.headings__wind-degree').textContent = weatherTranslations.translations[lang].windDegre
  document.querySelector('.headings__wind-gusts').textContent = weatherTranslations.translations[lang].windGusts
  document.querySelector('.headings__humidity').textContent = weatherTranslations.translations[lang].humidity
  document.querySelector('.headings__uv-index').textContent = weatherTranslations.translations[lang].uvIndex
  document.querySelector('.table__list-heading-one').textContent = weatherTranslations.translations[lang].weatherCheck
  document.querySelector('.table__list-heading-two').textContent = weatherTranslations.translations[lang].cloudCoverage
  document.querySelector('.table__list-heading-three').textContent = weatherTranslations.translations[lang].visibility
  document.querySelector('.table__list-heading-four').textContent = weatherTranslations.translations[lang].windSpeed
  document.querySelector('.table__list-heading-five').textContent = weatherTranslations.translations[lang].windGusts
  document.querySelector('.table__list-heading-six').textContent = weatherTranslations.translations[lang].humidity
  document.querySelector('.table__list-heading-sev').textContent = weatherTranslations.translations[lang].uvIndex
  document.querySelector('.contact__title').textContent = weatherTranslations.translations[lang].contact
  document.querySelector('.contact__container-title').textContent = weatherTranslations.translations[lang].Headquarters

}
const removeAccents = (str) =>
  str.replace(
    /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
    (char) => "acelnoszzACELNOSZZ"["ąćęłńóśźżĄĆĘŁŃÓŚŹŻ".indexOf(char)]
  )
const updateWeatherIcon = (code) => {
  const url = weatherData.weatherIcons[code];
  url
    ? photo.setAttribute("src", url)
    : photo.setAttribute("src", "./img/unknown.png")
}
const fetchWeather = (city, lang = currentLanguage) => {
  const URL = `${API_LINK}${API_KEY}&q=${removeAccents(city)}&lang=${lang}`
  return fetch(URL).then((response) => {
    if (!response.ok) {
      throw new Error("Error")
    }
    return response.json()
  })
}

const checkWeatherSafety = (code, lang = currentLanguage) => {
  console.log(`checkWeatherSafety: ${currentLanguage}`);
    if (weatherData.weatherSafetyMap.safe.includes(code)) 
        {
            weatherCondition.textContent =  weatherTranslations.translations[lang].weatherSafe
            weatherCondition.style.color = "green"
        }
    if (weatherData.weatherSafetyMap.caution.includes(code)) { 
        weatherCondition.textContent =  weatherTranslations.translations[lang].weatherCaution
        weatherCondition.style.color = "orange"

    }
    if (weatherData.weatherSafetyMap.unsafe.includes(code)) 
        {
            weatherCondition.textContent = weatherTranslations.translations[lang].weatherUnsafe
            weatherCondition.style.color = "red"
        }
}
const checkCloud = (data, lang) => {

  const updateCloud = `${data.current.cloud}`
  if (updateCloud <= 20) {
    cloudCondition.textContent = `${updateCloud}% - ${weatherTranslations.translations[lang].weatherSafe}`
    cloudCondition.style.color = "green"
  } else if (updateCloud > 20 && updateCloud <= 50) {
    cloudCondition.textContent = `${updateCloud}% - ${weatherTranslations.translations[lang].weatherCaution}`
    cloudCondition.style.color = "orange"
  } else {
    cloudCondition.textContent = `${updateCloud}% - ${weatherTranslations.translations[lang].weatherUnsafe}`
    cloudCondition.style.color = "red"
  }
}

const checkVisibility = (data, lang) => {
  const updateVis = `${data.current.vis_km}`
  if (updateVis >= 5) {
    visCondition.textContent = `${updateVis} km - ${weatherTranslations.translations[lang].weatherSafe}`
    visCondition.style.color = "green"
  } else if (updateVis > 1 && updateVis < 5) {
    visCondition.textContent = `${updateVis} km- ${weatherTranslations.translations[lang].weatherCaution}`
    visCondition.style.color = "orange"
  } else {
    visCondition.textContent = `${updateVis} km- ${weatherTranslations.translations[lang].weatherUnsafe}`
    visCondition.style.color = "red"
  }
};
const checkSpeed = (data, lang) => {
  const updateSpeed = `${Math.floor(data.current.wind_kph)}`

  if (updateSpeed <= 15) {
    speedCondition.textContent = `${updateSpeed} km/h - ${weatherTranslations.translations[lang].weatherSafe}`
    speedCondition.style.color = "green"
  } else if (updateSpeed > 15 && updateSpeed <= 30) {
    speedCondition.textContent = `${updateSpeed} km/h - ${weatherTranslations.translations[lang].weatherCaution}`
    speedCondition.style.color = "orange"
  } else {
    speedCondition.textContent = `${updateSpeed} km/h - ${weatherTranslations.translations[lang].weatherUnsafe}`
    speedCondition.style.color = "red"
  }
};

const checkGust = (data, lang) => {
  const updateGust = `${data.current.gust_kph}`;

  if (updateGust < 20) {
    gustCondition.textContent = `${updateGust} km/h - ${weatherTranslations.translations[lang].weatherSafe}`
    gustCondition.style.color = "green"
  } else if (updateGust >= 20 && updateGust <= 40) {
    gustCondition.textContent = `${updateGust} km/h-${weatherTranslations.translations[lang].weatherCaution}`
    gustCondition.style.color = "orange"
  } else {
    gustCondition.textContent = `${updateGust} km/h- ${weatherTranslations.translations[lang].weatherUnsafe}`
    gustCondition.style.color = "red"
  }
};
const checkHum = (data, lang) => {
  const updateHum = `${data.current.humidity}`

  if (updateHum <= 50) {
    humCondition.textContent = `${updateHum} % - ${weatherTranslations.translations[lang].weatherSafe}`
    humCondition.style.color = "green"
  } else if (updateHum > 50 || updateHum <= 70) {
    humCondition.textContent = `${updateHum} %- ${weatherTranslations.translations[lang].weatherCaution}`
    humCondition.style.color = "orange"
  } else {
    humCondition.textContent = `${updateHum} %- ${weatherTranslations.translations[lang].weatherUnsafe}`
    humCondition.style.color = "red"
  }
};
const checkUv = (data, lang) => {
  const updateUv = data.current.uv

  if (updateUv < 5) {
    uvCondition.textContent = `${updateUv}  - ${weatherTranslations.translations[lang].weatherSafe}`
    uvCondition.style.color = "green"
  } else if (updateUv >= 6 || updateUv < 11) {
    uvCondition.textContent = `${updateUv} - ${weatherTranslations.translations[lang].weatherCaution}`
    uvCondition.style.color = "orange"
  } else {
    uvCondition.textContent = `${updateUv} - ${weatherTranslations.translations[lang].weatherUnsafe}`
    uvCondition.style.color = "red"
  }
};

const updateNextWeather = (data) => {
  const currentTime = data.location.localtime.split(" ")[1].split(":")
  const currentHour = parseInt(currentTime[0], 10)

  const hourData = data.forecast.forecastday[0].hour
  const startIndex = hourData.findIndex(
    (hour) =>
      parseInt(hour.time.split(" ")[1].split(":")[0], 10) === currentHour
  );

  for (let i = 0; i < 6; i++) {
    const index = (startIndex + i + 1) % 24

    const cityHour = document.querySelector(`.weather-data__time${i}`)
    if (cityHour) {
      const timeOnly = hourData[index].time.split(" ")[1]
      cityHour.textContent = timeOnly
    }

    const cityWeather = document.querySelector(`.weather-data__photo${i}`)
    if (cityWeather) {
      const weatherCode = hourData[index].condition.code
      const weatherIconUrl = weatherData.weatherIcons[weatherCode]
      weatherIconUrl
        ? cityWeather.setAttribute("src", weatherIconUrl)
        : cityWeather.setAttribute("src", "./img/unknown.png")
    }

    const cityTemp = document.querySelector(`.weather-data__temperature${i}`)
    if (cityTemp) {
      const tempData = hourData[index].temp_c
      cityTemp.textContent = `${Math.floor(tempData)} ℃`
    }
  }
}

const updateWeatherInfo = (data, lang = currentLanguage) => {
  const locationName = data.location.name
  cityName.textContent = locationName
  const updateWeath = data.current.condition.text
  weather.textContent = updateWeath
  const updateTemp = `${Math.floor(data.current.temp_c)} ℃`
  temperature.textContent = updateTemp
  const fahr = (data.current.temp_c * 1.8 + 32).toFixed(0)
  temperature.dataset.fahrenheit = fahr
  const temp = `${Math.floor(data.current.temp_c)} ℃`
  temperature.dataset.celsious = temp
  const updateHum = `${data.current.humidity}%`
  humidity.textContent = updateHum
  const updateTime = data.location.localtime
  localTime.textContent = updateTime
  const updateWind = `${Math.floor(data.current.wind_kph)} km/h`
  wind.textContent = updateWind
  const updateCloud = `${data.current.cloud}%`
  cloud.textContent = updateCloud
  const updateGust = `${Math.floor(data.current.gust_kph)} km/h`
  gust.textContent = updateGust
  const updateDir = data.current.wind_dir
  windDir.textContent = updateDir
  const updateDeg = `${data.current.wind_degree} °`
  windDegree.textContent = updateDeg
  const updateUv = data.current.uv
  uv.textContent = updateUv
  const updateVis = `${data.current.vis_km} km`
  vis.textContent = updateVis;
  const code = data.current.condition.code
  console.log(`updateWeatherInfo: ${currentLanguage}`);
  updateWeatherIcon(code)
  updateNextWeather(data)
  checkWeatherSafety(code, lang)
  checkCloud(data, lang)
  checkVisibility(data, lang)
  checkSpeed(data, lang)
  checkGust(data, lang)
  checkHum(data, lang)
  checkUv(data, lang)
};
const defaultWeather = () => {
  let x = document.getElementById("myInput").value;
  document.cookie = x;
  const defaultCity = getCookie("city") || "Warszawa";
  fetchWeather(defaultCity)
    .then(updateWeatherInfo)
    .catch((err) => console.error(err));
}

const getWeather = () => {
  const city = input.value.trim();
  const lang = currentLanguage;
  console.log(`get weatcher: ${lang}`);
  const defaultCity = 'Warszawa';
  const selectedCity = city || defaultCity;
 
  setCookie("city", city, 1);
  fetchWeather(selectedCity, lang)
    .then(updateWeatherInfo)
    .catch(() => {
      warning.textContent = weatherTranslations.translations[lang].warning;
    });
}      

const changeTemp = document.querySelector("#temp-toggle")
const sliderOne = document.querySelector(".temp-switch__slider")
const celToFhr = () => {
  sliderOne.classList.toggle("toright");
  if (sliderOne.classList.contains("toright")) {
    temperature.textContent = `${temperature.dataset.fahrenheit} ℉`;
  } else {
    temperature.textContent = `${temperature.dataset.celsious}`;
  }
}

document.addEventListener("DOMContentLoaded", function() {
  const olcardsElements = document.querySelectorAll('.table__list li');
  const firstElementObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
  
        setTimeout(() => {
          olcardsElements.forEach((element, index) => {
            if (index > 0) {
              setTimeout(() => {
                element.classList.add('visible')
              }, index * 400) 
            }
          })
        }, 500)
      }
    })
  })
  
  firstElementObserver.observe(olcardsElements[0]);
  });


  document.querySelector('.nav__menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav__menu-toggle').classList.toggle('closeMenu')
    document.querySelector('ul').classList.toggle('showMenu')
})

changeTemp.addEventListener("change", celToFhr)
document.querySelector('form').addEventListener('submit', function (event) {
  event.preventDefault()

});

input.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    e.preventDefault()
    defaultWeather()
    getWeather()
  }
})
function handleLanguageChange(e) {
  e.preventDefault();
  const lang = e.target.dataset.id;
    currentLanguage = lang;
    changeLanguage(lang);
    defaultWeather(lang)
    getWeather(lang)
}

document.querySelectorAll('.nav__language-dropdown-item a').forEach(link => {
  link.addEventListener('click', handleLanguageChange);
})
const initializeWeatherApp = () => {
  loadWeatherData().then(loadWeatherTranslations()).then(
    () => {
    defaultWeather()
  }
 )
}

initializeWeatherApp()
document.addEventListener("DOMContentLoaded", defaultWeather)
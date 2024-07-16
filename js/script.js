const input = document.querySelector(".input-weather")
const cityName = document.querySelector(".city-name")
const localTime = document.querySelector(".local-time")
const warning = document.querySelector(".warning")
const photo = document.querySelector(".photo")
const weather = document.querySelector(".weather")
const temperature = document.querySelector(".temperature")
const humidity = document.querySelector(".humidity")
const wind = document.querySelector(".wind")
const cloud = document.querySelector(".cloud")
const gust = document.querySelector(".gust")
const windDir = document.querySelector(".wind-direction")
const windDegree = document.querySelector(".wind-degree")
const uv = document.querySelector(".uv")
const vis = document.querySelector(".visibility")
const cloudCondition = document.querySelector(`.weath-one`)
const visCondition = document.querySelector(`.weath-two`)
const speedCondition = document.querySelector(`.weath-three`)
const gustCondition = document.querySelector(`.weath-four`)
const humCondition = document.querySelector(`.weath-five`)
const uvCondition = document.querySelector(`.weath-six`)
const weatherCondition = document.querySelector(`.weath-condition`)
const languagePl = document.querySelector('#pl-lang')
const languageEn = document.querySelector("#en-lang")
let currentLanguage = 'pl'; 


const API_LINK = "https://api.weatherapi.com/v1/forecast.json?key="
const API_KEY = "c47ad91c29a24a908a9115318240207"
const weatherIcons = {
  1000: "http://cdn.weatherapi.com/weather/64x64/day/113.png",
  1003: "http://cdn.weatherapi.com/weather/64x64/day/116.png",
  1006: "http://cdn.weatherapi.com/weather/64x64/day/119.png",
  1009: "http://cdn.weatherapi.com/weather/64x64/day/122.png",
  1012: "http://cdn.weatherapi.com/weather/64x64/day/125.png",
  1015: "http://cdn.weatherapi.com/weather/64x64/day/128.png",
  1018: "http://cdn.weatherapi.com/weather/64x64/day/131.png",
  1021: "http://cdn.weatherapi.com/weather/64x64/day/134.png",
  1024: "http://cdn.weatherapi.com/weather/64x64/day/137.png",
  1027: "http://cdn.weatherapi.com/weather/64x64/day/140.png",
  1030: "http://cdn.weatherapi.com/weather/64x64/day/143.png",
  1033: "http://cdn.weatherapi.com/weather/64x64/day/146.png",
  1036: "http://cdn.weatherapi.com/weather/64x64/day/149.png",
  1039: "http://cdn.weatherapi.com/weather/64x64/day/152.png",
  1042: "http://cdn.weatherapi.com/weather/64x64/day/155.png",
  1045: "http://cdn.weatherapi.com/weather/64x64/day/158.png",
  1048: "http://cdn.weatherapi.com/weather/64x64/day/161.png",
  1051: "http://cdn.weatherapi.com/weather/64x64/day/164.png",
  1054: "http://cdn.weatherapi.com/weather/64x64/day/167.png",
  1057: "http://cdn.weatherapi.com/weather/64x64/day/170.png",
  1060: "http://cdn.weatherapi.com/weather/64x64/day/173.png",
  1063: "http://cdn.weatherapi.com/weather/64x64/day/176.png",
  1066: "http://cdn.weatherapi.com/weather/64x64/day/179.png",
  1069: "http://cdn.weatherapi.com/weather/64x64/day/182.png",
  1072: "http://cdn.weatherapi.com/weather/64x64/day/185.png",
  1075: "http://cdn.weatherapi.com/weather/64x64/day/188.png",
  1078: "http://cdn.weatherapi.com/weather/64x64/day/191.png",
  1081: "http://cdn.weatherapi.com/weather/64x64/day/194.png",
  1084: "http://cdn.weatherapi.com/weather/64x64/day/197.png",
  1087: "http://cdn.weatherapi.com/weather/64x64/day/200.png",
  1090: "http://cdn.weatherapi.com/weather/64x64/day/203.png",
  1093: "http://cdn.weatherapi.com/weather/64x64/day/206.png",
  1096: "http://cdn.weatherapi.com/weather/64x64/day/209.png",
  1099: "http://cdn.weatherapi.com/weather/64x64/day/212.png",
  1102: "http://cdn.weatherapi.com/weather/64x64/day/215.png",
  1105: "http://cdn.weatherapi.com/weather/64x64/day/218.png",
  1108: "http://cdn.weatherapi.com/weather/64x64/day/221.png",
  1111: "http://cdn.weatherapi.com/weather/64x64/day/224.png",
  1114: "http://cdn.weatherapi.com/weather/64x64/day/227.png",
  1117: "http://cdn.weatherapi.com/weather/64x64/day/230.png",
  1120: "http://cdn.weatherapi.com/weather/64x64/day/233.png",
  1123: "http://cdn.weatherapi.com/weather/64x64/day/236.png",
  1126: "http://cdn.weatherapi.com/weather/64x64/day/239.png",
  1129: "http://cdn.weatherapi.com/weather/64x64/day/242.png",
  1132: "http://cdn.weatherapi.com/weather/64x64/day/245.png",
  1135: "http://cdn.weatherapi.com/weather/64x64/day/248.png",
  1138: "http://cdn.weatherapi.com/weather/64x64/day/251.png",
  1141: "http://cdn.weatherapi.com/weather/64x64/day/254.png",
  1144: "http://cdn.weatherapi.com/weather/64x64/day/257.png",
  1147: "http://cdn.weatherapi.com/weather/64x64/day/260.png",
  1150: "http://cdn.weatherapi.com/weather/64x64/day/263.png",
  1153: "http://cdn.weatherapi.com/weather/64x64/day/266.png",
  1156: "http://cdn.weatherapi.com/weather/64x64/day/269.png",
  1159: "http://cdn.weatherapi.com/weather/64x64/day/272.png",
  1162: "http://cdn.weatherapi.com/weather/64x64/day/275.png",
  1165: "http://cdn.weatherapi.com/weather/64x64/day/278.png",
  1168: "http://cdn.weatherapi.com/weather/64x64/day/281.png",
  1171: "http://cdn.weatherapi.com/weather/64x64/day/284.png",
  1174: "http://cdn.weatherapi.com/weather/64x64/day/287.png",
  1177: "http://cdn.weatherapi.com/weather/64x64/day/290.png",
  1180: "http://cdn.weatherapi.com/weather/64x64/day/293.png",
  1183: "http://cdn.weatherapi.com/weather/64x64/day/296.png",
  1186: "http://cdn.weatherapi.com/weather/64x64/day/299.png",
  1189: "http://cdn.weatherapi.com/weather/64x64/day/302.png",
  1192: "http://cdn.weatherapi.com/weather/64x64/day/305.png",
  1195: "http://cdn.weatherapi.com/weather/64x64/day/308.png",
  1198: "http://cdn.weatherapi.com/weather/64x64/day/311.png",
  1201: "http://cdn.weatherapi.com/weather/64x64/day/314.png",
  1204: "http://cdn.weatherapi.com/weather/64x64/day/317.png",
  1207: "http://cdn.weatherapi.com/weather/64x64/day/320.png",
  1210: "http://cdn.weatherapi.com/weather/64x64/day/323.png",
  1213: "http://cdn.weatherapi.com/weather/64x64/day/326.png",
  1216: "http://cdn.weatherapi.com/weather/64x64/day/329.png",
  1219: "http://cdn.weatherapi.com/weather/64x64/day/332.png",
  1222: "http://cdn.weatherapi.com/weather/64x64/day/335.png",
  1225: "http://cdn.weatherapi.com/weather/64x64/day/338.png",
  1228: "http://cdn.weatherapi.com/weather/64x64/day/341.png",
  1231: "http://cdn.weatherapi.com/weather/64x64/day/344.png",
  1234: "http://cdn.weatherapi.com/weather/64x64/day/347.png",
  1237: "http://cdn.weatherapi.com/weather/64x64/day/350.png",
  1240: "http://cdn.weatherapi.com/weather/64x64/day/353.png",
  1243: "http://cdn.weatherapi.com/weather/64x64/day/356.png",
  1246: "http://cdn.weatherapi.com/weather/64x64/day/359.png",
  1249: "http://cdn.weatherapi.com/weather/64x64/day/362.png",
  1252: "http://cdn.weatherapi.com/weather/64x64/day/365.png",
  1255: "http://cdn.weatherapi.com/weather/64x64/day/368.png",
  1258: "http://cdn.weatherapi.com/weather/64x64/day/371.png",
  1261: "http://cdn.weatherapi.com/weather/64x64/day/374.png",
  1264: "http://cdn.weatherapi.com/weather/64x64/day/377.png",
  1267: "http://cdn.weatherapi.com/weather/64x64/day/380.png",
  1270: "http://cdn.weatherapi.com/weather/64x64/day/383.png",
  1273: "http://cdn.weatherapi.com/weather/64x64/day/386.png",
  1276: "http://cdn.weatherapi.com/weather/64x64/day/389.png",
  1279: "http://cdn.weatherapi.com/weather/64x64/day/392.png",
  1282: "http://cdn.weatherapi.com/weather/64x64/day/395.png",
}

const translations = {
  pl: {
    appName: "apka dla droniarzy",
    tabbleTitle: "Sprawdź warunki pogodowe",
    inputPlaceholder: "Wpisz nazwę miasta...",
    weatherConditions: "bezpieczne warunki",
    cloudCoverage: "Zachmurzenie:",
    visibility: "Widoczność:",
    windSpeed: "Prędkość wiatru:",
    windDegre: "Kierunek wiatru:",
    windGusts: "Porywy wiatru:",
    humidity: "Wilgotność:",
    windDirection: "Kierunek wiatru:",
    uvIndex: "Indeks UV:",
    selectLanguage: "Wybierz język",
    weatherSafe: "bezpieczne warunki",
    weatherCaution: "umiarkowane warunki",
    weatherUnsafe: "niebezpieczne warunki",
  },
  en: {
    appName: "drone app",
    tabbleTitle: "Check weather conditions",
    inputPlaceholder: "Enter city name...",
    weatherConditions: "safe conditions",
    cloudCoverage: "Cloud coverage:",
    visibility: "Visibility:",
    windSpeed: "Wind speed:",
    windGusts: "Wind gusts:",
    windDegre: "Wind degree",
    windDirection: "Wind direction",
    humidity: "Humidity:",
    uvIndex: "UV Index:",
    selectLanguage: "Select language",
    weatherSafe: "safe conditions",
    weatherCaution: "moderate conditions",
    weatherUnsafe: "unsafe conditions",
  },
}

const changeLanguage = (lang) => {
  document.querySelector('.title-one').textContent = translations[lang].tabbleTitle
  document.querySelector('.logo h1').textContent = translations[lang].appName
  document.querySelector('.input-weather').placeholder = translations[lang].inputPlaceholder
  document.querySelector('.language-selector').textContent = translations[lang].selectLanguage
  document.querySelector('.c-lang').textContent = translations[lang].cloudCoverage
  document.querySelector('.v-lang').textContent = translations[lang].visibility
  document.querySelector('.s-lang').textContent = translations[lang].windSpeed
  document.querySelector('.d-lang').textContent = translations[lang].windDirection
  document.querySelector('.deg-lang').textContent = translations[lang].windDegre
}


const removeAccents = (str) =>
  str.replace(
    /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
    (char) => "acelnoszzACELNOSZZ"["ąćęłńóśźżĄĆĘŁŃÓŚŹŻ".indexOf(char)]
  );
const updateWeatherIcon = (code) => {
  const url = weatherIcons[code];
  url
    ? photo.setAttribute("src", url)
    : photo.setAttribute("src", "./img/unknown.png");
};



const fetchWeather = (city, lang = 'pl') => {
  const URL = `${API_LINK}${API_KEY}&q=${removeAccents(city)}&lang=${lang}`
  return fetch(URL).then((response) => {
    if (!response.ok) {
      throw new Error("Error")
    }
    return response.json()
  });
};
const weatherSafetyMap = {
    safe: [1000, 1003],
    caution: [1006, 1009, 1030, 1063, 1066, 1069, 1072, 1150, 1153, 1168, 1180, 1183, 1186, 1189, 1204, 1210, 1213, 1216, 1219, 1240, 1249, 1255],
    unsafe: [1087, 1114, 1117, 1135, 1147, 1171, 1192, 1195, 1198, 1201, 1207, 1222, 1225, 1237, 1243, 1246, 1252, 1258, 1261, 1264, 1273, 1276, 1279, 1282]
}

const checkWeatherSafety = (code, lang) => {
    if (weatherSafetyMap.safe.includes(code)) 
        {
            weatherCondition.textContent = translations[lang].weatherSafe
            weatherCondition.style.color = "green"
        }
    if (weatherSafetyMap.caution.includes(code)) { 
        weatherCondition.textContent = 'umiarkowane warunki'
        weatherCondition.style.color = "orange"

    }
    if (weatherSafetyMap.unsafe.includes(code)) 
        {
            weatherCondition.textContent = 'niebezpieczne warunki'
            weatherCondition.style.color = "red"
        }
};

const checkCloud = (data) => {
  const updateCloud = `${data.current.cloud}`;
  if (updateCloud <= 20) {
    cloudCondition.textContent = `${data.current.cloud}% - bezpieczne warunki`
    cloudCondition.style.color = "green"
  } else if (updateCloud > 20 && updateCloud <= 50) {
    cloudCondition.textContent = `${data.current.cloud}% - umiarkowane warunki`
    cloudCondition.style.color = "orange"
  } else {
    cloudCondition.textContent = `${data.current.cloud}% - niebezpieczne warunki`
    cloudCondition.style.color = "red"
  }
}
const checkVisibility = (data) => {
  const updateVis = `${data.current.vis_km}`
  console.log(updateVis)
  if (updateVis >= 5) {
    visCondition.textContent = `${updateVis} km - bezpieczne warunki`
    visCondition.style.color = "green"
  } else if (updateVis > 1 && updateVis < 5) {
    visCondition.textContent = `${updateVis} km- umiarkowane warunki`
    visCondition.style.color = "orange"
  } else {
    visCondition.textContent = `${updateVis} km- niebezpieczne warunki`
    visCondition.style.color = "red"
  }
};
const checkSpeed = (data) => {
  const updateSpeed = `${Math.floor(data.current.wind_kph)}`

  if (updateSpeed <= 15) {
    speedCondition.textContent = `${updateSpeed} km/h - bezpieczne warunki`
    speedCondition.style.color = "green"
  } else if (updateSpeed > 15 && updateSpeed <= 30) {
    speedCondition.textContent = `${updateSpeed} km/h- umiarkowane warunki`
    speedCondition.style.color = "orange"
  } else {
    speedCondition.textContent = `${updateSpeed} km/h- niebezpieczne warunki`
    speedCondition.style.color = "red"
  }
};

const checkGust = (data) => {
  const updateGust = `${data.current.gust_kph}`;

  if (updateGust < 20) {
    gustCondition.textContent = `${updateGust} km/h - bezpieczne warunki`;
    gustCondition.style.color = "green";
  } else if (updateGust >= 20 && updateGust <= 40) {
    gustCondition.textContent = `${updateGust} km/h- umiarkowane warunki`;
    gustCondition.style.color = "orange";
  } else {
    gustCondition.textContent = `${updateGust} km/h- niebezpieczne warunki`;
    gustCondition.style.color = "red";
  }
};
const checkHum = (data) => {
  const updateHum = `${data.current.humidity}`

  if (updateHum <= 50) {
    humCondition.textContent = `${updateHum} % - bezpieczne warunki`;
    humCondition.style.color = "green";
  } else if (updateHum > 50 && updateHum <= 70) {
    humCondition.textContent = `${updateHum} %- umiarkowane warunki`;
    humCondition.style.color = "orange";
  } else {
    humCondition.textContent = `${updateHum} %- niebezpieczne warunki`;
    humCondition.style.color = "red";
  }
};
const checkUv = (data) => {
  const updateUv = data.current.uv;

  if (updateUv < 5) {
    uvCondition.textContent = `${updateUv}  - bezpieczne warunki`;
    uvCondition.style.color = "green";
  } else if (updateUv >= 6 && updateUv < 11) {
    uvCondition.textContent = `${updateUv} - umiarkowane warunki`;
    uvCondition.style.color = "orange";
  } else {
    uvCondition.textContent = `${updateUv} - niebezpieczne warunki`;
    uvCondition.style.color = "red";
  }
};

const updateNextWeather = (data) => {
  const currentTime = data.location.localtime.split(" ")[1].split(":");
  const currentHour = parseInt(currentTime[0], 10);

  const hourData = data.forecast.forecastday[0].hour;
  const startIndex = hourData.findIndex(
    (hour) =>
      parseInt(hour.time.split(" ")[1].split(":")[0], 10) === currentHour
  );

  for (let i = 0; i < 6; i++) {
    const index = (startIndex + i + 1) % 24;

    const cityHour = document.querySelector(`.city-hour${i}`);
    if (cityHour) {
      const timeOnly = hourData[index].time.split(" ")[1];
      cityHour.textContent = timeOnly;
    }

    const cityWeather = document.querySelector(`.photo${i}`);
    if (cityWeather) {
      const weatherCode = hourData[index].condition.code;
      const weatherIconUrl = weatherIcons[weatherCode];
      weatherIconUrl
        ? cityWeather.setAttribute("src", weatherIconUrl)
        : cityWeather.setAttribute("src", "./img/unknown.png");
    }

    const cityTemp = document.querySelector(`.city-temp${i}`);
    if (cityTemp) {
      const tempData = hourData[index].temp_c;
      cityTemp.textContent = `${Math.floor(tempData)} ℃`;
    }
  }
};

const updateWeatherInfo = (data, lang = 'pl') => {
  const locationName = data.location.name;
  cityName.textContent = locationName;

  const updateWeath = data.current.condition.text;
  weather.textContent = updateWeath;

  const updateTemp = `${Math.floor(data.current.temp_c)} ℃`;
  temperature.textContent = updateTemp;

  const fahr = (data.current.temp_c * 1.8 + 32).toFixed(0);
  temperature.dataset.fahrenheit = fahr;
  const temp = `${Math.floor(data.current.temp_c)} ℃`;
  temperature.dataset.celsious = temp;

  const updateHum = `${data.current.humidity}%`;
  humidity.textContent = updateHum;

  const updateTime = data.location.localtime;
  localTime.textContent = updateTime;

  const updateWind = `${Math.floor(data.current.wind_kph)} km/h`;
  wind.textContent = updateWind;

  const updateCloud = `${data.current.cloud}%`;
  cloud.textContent = updateCloud;

  const updateGust = `${Math.floor(data.current.gust_kph)} km/h`;
  gust.textContent = updateGust;

  const updateDir = data.current.wind_dir;
  windDir.textContent = updateDir;

  const updateDeg = `${data.current.wind_degree} °`;
  windDegree.textContent = updateDeg;

  const updateUv = data.current.uv;
  uv.textContent = updateUv;

  const updateVis = `${data.current.vis_km} km`;
  vis.textContent = updateVis;
  const code = data.current.condition.code;

  updateWeatherIcon(code)
  updateNextWeather(data, lang)
  checkWeatherSafety(code, lang)
  checkCloud(data, lang);
  checkVisibility(data, lang);
  checkSpeed(data, lang);
  checkGust(data, lang);
  checkHum(data, lang);
  checkUv(data, lang);
  console.log(data);
};

const defaultWeather = () => {
  const defaultCity = "Warszawa";
  fetchWeather(defaultCity)
    .then(updateWeatherInfo)
    .catch((err) => console.error(err));
};

const getWeather = () => {
  const city = input.value.trim();
  const lang = currentLanguage;
  if (city) {
    fetchWeather(city, lang)
      .then(updateWeatherInfo)
      .catch(() => {
        warning.textContent = translations[lang].warning;
      });
  } else {
    warning.textContent = translations[lang].warning;
  }
};

const handleEnterKey = (e) => {
  if (e.key === "Enter") {
    getWeather();
  }
};

const changeTemp = document.querySelector("#temp-toggle");
const sliderOne = document.querySelector(".slider");
const celToFhr = () => {
  sliderOne.classList.toggle("toright");
  if (sliderOne.classList.contains("toright")) {
    temperature.textContent = `${temperature.dataset.fahrenheit} ℉`;
  } else {
    temperature.textContent = `${temperature.dataset.celsious}`;
  }
};

changeTemp.addEventListener("change", celToFhr);
input.addEventListener("keyup", handleEnterKey);
document.addEventListener("DOMContentLoaded", defaultWeather);

document.querySelector('#pl-lang a').addEventListener('click', (e) => {
  e.preventDefault();
  changeLanguage('pl');
});
document.querySelector('#en-lang a').addEventListener('click', (e) => {
  e.preventDefault();
  changeLanguage('en');
});

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
const changeTemp = document.querySelector("#temp-toggle")
const sliderOne = document.querySelector(".temp-switch__slider")
let currentLanguage = 'pl'
let weatherTranslations = {};
let weatherData = {};

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


const loadWeatherData = () => {
    return fetch('./json/weatherData.json')
        .then(response => response.json())
        .then(data => {
            weatherData = data
            console.log(weatherData);
        })
        .catch(error => console.error('Error loading weather data:', error))
}
const loadWeatherTranslations = () => {
    return fetch('./json/weatherTranslations.json')
        .then(response => response.json())
        .then(data => {
            weatherTranslations = data;
        })
        .catch(error => console.error('Error loading weather data:', error));
}
const changeLanguagev2 = (lang = currentLanguage) => {
    const translateList = document.querySelectorAll('.translate')
    translateList.forEach((element) => {
        const translateKey = element.dataset.translate
        if (translateList) element.textContent = weatherTranslations.translations[lang][translateKey]
        const translatePlaceholderKey = element.dataset.placeholder
        if (translatePlaceholderKey) element.placeholder = weatherTranslations.translations[lang][translatePlaceholderKey]
    })
}
const getTranslation = (key, lang) => {
    return weatherTranslations.translations[lang][key] || weatherTranslations.translations['pl'][key];
}
const removeAccents = (str) =>
    str.replace(
        /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
        (char) => "acelnoszzACELNOSZZ" ["ąćęłńóśźżĄĆĘŁŃÓŚŹŻ".indexOf(char)]
    )
const updateWeatherIcon = (code) => {
    const url = weatherData.weatherIcons[code];
    url
        ?
        photo.setAttribute("src", url) :
        photo.setAttribute("src", "./img/unknown.png")
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
    if (weatherData.weatherSafetyMap.safe.includes(code)) {
        weatherCondition.textContent = weatherTranslations.translations[lang].weatherSafe
        weatherCondition.style.color = "green"
    }
    if (weatherData.weatherSafetyMap.caution.includes(code)) {
        weatherCondition.textContent = weatherTranslations.translations[lang].weatherCaution
        weatherCondition.style.color = "orange"
        
    }
    if (weatherData.weatherSafetyMap.unsafe.includes(code)) {
        weatherCondition.textContent = weatherTranslations.translations[lang].weatherUnsafe
        weatherCondition.style.color = "red"
    }
}
const checkCloud = (data, lang) => {
    
    const updateCloud = data.current.cloud
    const {
        safe,
        caution,
        unsafe
    } = weatherData.conditions.Cloud;
    let condition
    if (updateCloud >= safe.threshold && updateCloud < caution.threshold) condition = safe
    else if (updateCloud >= caution.threshold && updateCloud < unsafe.threshold) condition = caution
    else condition = unsafe
    let message = getTranslation(condition.key, lang)
    cloudCondition.textContent = `${updateCloud} % - ${message}`
    cloudCondition.style.color = condition.color;
}

const checkVisibility = (data, lang) => {
    const updateVis = data.current.vis_km;
    const {
        safe,
        caution,
        unsafe
    } = weatherData.conditions.visibility;
    let condition
    if (updateVis >= safe.threshold) condition = safe
    else if (updateVis >= caution.threshold && updateVis < safe.threshold) condition = caution
    else condition = unsafe
    let message = getTranslation(condition.key, lang)
    
    visCondition.textContent = `${updateVis} km - ${message}`
    visCondition.style.color = condition.color
}

const checkSpeed = (data, lang) => {
    const updateSpeed = Math.floor(data.current.wind_kph)
    const {
        safe,
        caution,
        unsafe
    } = weatherData.conditions.Speed
    let condition
    if (updateSpeed >= safe.threshold && updateSpeed < caution.threshold) condition = safe
    else if (updateSpeed >= caution.threshold && updateSpeed < unsafe.threshold) condition = caution
    else condition = unsafe
    let message = getTranslation(condition.key, lang)
    
    speedCondition.textContent = `${updateSpeed} km/h - ${message}`
    speedCondition.style.color = condition.color
}

const checkGust = (data, lang) => {
    const updateGust = Math.floor(data.current.gust_kph)
    const {
        safe,
        caution,
        unsafe
    } = weatherData.conditions.Gust
    let condition
    if (updateGust >= safe.threshold && updateGust < caution.threshold) condition = safe
    else if (updateGust >= caution.threshold && updateGust < unsafe.threshold) condition = caution
    else condition = unsafe
    
    let message = getTranslation(condition.key, lang)
    gustCondition.textContent = `${updateGust} km/h - ${message}`
    gustCondition.style.color = condition.color
    
}
const checkHum = (data, lang) => {
    const updateHum = data.current.humidity
    const {
        safe,
        caution,
        unsafe
    } = weatherData.conditions.Humidity
    let condition
    if (updateHum >= safe.threshold && updateHum < caution.threshold) condition = safe
    else if (updateHum >= caution.threshold && updateHum < unsafe.threshold) condition = caution
    else condition = unsafe
    let message = getTranslation(condition.key, lang)
    humCondition.textContent = `${updateHum} % - ${message}`
    humCondition.style.color = condition.color
};
const checkUv = (data, lang) => {
    const updateUv = data.current.uv
    const {
        safe,
        caution,
        unsafe
    } = weatherData.conditions.Uv
    let condition
    if (updateUv >= safe.threshold && updateUv < caution.threshold) condition = safe
    else if (updateUv >= caution.threshold && updateUv < unsafe.threshold) condition = caution
    else condition = unsafe
    let message = getTranslation(condition.key, lang)
    uvCondition.textContent = `${updateUv} - ${message}`
    uvCondition.style.color = condition.color
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
                ?
                cityWeather.setAttribute("src", weatherIconUrl) :
                cityWeather.setAttribute("src", "./img/unknown.png")
        }
        
        const cityTemp = document.querySelector(`.weather-data__temperature${i}`)
        if (cityTemp) {
            const tempData = hourData[index].temp_c
            cityTemp.textContent = `${Math.floor(tempData)} ℃`
        }
    }
}

const updateWeatherInfo = (data, lang = currentLanguage) => {
    cityName.textContent = data.location.name
    weather.textContent = data.current.condition.text
    temperature.textContent = `${Math.floor(data.current.temp_c)} ℃`
    temperature.dataset.fahrenheit = (data.current.temp_c * 1.8 + 32).toFixed(0)
    temperature.dataset.celsious = `${Math.floor(data.current.temp_c)} ℃`
    humidity.textContent = `${data.current.humidity}%`
    localTime.textContent = data.location.localtime
    wind.textContent = `${Math.floor(data.current.wind_kph)} km/h`
    cloud.textContent = `${data.current.cloud}%`
    gust.textContent = `${Math.floor(data.current.gust_kph)} km/h`
    windDir.textContent = data.current.wind_dir
    windDegree.textContent = `${data.current.wind_degree} °`
    uv.textContent = data.current.uv
    vis.textContent = `${data.current.vis_km} km`
    const code = data.current.condition.code
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
        .then(changeLanguagev2)
        .catch((err) => console.error(err));
}
const getWeather = () => {
    const city = input.value.trim();
    const lang = currentLanguage;
    const defaultCity = 'Warszawa';
    const selectedCity = city || defaultCity;
    setCookie("city", city, 1);
    fetchWeather(selectedCity, lang)
        .then(updateWeatherInfo)
        .catch(() => {
            warning.textContent = weatherTranslations.translations[lang].warning;
        });
}
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
    
    firstElementObserver.observe(olcardsElements[0])
});
document.querySelector('.nav__menu-toggle').addEventListener('click', () => {
    document.querySelector('.nav__menu-toggle').classList.toggle('closeMenu')
    document.querySelector('ul').classList.toggle('showMenu')
})

changeTemp.addEventListener("change", celToFhr)
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault()
});

input.addEventListener('keydown', function(e) {
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
    changeLanguagev2(lang)
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
        })
}
initializeWeatherApp()
document.addEventListener("DOMContentLoaded", defaultWeather)
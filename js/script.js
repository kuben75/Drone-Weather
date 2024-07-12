const input = document.querySelector('.input-weather')
const cityName = document.querySelector('.city-name')
const localTime = document.querySelector('.local-time')
const warning = document.querySelector('.warning')
const photo = document.querySelector('.photo')
const weather = document.querySelector('.weather')
const temperature = document.querySelector('.temperature')
const humidity = document.querySelector('.humidity')
const wind = document.querySelector('.wind')
const cloud = document.querySelector('.cloud')
const gust = document.querySelector('.gust')
const windDir = document.querySelector(".wind-direction")
const windDegree = document.querySelector(".wind-degree")
const uv = document.querySelector(".uv")
const vis = document.querySelector(".visibility")



const API_LINK = 'https://api.weatherapi.com/v1/forecast.json?key='
const API_KEY = 'c47ad91c29a24a908a9115318240207'
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
    1282: "http://cdn.weatherapi.com/weather/64x64/day/395.png" 
 }

const removeAccents = (str) =>
    str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, char =>
      'acelnoszzACELNOSZZ'['ąćęłńóśźżĄĆĘŁŃÓŚŹŻ'.indexOf(char)]
    )
    const updateWeatherIcon = (code) => {
        const url = weatherIcons[code];
        url ? photo.setAttribute('src', url) : photo.setAttribute('src', './img/unknown.png')
    }
    
    const fetchWeather = (city) => {
        const URL = `${API_LINK}${API_KEY}&q=${removeAccents(city)}`
        return fetch(URL)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error')
                }
                return response.json()
            });
    };
    
    const updateNextWeather = (data) => {
        const currentTime = data.location.localtime.split(' ')[1].split(':')
        const currentHour = parseInt(currentTime[0], 10)
    
        const hourData = data.forecast.forecastday[0].hour
        const startIndex = hourData.findIndex(hour => parseInt(hour.time.split(' ')[1].split(':')[0], 10) === currentHour)
    
        for (let i = 0; i < 6; i++) {
            const index = (startIndex + i + 1) % 24
    
            const cityHour = document.querySelector(`.city-hour${i}`)
            if (cityHour) {
                const timeOnly = hourData[index].time.split(' ')[1]
                cityHour.textContent = timeOnly
            }
    
            const cityWeather = document.querySelector(`.photo${i}`)
            if (cityWeather) {
                const weatherCode = hourData[index].condition.code
                const weatherIconUrl = weatherIcons[weatherCode]
               weatherIconUrl ? cityWeather.setAttribute('src', weatherIconUrl) : cityWeather.setAttribute('src', './img/unknown.png')
            }

            const cityTemp = document.querySelector(`.city-temp${i}`)
            if (cityTemp){
                const tempData = hourData[index].temp_c 
                cityTemp.textContent = `${Math.floor(tempData)} ℃`

            }
        }
    }
    
    const updateWeatherInfo = (data) => {
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
        uv.textContent = data.current.uv;
        vis.textContent = `${data.current.vis_km} km`
        const code = data.current.condition.code
        updateWeatherIcon(code)
        updateNextWeather(data)
        console.log(data)
    };

    const checkParametres = (data) => {
        
    }

  

const defaultWeather = () => {
    const defaultCity = 'Warszawa'
    fetchWeather(defaultCity)
        .then(updateWeatherInfo)
        .catch(err => console.error(err))
};

const getWeather = () => {
    const city = input.value.trim()  
    if (city) {
        fetchWeather(city)
            .then(updateWeatherInfo)
            .catch(() => {
                warning.textContent = 'Wpisz poprawną nazwę miasta'
            });
    } else {
        warning.textContent = 'Pole nie może być puste'
    }
};

const handleEnterKey = (e) => {
    if (e.key === 'Enter') {
        getWeather();
    }
};


const changeTemp = document.querySelector('#temp-toggle')
const sliderOne = document.querySelector('.slider')
const celToFhr = () => {
    sliderOne.classList.toggle('toright')
    if (sliderOne.classList.contains('toright')) {
        temperature.textContent = `${temperature.dataset.fahrenheit} ℉`
    } else {
        temperature.textContent = `${temperature.dataset.celsious}`
    }
}

changeTemp.addEventListener('change', celToFhr)
input.addEventListener('keyup', handleEnterKey)
document.addEventListener('DOMContentLoaded', defaultWeather)

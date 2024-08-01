import { weatherData } from "./api.js"
import { currentLanguage } from "./main.js"
import { checkWeatherSafety, checkCloud, checkVisibility, checkSpeed, checkGust, checkHum, checkUv } from "./conditions.js"
export const updateWeatherIcon = (code) => {
    const url = weatherData.weatherIcons[code]
    const photo = document.querySelector(".main-content__middle-photo")
    url ? photo.setAttribute("src", url) : photo.setAttribute("src", "./img/unknown.png")
}
export const updateNextWeather = (data) => {
    const currentTime = data.location.localtime.split(" ")[1].split(":")
    const currentHour = parseInt(currentTime[0], 10)
    const hourData = data.forecast.forecastday[0].hour
    const startIndex = hourData.findIndex((hour) =>
        parseInt(hour.time.split(" ")[1].split(":")[0], 10) === currentHour
    )
    
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
            weatherIconUrl ? cityWeather.setAttribute("src", weatherIconUrl) : cityWeather.setAttribute("src", "./img/unknown.png")
        }
        const cityTemp = document.querySelector(`.weather-data__temperature${i}`)
        if (cityTemp) {
            const tempData = hourData[index].temp_c
            cityTemp.textContent = `${Math.floor(tempData)} ℃`
        }
    }
}
export const updateWeatherInfo = (data, lang = currentLanguage) => {
    const cityName = document.querySelector(".main-content__top-city-name")
    cityName.textContent = data.location.name
    const weather = document.querySelector(".weather-info__weather")
    weather.textContent = data.current.condition.text
    const temperature = document.querySelector(".main-content__temperature")
    temperature.textContent = `${Math.floor(data.current.temp_c)} ℃`
    temperature.fahrenheit = (data.current.temp_c * 1.8 + 32).toFixed(0)
    temperature.celsious = `${Math.floor(data.current.temp_c)} ℃`
    const humidity = document.querySelector(".weather-info__humidity")
    humidity.textContent = `${data.current.humidity}%`
    const localTime = document.querySelector(".main-content__local-time")
    localTime.textContent = data.location.localtime
    const wind = document.querySelector(".weather-info__wind")
    wind.textContent = `${Math.floor(data.current.wind_kph)} km/h`
    const cloud = document.querySelector(".weather-info__cloud")
    const gust = document.querySelector(".weather-info__gust")
    cloud.textContent = `${data.current.cloud}%`
    gust.textContent = `${Math.floor(data.current.gust_kph)} km/h`
    const windDir = document.querySelector(".weather-info__wind-direction")
    windDir.textContent = data.current.wind_dir
    const windDegree = document.querySelector(".weather-info__wind-degree")
    windDegree.textContent = `${data.current.wind_degree} °`
    const uv = document.querySelector(".weather-info__uv")
    uv.textContent = data.current.uv
    const vis = document.querySelector(".weather-info__visibility")
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
  }
"use strict";
import { currentLanguage } from "./main.js"
import { removeAccents } from "./utils.js"
import { map } from "./map.js"
import { addCircles } from "./circleConfig.js"
import { info } from "./map_config.js"

const API_LINK = "https://api.weatherapi.com/v1/forecast.json?key="
const API_KEY = "c47ad91c29a24a908a9115318240207"
export let weatherTranslations = {}
export let weatherData = {}
export let zoneData = {circleData: [] }
export let isLoggedUser
export const fetchWeather = (city, lang = currentLanguage) => {
    const URL = `${API_LINK}${API_KEY}&q=${removeAccents(city)}&lang=${lang}`
    return fetch(URL).then((response) => {
        if (!response.ok) {
            throw new Error("Error")
        }
        return response.json()
    })
}
export const loadWeatherData = () => {
    return fetch('./json/weatherData.json')
        .then(response => response.json())
        .then(data => {
            weatherData = data
        })
        .catch(error => console.error('Error', error))
}
export const loadWeatherTranslations = () => {
    return fetch('./json/weatherTranslations.json')
        .then(response => response.json())
        .then(data => {
            weatherTranslations = data
        })
        .catch(error => console.error('Error', error))
}
export const loadZoneData = () => {
    return Promise.all([
        fetch('./php/db/getCircles.php').then(response => response.json()),
        fetch('./php/db/getUserCircles.php').then(response => {
            if(response.ok) return response.json();
            else return null
        }).catch(() => null)
    ]).then(([circleData, userCircleData]) => {
        zoneData = {
            circleData: circleData.circleData || [],
            userCircleData: userCircleData?.userCircleData || [],
            otherCircleData: userCircleData?.otherCircleData || []
        }
        console.log(zoneData)
        addCircles(map);
        info.update()
    }).catch(error => console.error('Błąd ładowania danych z zoneData', error))
}

export const getVariable = () => {
    fetch('./php/check_register.php')
    .then(response => response.json())
    .then(isLoggedIn => {
        isLoggedUser =  isLoggedIn
    }).catch(error => console.log(error))
}
export function searchCity() {
    const cityParam = document.getElementById('cityId').value.trim()
    if (cityParam) {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityParam)}&format=json&limit=1`
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const lat = parseFloat(data[0].lat)
                    const lon = parseFloat(data[0].lon)
                    map.setView([lat, lon], 13)
                }
                else {
                    console.log('Miasto nie zostało znalezione')
                }
            })
            .catch(error => {
                console.error('Błąd:', error)
            })
    }
}


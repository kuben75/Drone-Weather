"use strict";
import { currentLanguage } from "./main.js"
import { removeAccents } from "./utils.js";
import { map } from "./map.js";
import { addCircles } from "./circleConfig.js";
const API_LINK = "https://api.weatherapi.com/v1/forecast.json?key="
const API_KEY = "c47ad91c29a24a908a9115318240207"
export let weatherTranslations = {}
export let weatherData = {}
export let zoneData = []

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
        .catch(error => console.error('Error loading weather data:', error))
}
export const loadWeatherTranslations = () => {
    return fetch('./json/weatherTranslations.json')
        .then(response => response.json())
        .then(data => {
            weatherTranslations = data
        })
        .catch(error => console.error('Error loading weather data:', error))
}
export const loadZoneData = () => {
    return fetch('./json/zoneData.json')
        .then(response => response.json())
        .then(data => {
            zoneData = data
            const styleOne = {
                color: "blue",
                weight: 5,
                opacity: 0.65
            }
            L.geoJSON(zoneData.myLines, {
                style: styleOne
            }).addTo(map)
            addCircles(map)
        })
        .catch(error => console.error('Błąd ładowania w zoneData', error))
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
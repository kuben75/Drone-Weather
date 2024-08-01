"use strict";

import {fetchWeather, weatherTranslations, loadWeatherData, loadWeatherTranslations} from "./api.js";
import {setCookie, getCookie, changeMenu, celToFhr, animateContent} from "./utils.js";
import {changeLanguagev2} from "./translations.js";
import {updateWeatherInfo} from "./weather.js";
export let currentLanguage = 'pl'
const input = document.querySelector(".main-info__input-container-text")

const fetchDefaultWeather = (city) => {
    fetchWeather(city)
        .then(updateWeatherInfo)
        .then(changeLanguagev2)
        .catch(err => console.error(err));
};

const defaultWeather = () => {
    const defaultCity = getCookie("city") || "Warszawa";
    fetchDefaultWeather(defaultCity);
}
const nextWeatherRequest = () => {
    const city = input.value.trim() || "Warszawa"
	const lang = currentLanguage
    setCookie("city", city, 1)
	fetchWeather(city, lang)
		.then(updateWeatherInfo)
		.catch(() => {
			const warning = document.querySelector(".main-info__input-container-warning")
			warning.textContent = weatherTranslations.translations[lang].warning
		})
}

const onPressEnter = (e) => {
	if (e.key === 'Enter') {
		e.preventDefault()
		defaultWeather()
		nextWeatherRequest()
	}
}

function handleLanguageChange(e) {
	e.preventDefault()
	const lang = e.target.dataset.id
	currentLanguage = lang
	changeLanguagev2(lang)
	defaultWeather()
	nextWeatherRequest()
}
function setupListeners () {
    document.querySelector('form').addEventListener('submit', (e) => e.preventDefault())
    input.addEventListener('keydown', onPressEnter)
    document.querySelector("#temp-toggle").addEventListener("change", celToFhr)
    document.querySelectorAll('.nav__language-dropdown-item a').forEach(elem => { 
    elem.addEventListener('click', handleLanguageChange)
    })
    window.onload = () => {
        changeMenu()
        animateContent()
        loadWeatherData()
        loadWeatherTranslations()
        defaultWeather()
    }
}
setupListeners()
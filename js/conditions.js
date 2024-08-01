import { currentLanguage } from "./main.js"
import { weatherData, weatherTranslations } from "./api.js"
import { getTranslation } from "./translations.js"

export const checkWeatherSafety = (code, lang = currentLanguage) => {
    const weatherCondition = document.querySelector(`.table__weather-condition`)
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

export const checkCondition = (data, lang, selector, conditionType, unit, flag) => {
    const element = document.querySelector(selector)
    const updateValue = data.current[conditionType]
    const { safe, caution, unsafe } = weatherData.conditions[conditionType]
    let condition
    if (flag == !true){
        if (updateValue >= safe.threshold) condition = safe
        else if (updateValue >= caution.threshold && updateValue < safe.threshold) condition = caution
        else condition = unsafe
    }
    else {
        if (updateValue >= safe.threshold && updateValue < caution.threshold) condition = safe
        else if (updateValue >= caution.threshold && updateValue < unsafe.threshold) condition = caution
        else condition = unsafe
    }
    const message = getTranslation(condition.key, lang)
    element.textContent = `${updateValue.toFixed(0)} ${unit} - ${message}`
    element.style.color = condition.color
}
export const checkCloud = (data, lang) => {
    checkCondition(data, lang, '.table__cloud-cover', 'cloud', '%', true)
}
export const checkVisibility = (data, lang) => {
    checkCondition(data, lang, '.table__visibility', 'vis_km', 'km', false)
}
export const checkSpeed = (data, lang) => {
    checkCondition(data, lang, '.table__wind-speed', 'wind_kph', 'km/h', true)
}
export const checkGust = (data, lang) => {
    checkCondition(data, lang, '.table__wind-gusts', 'gust_kph', 'km/h', true)
}
export const checkHum = (data, lang) => {
    checkCondition(data, lang, '.table__humidity', 'humidity', '%', true)
}
export const checkUv = (data, lang) => {
    checkCondition(data, lang, '.table__uv-index', 'uv', '', true)
}
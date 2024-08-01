import { weatherTranslations } from "./api.js"
import { currentLanguage } from "./main.js"
export const changeLanguagev2 = (lang = currentLanguage) => {
    const translateList = document.querySelectorAll('.translate')
    translateList.forEach((element) => {
        const translateKey = element.dataset.translate
        if (translateList) element.textContent = weatherTranslations.translations[lang][translateKey]
        const translatePlaceholderKey = element.dataset.placeholder
        if (translatePlaceholderKey) element.placeholder = weatherTranslations.translations[lang][translatePlaceholderKey]
    })
}

export const getTranslation = (key, lang = currentLanguage) => {
    return weatherTranslations.translations[lang][key] || weatherTranslations.translations['pl'][key]
}
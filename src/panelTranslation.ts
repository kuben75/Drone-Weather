import { WeatherTranslations } from "./weather"

declare const userLanguage: string

class TranslationManager {
    public language: string
    private weatherTranslations: WeatherTranslations

    constructor() {
        this.language = (typeof userLanguage !== 'undefined' && userLanguage)
            ? userLanguage
            : (localStorage.getItem('language') || 'pl')

        this.weatherTranslations = { translations: {} } as WeatherTranslations

        document.addEventListener("DOMContentLoaded", async () => {
            await this.loadWeatherTranslations()
            this.changeLanguage(this.language)
            this.setupEventListeners()
        })
    }

    private async loadWeatherTranslations(): Promise<void> {
        try {
            const response = await fetch('./json/weatherTranslations.json')
            if (!response.ok) throw new Error("Nie udało się załadować tłumaczeń")
            this.weatherTranslations = await response.json()
        } catch (error) {
            console.error("Błąd ładowania tłumaczeń:", error)
        }
    }

    public changeLanguage(language: string): void {
        const translateList = document.querySelectorAll('.translate') as NodeListOf<HTMLElement>

        translateList.forEach((element: HTMLElement): void => {
            const key = element.dataset.translate
            const placeholderKey = element.dataset.placeholder

            const translation = this.weatherTranslations.translations[language] || {}
            const fallback = this.weatherTranslations.translations['pl'] || {}

            if (key) {
                element.textContent = translation[key] ?? fallback[key] ?? element.textContent
            }
            if (placeholderKey && element instanceof HTMLInputElement) {
                element.placeholder = translation[placeholderKey] ?? fallback[placeholderKey] ?? ''
            }
        })
    }

    private handleChangeLanguage(e: Event): void {
        e.preventDefault()
        const newLang: string = (e.currentTarget as HTMLElement).dataset.id ?? 'pl'
        this.language = newLang

        if (typeof userLanguage !== 'undefined') {
            localStorage.setItem('language', newLang)
            location.reload()
        } else {
            fetch('./php/db/update-language.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: newLang }),
            })
                .then(() => {
                    localStorage.setItem('language', newLang)
                    console.log("Język zapisany w bazie danych: " + newLang)
                    this.changeLanguage(newLang)
                })
                .catch(err => console.error("Błąd przy zapisie języka:", err))
        }

        this.changeLanguage(this.language)
    }

    private setupEventListeners(): void {
        const languageLinks = document.querySelectorAll(".nav__language-dropdown-item a")
        languageLinks.forEach((elem) =>
            elem.addEventListener("click", this.handleChangeLanguage.bind(this))
        )
    }
}

new TranslationManager()

interface WeatherData {
    weatherIcons: Record<string, string>
    weatherSafetyMap: {
        safe: number[]
        caution: number[]
        unsafe: number[]
    }
    conditions: {
        vis_km: ConditionThreshold;
        cloud: ConditionThreshold;
        wind_kph: ConditionThreshold;
        gust_kph: ConditionThreshold;
        humidity: ConditionThreshold;
        uv: ConditionThreshold;
    }
}
interface ConditionThreshold {
    safe: Condition
    caution: Condition
    unsafe: Condition
}
interface Condition {
    key: string
    color: string
    threshold: number
}
export interface WeatherTranslations {
    translations: {
        [language: string]: {
            [key: string]: string
        }
    }
}

interface WeatherApiResponse {
    location: {
        name: string
        localtime: string
    }
    current: {
        temp_c: number
        condition: {
            text: string
            icon: string
            code: number
        }
        humidity: number
        wind_kph: number
        cloud: number
        gust_kph: number
        wind_dir: string
        wind_degree: number
        uv: number
        vis_km: number
    }
    forecast: {
        forecastday: {
            hour: Hour[]
        }[]
    }
}
interface Hour {
    time: string
    temp_c: number
    condition: {
        code: number
    }
}
interface ConditionConfig {
    selector: string
    unit: string
    reverse: boolean
}

declare const userLanguage: string
class AppState {
    currentLanguage: string
    weatherData: WeatherData
    weatherTranslations: WeatherTranslations
    constructor() {
        this.currentLanguage = typeof userLanguage !== 'undefined'
            ? userLanguage
            : (localStorage.getItem('language') || 'pl')
        this.weatherData = {} as WeatherData
        this.weatherTranslations = {} as WeatherTranslations
    }
    setLanguage(lang: string): void {
        this.currentLanguage = lang
        localStorage.setItem('language', lang)
    }

    setWeatherData(data: WeatherData): void {
        this.weatherData = data
    }
    setWeatherTranslations(translations: WeatherTranslations): void {
        this.weatherTranslations = translations
    }
    getLanguage(): string {
        return this.currentLanguage;
    }
    getWeatherData(): WeatherData {
        return this.weatherData;
    }
    getWeatherTranslations(): WeatherTranslations {
        return this.weatherTranslations;
    }

}

class Helpers {
    static setCookie(cname: string, cvalue: string, exdays: number): void {
        const d = new Date()
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
        const expires = "expires=" + d.toUTCString()
        document.cookie = cname + "=" + cvalue + "" + expires + "path=/"
    }
    static getCookie(cname: string): string {
        const name = cname + "="
        const decodedCookie = decodeURIComponent(document.cookie)
        const ca = decodedCookie.split("")
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim()
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length)
            }
        }
        return ""
    }
    static removeAccents(str: string): string {
        return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => "acelnoszzACELNOSZZ"["ąćęłńóśźżĄĆĘŁŃÓŚŹŻ".indexOf(char)])
    }
}

class WeatherAPI {
    private static  API_LINK= "https://api.weatherapi.com/v1/forecast.json?key="
    private static API_KEY= "c47ad91c29a24a908a9115318240207"
    static async fetchWeather(city: string, appState: AppState): Promise<WeatherApiResponse>
    {
        const response: Response = await fetch(`${WeatherAPI.API_LINK}${WeatherAPI.API_KEY}&q=${Helpers.removeAccents(city)}&lang=${appState.getLanguage()}`)
        return response.json()
    }
    static async loadJson(url: string): Promise<any>
    {
        const response: Response = await fetch(url)
        return response.json()
    }
    static getTranslation(key: string, translations: WeatherTranslations, lang: string): string {
        return translations['translations'][lang]?.[key as any] || translations['translations']['pl']?.[key as any]
    }
}
class WeatherChecker {
    private static conditionConfig: Record<keyof WeatherData['conditions'], ConditionConfig> =  {
        cloud: { selector: '.table__cloud-cover', unit: '%', reverse: true },
        vis_km: { selector: '.table__visibility', unit: 'km', reverse: false },
        wind_kph: { selector: '.table__wind-speed', unit: 'km/h', reverse: true },
        gust_kph: { selector: '.table__wind-gusts', unit: 'km/h', reverse: true },
        humidity: { selector: '.table__humidity', unit: '%', reverse: true },
        uv: { selector: '.table__uv-index', unit: '', reverse: true }
    }
    static checkCondition(data: WeatherApiResponse, appState: AppState, conditionType: keyof WeatherData['conditions'] ) :void {
        const config = WeatherChecker.conditionConfig[conditionType]
        const element = document.querySelector<HTMLElement>(config.selector);
        const updateValue = data.current[conditionType];
        const { safe, caution, unsafe } = appState.getWeatherData().conditions[conditionType];
        let condition: Condition;

        if (config.reverse) {
            condition = updateValue >= safe.threshold && updateValue < caution.threshold ? safe : updateValue >= caution.threshold && updateValue < unsafe.threshold ? caution : unsafe
        } else {
            condition = updateValue >= safe.threshold ? safe : updateValue >= caution.threshold && updateValue < safe.threshold ? caution : unsafe
        }
        const message: string = WeatherAPI.getTranslation(condition.key, appState.getWeatherTranslations(), appState.getLanguage());
        if(element) {
            element.textContent = `${updateValue.toFixed(0)} ${config.unit} - ${message}`
            element.style.color = condition.color
        }
    }

    static checkWeatherSafety(code: number, appState: AppState ): void{
        const weatherCondition = document.querySelector<HTMLElement>(`.table__weather-condition`)
        const safetyLevels: {levels: number[], message: string, color: string}[] = [
            {levels: appState.getWeatherData().weatherSafetyMap.safe, message: WeatherAPI.getTranslation('weatherSafe', appState.getWeatherTranslations(), appState.getLanguage()), color: 'green'},
            {levels: appState.getWeatherData().weatherSafetyMap.caution, message: WeatherAPI.getTranslation('weatherCaution', appState.getWeatherTranslations(), appState.getLanguage()), color: 'orange'},
            {levels: appState.getWeatherData().weatherSafetyMap.unsafe, message: WeatherAPI.getTranslation('weatherUnsafe', appState.getWeatherTranslations(), appState.getLanguage()), color: 'red'}
        ]
        safetyLevels.forEach((arr: {levels: number[], message: string, color: string}): void => {
            if (arr.levels.includes(code) && weatherCondition) {
                weatherCondition.textContent = arr.message
                weatherCondition.style.color = arr.color
            }
        })
    }
    static checkWeatherConditions(data: WeatherApiResponse, appState: AppState): void {
        Object.keys(WeatherChecker.conditionConfig).forEach((element: string): void => {
            WeatherChecker.checkCondition(data, appState, element as keyof WeatherData['conditions'])
        })
    }
}

class UIUpdater {
    static updateWeatherInfo(data: WeatherApiResponse, appState: AppState): void {
        const weatherMappings: {selector: string, value: string, extra?: (el: HTMLElement) => void}[] = [
            {selector: ".main-content__top-city-name", value: data.location.name},
            {selector: ".weather-info__weather", value: data.current.condition.text},
            {selector: ".main-content__temperature", value: `${Math.floor(data.current.temp_c)} ℃`,
                extra: (el: HTMLElement): void => {
                    (el as any).fahrenheit = (data.current.temp_c * 1.8 + 32).toFixed(0);
                    (el as any).celsious = `${Math.floor(data.current.temp_c)} ℃`;}},
            {selector: ".weather-info__humidity", value: `${data.current.humidity}%`
            },
            {selector: ".main-content__local-time", value: data.location.localtime},
            {selector: ".weather-info__wind", value: `${Math.floor(data.current.wind_kph)} km/h`},
            {selector: ".weather-info__cloud", value: `${data.current.cloud}%`},
            {selector: ".weather-info__gust", value: `${Math.floor(data.current.gust_kph)} km/h`},
            {selector: ".weather-info__wind-direction", value: data.current.wind_dir},
            {selector: ".weather-info__wind-degree", value: `${data.current.wind_degree} °`},
            {selector: ".weather-info__uv", value: `${data.current.uv}`},
            {selector: ".weather-info__visibility", value: `${data.current.vis_km} km`}
        ];
        weatherMappings.forEach(({ selector, value, extra }): void => {
            const element  = document.querySelector<HTMLElement>(selector);
            if (element) {
                element.textContent = value;
                extra && extra(element)
            }
        })
        UIUpdater.updateWeatherIcon(data.current.condition.code, appState)
        UIUpdater.updateNextWeather(data, appState)
        WeatherChecker.checkWeatherSafety(data.current.condition.code, appState)
        WeatherChecker.checkWeatherConditions(data, appState)
    }
    static updateWeatherIcon(code: number, appState: AppState): void {
    const url= appState.getWeatherData().weatherIcons[code]
        const photo = document.querySelector<HTMLElement>(".main-content__middle-photo")
        photo ? photo.setAttribute("src", url ? url : "./img/unknown.png") : null
    }
    static updateNextWeather (data: WeatherApiResponse, appState: AppState): void{
        const localTime = data.location.localtime
        const hourlyForecast: Hour[] = data.forecast.forecastday[0].hour
        const currentHour: number = parseInt(localTime.split(" ")[1].split(":")[0], 10)
        const startIndex: number = hourlyForecast.findIndex((h) =>
            parseInt(h.time.split(" ")[1].split(":")[0], 10) === currentHour)
        const updateElement = (selector: string, content: string, attribute: string|null = null): void => {
            const element = document.querySelector<HTMLElement>(selector)
            element ? attribute ? element.setAttribute(attribute, content) : element.textContent = content : null
        }
            for (let i: number = 0; i < 6; i++) {
                const index = (startIndex + i + 1) % 24
                const {time, condition, temp_c} = hourlyForecast[index]
                const weatherIconUrl: string = appState.getWeatherData().weatherIcons[condition.code] || "./img/unknown.png"

                updateElement(`.weather-data__time${i}`, time.split(" ")[1])
                updateElement(`.weather-data__photo${i}`, weatherIconUrl, "src")
                updateElement(`.weather-data__temperature${i}`, `${Math.floor(temp_c)} ℃`)
            }

    }
    static changeLanguage(appState: AppState): void {
        const translateList = document.querySelectorAll('.translate') as NodeListOf<HTMLElement>
        translateList?.forEach((el: any) => {
            const translateKey= el.dataset.translate
            if (translateKey) el.textContent = appState.weatherTranslations.translations[appState.getLanguage()][translateKey] || appState.weatherTranslations.translations['pl'][translateKey]
            const translatePlaceholderKey = el.dataset.placeholder
            if (translatePlaceholderKey) el.placeholder = appState.weatherTranslations.translations[appState.getLanguage()][translatePlaceholderKey]
        })
    }
}

class WeatherApp {
    async defaultWeather(appState: AppState): Promise<void> {
        const city = Helpers.removeAccents(Helpers.getCookie("city") || "Warszawa").trim()
        const data: WeatherApiResponse = await WeatherAPI.fetchWeather(city, appState)
        UIUpdater.updateWeatherInfo(data, appState)
        UIUpdater.changeLanguage(appState)
    }
    async nextWeatherRequest(appState: AppState): Promise<void> {
        const input = document.querySelector<HTMLInputElement>(".main-info__input-container-text")
        const city = input?.value.trim() || "Warszawa"
        Helpers.setCookie("city", city, 1)
        try{
            const data: WeatherApiResponse = await WeatherAPI.fetchWeather(city, appState)
            UIUpdater.updateWeatherInfo(data, appState)
        }catch (e) {
            const warning = document.querySelector(".main-info__input-container-warning")
            warning ? warning.textContent = (appState.weatherTranslations.translations[appState.getLanguage()] as any).warning : null
        }
    }
    async handleChangeLanguage(e: Event, appState: AppState): Promise<void> {
        e.preventDefault()
        const lang = (e.target as HTMLInputElement ).dataset.id as string
        appState.setLanguage(lang || 'pl')
        UIUpdater.changeLanguage(appState)
        await this.defaultWeather(appState)
        await this.nextWeatherRequest(appState)
    }
}

class App {
    private weatherApp: WeatherApp
    private readonly appState: AppState
    constructor() {
        this.weatherApp = new WeatherApp()
        this.appState = new AppState()
    }
    async init(): Promise<void>{
    await this.loadData()
        await this.setupListeners()
        await this.weatherApp.defaultWeather(this.appState)
    }
    private async loadData(): Promise<void>{
    const [weatherData, weatherTranslations] = await Promise.all([
        WeatherAPI.loadJson("./json/weatherData.json"),
        WeatherAPI.loadJson("./json/weatherTranslations.json"),
    ])
    this.appState.setWeatherData(weatherData)
    this.appState.setWeatherTranslations(weatherTranslations)
    }
    private async setupListeners(){
    document.querySelector<HTMLFormElement>('form')?.addEventListener('submit', e => e.preventDefault())
        document.querySelector<HTMLInputElement>('.main-info__input-container-text')?.addEventListener('keydown', async (e)  => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    await this.weatherApp.defaultWeather(this.appState)
                    await this.weatherApp.nextWeatherRequest(this.appState)
                }
            })
    document.querySelectorAll<HTMLElement>('.nav__language-dropdown-item a').forEach((el: HTMLElement) => el.addEventListener('click', e => this.weatherApp.handleChangeLanguage(e, this.appState)))
    }
}

const app: App = new App()
app.init().catch((error) => console.error(error))



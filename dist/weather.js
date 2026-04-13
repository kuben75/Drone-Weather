var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class AppState {
    constructor() {
        this.currentLanguage = typeof userLanguage !== 'undefined'
            ? userLanguage
            : (localStorage.getItem('language') || 'pl');
        this.weatherData = {};
        this.weatherTranslations = {};
    }
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
    }
    setWeatherData(data) {
        this.weatherData = data;
    }
    setWeatherTranslations(translations) {
        this.weatherTranslations = translations;
    }
    getLanguage() {
        return this.currentLanguage;
    }
    getWeatherData() {
        return this.weatherData;
    }
    getWeatherTranslations() {
        return this.weatherTranslations;
    }
}
class Helpers {
    static setCookie(cname, cvalue, exdays) {
        const d = new Date();
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
        const expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + "" + expires + "path=/";
    }
    static getCookie(cname) {
        const name = cname + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split("");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
    static removeAccents(str) {
        return str.replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (char) => "acelnoszzACELNOSZZ"["ąćęłńóśźżĄĆĘŁŃÓŚŹŻ".indexOf(char)]);
    }
}
class WeatherAPI {
    static fetchWeather(city, appState) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(`${WeatherAPI.API_LINK}${WeatherAPI.API_KEY}&q=${Helpers.removeAccents(city)}&lang=${appState.getLanguage()}`);
            return response.json();
        });
    }
    static loadJson(url) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(url);
            return response.json();
        });
    }
    static getTranslation(key, translations, lang) {
        var _a, _b;
        return ((_a = translations['translations'][lang]) === null || _a === void 0 ? void 0 : _a[key]) || ((_b = translations['translations']['pl']) === null || _b === void 0 ? void 0 : _b[key]);
    }
}
WeatherAPI.API_LINK = "https://api.weatherapi.com/v1/forecast.json?key=";
WeatherAPI.API_KEY = "c47ad91c29a24a908a9115318240207";
class WeatherChecker {
    static checkCondition(data, appState, conditionType) {
        const config = WeatherChecker.conditionConfig[conditionType];
        const element = document.querySelector(config.selector);
        const updateValue = data.current[conditionType];
        const { safe, caution, unsafe } = appState.getWeatherData().conditions[conditionType];
        let condition;
        if (config.reverse) {
            condition = updateValue >= safe.threshold && updateValue < caution.threshold ? safe : updateValue >= caution.threshold && updateValue < unsafe.threshold ? caution : unsafe;
        }
        else {
            condition = updateValue >= safe.threshold ? safe : updateValue >= caution.threshold && updateValue < safe.threshold ? caution : unsafe;
        }
        const message = WeatherAPI.getTranslation(condition.key, appState.getWeatherTranslations(), appState.getLanguage());
        if (element) {
            element.textContent = `${updateValue.toFixed(0)} ${config.unit} - ${message}`;
            element.style.color = condition.color;
        }
    }
    static checkWeatherSafety(code, appState) {
        const weatherCondition = document.querySelector(`.table__weather-condition`);
        const safetyLevels = [
            { levels: appState.getWeatherData().weatherSafetyMap.safe, message: WeatherAPI.getTranslation('weatherSafe', appState.getWeatherTranslations(), appState.getLanguage()), color: 'green' },
            { levels: appState.getWeatherData().weatherSafetyMap.caution, message: WeatherAPI.getTranslation('weatherCaution', appState.getWeatherTranslations(), appState.getLanguage()), color: 'orange' },
            { levels: appState.getWeatherData().weatherSafetyMap.unsafe, message: WeatherAPI.getTranslation('weatherUnsafe', appState.getWeatherTranslations(), appState.getLanguage()), color: 'red' }
        ];
        safetyLevels.forEach((arr) => {
            if (arr.levels.includes(code) && weatherCondition) {
                weatherCondition.textContent = arr.message;
                weatherCondition.style.color = arr.color;
            }
        });
    }
    static checkWeatherConditions(data, appState) {
        Object.keys(WeatherChecker.conditionConfig).forEach((element) => {
            WeatherChecker.checkCondition(data, appState, element);
        });
    }
}
WeatherChecker.conditionConfig = {
    cloud: { selector: '.table__cloud-cover', unit: '%', reverse: true },
    vis_km: { selector: '.table__visibility', unit: 'km', reverse: false },
    wind_kph: { selector: '.table__wind-speed', unit: 'km/h', reverse: true },
    gust_kph: { selector: '.table__wind-gusts', unit: 'km/h', reverse: true },
    humidity: { selector: '.table__humidity', unit: '%', reverse: true },
    uv: { selector: '.table__uv-index', unit: '', reverse: true }
};
class UIUpdater {
    static updateWeatherInfo(data, appState) {
        const weatherMappings = [
            { selector: ".main-content__top-city-name", value: data.location.name },
            { selector: ".weather-info__weather", value: data.current.condition.text },
            { selector: ".main-content__temperature", value: `${Math.floor(data.current.temp_c)} ℃`,
                extra: (el) => {
                    el.fahrenheit = (data.current.temp_c * 1.8 + 32).toFixed(0);
                    el.celsious = `${Math.floor(data.current.temp_c)} ℃`;
                } },
            { selector: ".weather-info__humidity", value: `${data.current.humidity}%`
            },
            { selector: ".main-content__local-time", value: data.location.localtime },
            { selector: ".weather-info__wind", value: `${Math.floor(data.current.wind_kph)} km/h` },
            { selector: ".weather-info__cloud", value: `${data.current.cloud}%` },
            { selector: ".weather-info__gust", value: `${Math.floor(data.current.gust_kph)} km/h` },
            { selector: ".weather-info__wind-direction", value: data.current.wind_dir },
            { selector: ".weather-info__wind-degree", value: `${data.current.wind_degree} °` },
            { selector: ".weather-info__uv", value: `${data.current.uv}` },
            { selector: ".weather-info__visibility", value: `${data.current.vis_km} km` }
        ];
        weatherMappings.forEach(({ selector, value, extra }) => {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value;
                extra && extra(element);
            }
        });
        UIUpdater.updateWeatherIcon(data.current.condition.code, appState);
        UIUpdater.updateNextWeather(data, appState);
        WeatherChecker.checkWeatherSafety(data.current.condition.code, appState);
        WeatherChecker.checkWeatherConditions(data, appState);
    }
    static updateWeatherIcon(code, appState) {
        const url = appState.getWeatherData().weatherIcons[code];
        const photo = document.querySelector(".main-content__middle-photo");
        photo ? photo.setAttribute("src", url ? url : "./img/unknown.png") : null;
    }
    static updateNextWeather(data, appState) {
        const localTime = data.location.localtime;
        const hourlyForecast = data.forecast.forecastday[0].hour;
        const currentHour = parseInt(localTime.split(" ")[1].split(":")[0], 10);
        const startIndex = hourlyForecast.findIndex((h) => parseInt(h.time.split(" ")[1].split(":")[0], 10) === currentHour);
        const updateElement = (selector, content, attribute = null) => {
            const element = document.querySelector(selector);
            element ? attribute ? element.setAttribute(attribute, content) : element.textContent = content : null;
        };
        for (let i = 0; i < 6; i++) {
            const index = (startIndex + i + 1) % 24;
            const { time, condition, temp_c } = hourlyForecast[index];
            const weatherIconUrl = appState.getWeatherData().weatherIcons[condition.code] || "./img/unknown.png";
            updateElement(`.weather-data__time${i}`, time.split(" ")[1]);
            updateElement(`.weather-data__photo${i}`, weatherIconUrl, "src");
            updateElement(`.weather-data__temperature${i}`, `${Math.floor(temp_c)} ℃`);
        }
    }
    static changeLanguage(appState) {
        const translateList = document.querySelectorAll('.translate');
        translateList === null || translateList === void 0 ? void 0 : translateList.forEach((el) => {
            const translateKey = el.dataset.translate;
            if (translateKey)
                el.textContent = appState.weatherTranslations.translations[appState.getLanguage()][translateKey] || appState.weatherTranslations.translations['pl'][translateKey];
            const translatePlaceholderKey = el.dataset.placeholder;
            if (translatePlaceholderKey)
                el.placeholder = appState.weatherTranslations.translations[appState.getLanguage()][translatePlaceholderKey];
        });
    }
}
class WeatherApp {
    defaultWeather(appState) {
        return __awaiter(this, void 0, void 0, function* () {
            const city = Helpers.removeAccents(Helpers.getCookie("city") || "Warszawa").trim();
            const data = yield WeatherAPI.fetchWeather(city, appState);
            UIUpdater.updateWeatherInfo(data, appState);
            UIUpdater.changeLanguage(appState);
        });
    }
    nextWeatherRequest(appState) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = document.querySelector(".main-info__input-container-text");
            const city = (input === null || input === void 0 ? void 0 : input.value.trim()) || "Warszawa";
            Helpers.setCookie("city", city, 1);
            try {
                const data = yield WeatherAPI.fetchWeather(city, appState);
                UIUpdater.updateWeatherInfo(data, appState);
            }
            catch (e) {
                const warning = document.querySelector(".main-info__input-container-warning");
                warning ? warning.textContent = appState.weatherTranslations.translations[appState.getLanguage()].warning : null;
            }
        });
    }
    handleChangeLanguage(e, appState) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const lang = e.target.dataset.id;
            appState.setLanguage(lang || 'pl');
            UIUpdater.changeLanguage(appState);
            yield this.defaultWeather(appState);
            yield this.nextWeatherRequest(appState);
        });
    }
}
class App {
    constructor() {
        this.weatherApp = new WeatherApp();
        this.appState = new AppState();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadData();
            yield this.setupListeners();
            yield this.weatherApp.defaultWeather(this.appState);
        });
    }
    loadData() {
        return __awaiter(this, void 0, void 0, function* () {
            const [weatherData, weatherTranslations] = yield Promise.all([
                WeatherAPI.loadJson("./json/weatherData.json"),
                WeatherAPI.loadJson("./json/weatherTranslations.json"),
            ]);
            this.appState.setWeatherData(weatherData);
            this.appState.setWeatherTranslations(weatherTranslations);
        });
    }
    setupListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            (_a = document.querySelector('form')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', e => e.preventDefault());
            (_b = document.querySelector('.main-info__input-container-text')) === null || _b === void 0 ? void 0 : _b.addEventListener('keydown', (e) => __awaiter(this, void 0, void 0, function* () {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    yield this.weatherApp.defaultWeather(this.appState);
                    yield this.weatherApp.nextWeatherRequest(this.appState);
                }
            }));
            document.querySelectorAll('.nav__language-dropdown-item a').forEach((el) => el.addEventListener('click', e => this.weatherApp.handleChangeLanguage(e, this.appState)));
        });
    }
}
const app = new App();
app.init().catch((error) => console.error(error));
export {};

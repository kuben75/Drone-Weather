var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class TranslationManager {
    constructor() {
        this.language = (typeof userLanguage !== 'undefined' && userLanguage)
            ? userLanguage
            : (localStorage.getItem('language') || 'pl');
        this.weatherTranslations = { translations: {} };
        document.addEventListener("DOMContentLoaded", () => __awaiter(this, void 0, void 0, function* () {
            yield this.loadWeatherTranslations();
            this.changeLanguage(this.language);
            this.setupEventListeners();
        }));
    }
    loadWeatherTranslations() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch('./json/weatherTranslations.json');
                if (!response.ok)
                    throw new Error("Nie udało się załadować tłumaczeń");
                this.weatherTranslations = yield response.json();
            }
            catch (error) {
                console.error("Błąd ładowania tłumaczeń:", error);
            }
        });
    }
    changeLanguage(language) {
        const translateList = document.querySelectorAll('.translate');
        translateList.forEach((element) => {
            var _a, _b, _c, _d;
            const key = element.dataset.translate;
            const placeholderKey = element.dataset.placeholder;
            const translation = this.weatherTranslations.translations[language] || {};
            const fallback = this.weatherTranslations.translations['pl'] || {};
            if (key) {
                element.textContent = (_b = (_a = translation[key]) !== null && _a !== void 0 ? _a : fallback[key]) !== null && _b !== void 0 ? _b : element.textContent;
            }
            if (placeholderKey && element instanceof HTMLInputElement) {
                element.placeholder = (_d = (_c = translation[placeholderKey]) !== null && _c !== void 0 ? _c : fallback[placeholderKey]) !== null && _d !== void 0 ? _d : '';
            }
        });
    }
    handleChangeLanguage(e) {
        var _a;
        e.preventDefault();
        const newLang = (_a = e.currentTarget.dataset.id) !== null && _a !== void 0 ? _a : 'pl';
        this.language = newLang;
        if (typeof userLanguage !== 'undefined') {
            localStorage.setItem('language', newLang);
            location.reload();
        }
        else {
            fetch('./php/db/update-language.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: newLang }),
            })
                .then(() => {
                localStorage.setItem('language', newLang);
                console.log("Język zapisany w bazie danych: " + newLang);
                this.changeLanguage(newLang);
            })
                .catch(err => console.error("Błąd przy zapisie języka:", err));
        }
        this.changeLanguage(this.language);
    }
    setupEventListeners() {
        const languageLinks = document.querySelectorAll(".nav__language-dropdown-item a");
        languageLinks.forEach((elem) => elem.addEventListener("click", this.handleChangeLanguage.bind(this)));
    }
}
new TranslationManager();
export {};

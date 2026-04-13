"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class CustomControl extends L.Control {
}
class DataStorage {
    constructor() {
        this.errorMessage = document.querySelector(".modal__error-text");
        this.zoneData = {};
        this.isLoggedUser = false;
        this.info = new CustomControl();
        this.map = this.initializeMap();
        this.legend = new L.Control({ position: 'bottomright' });
    }
    initializeMap() {
        const mapOptions = {
            maxZoom: 15,
            scrollWheelZoom: false,
            attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        };
        const map = L.map("map", { scrollWheelZoom: mapOptions.scrollWheelZoom, }).setView([52.42036626625626, 16.911187840699196], 9);
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: mapOptions.maxZoom,
            attribution: mapOptions.attribution
        }).addTo(map);
        return map;
    }
    getErrorMessage() {
        return this.errorMessage;
    }
}
class MapHelpers {
    constructor(dataStorage) {
        this.saveCircle = (newCircle, formData) => __awaiter(this, void 0, void 0, function* () {
            try {
                formData.append('lat', newCircle.lat.toString());
                formData.append('lng', newCircle.lng.toString());
                const response = yield fetch('./php/db/save_coords.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify({
                        lat: newCircle.lat,
                        lng: newCircle.lng,
                        formData: Object.fromEntries(formData.entries())
                    })
                });
                const data = yield response.json();
                if (data.status === "success") {
                    this.dataStorage.getErrorMessage().textContent = '';
                    return true;
                }
                else {
                    this.dataStorage.getErrorMessage().textContent = data.message;
                    return false;
                }
            }
            catch (error) {
                console.error("Błąd serwera:", error);
                return false;
            }
        });
        this.displayModal = (modalStatus, isLogged) => {
            const modalWindow = document.querySelector(".modal");
            const modalError = document.querySelector('.modal__error');
            const toggleModal = isLogged ? modalWindow : modalError;
            toggleModal === null || toggleModal === void 0 ? void 0 : toggleModal.classList.toggle("modal--active", modalStatus);
            toggleModal === null || toggleModal === void 0 ? void 0 : toggleModal.classList.toggle("bodyoverflow", modalStatus);
        };
        this.dataStorage = dataStorage;
    }
}
class LegendCreator {
    constructor(dataStorage) {
        this.dataStorage = dataStorage;
    }
    addInfoControl() {
        var _a;
        this.dataStorage.info.onAdd = () => {
            LegendCreator._section = L.DomUtil.create('section', 'info');
            LegendCreator._header = L.DomUtil.create('h4', 'info__header translate', LegendCreator._section);
            LegendCreator._header.setAttribute('data-translate', 'infoTitle');
            LegendCreator._content = L.DomUtil.create('section', 'info__content', LegendCreator._section);
            return LegendCreator._section;
        };
        this.dataStorage.info.update = (props) => {
            LegendCreator._content.innerHTML = props
                ? `<b data-translate="name" class="info__content-name translate"></b>${props.name}<br />
                   <span data-translate="reserve" class="info__content-datetime translate"></span>${props.reserve}`
                : '<span class="info__content-empty translate" data-translate="empty"></span>';
        };
        (_a = this.dataStorage.info) === null || _a === void 0 ? void 0 : _a.addTo(this.dataStorage.map);
    }
    addLegend() {
        this.dataStorage.legend.onAdd = () => {
            const section = L.DomUtil.create('section', 'legend');
            section.innerHTML += "<h4 class='legend__title translate' data-translate='legendTitle'></h4>";
            section.innerHTML += '<i style="background: #448D40"></i><span class="legend__info translate" data-translate="reserved"></span><br>';
            section.innerHTML += '<i style="background: blue"></i><span class="legend__info translate" data-translate="others"></span><br>';
            section.innerHTML += '<i style="background: #F03"></i><span class="legend__info translate" data-translate="airports"></span><br>';
            return section;
        };
        this.dataStorage.legend.addTo(this.dataStorage.map);
    }
}
class MapInteraction {
    static normalizeCircleData(data) {
        return Object.assign(Object.assign({}, data), { color: data.user_color || data.color, fillColor: data.user_fillColor || data.fillColor, fillOpacity: data.user_fillOpacity || data.fillOpacity });
    }
    static addCirclesToMap(dataStorage) {
        const { map, info, zoneData } = dataStorage;
        const update = info === null || info === void 0 ? void 0 : info.update;
        const addCircle = (data, customUpdate) => {
            const normalizeData = this.normalizeCircleData(data);
            const circle = L.circle([normalizeData.lat, normalizeData.lng], {
                color: normalizeData.color,
                fillColor: normalizeData.fillColor,
                fillOpacity: normalizeData.fillOpacity,
                radius: normalizeData.radius
            }).addTo(map);
            if (customUpdate) {
                circle.on('mouseover', () => customUpdate(data));
                circle.on('mouseout', () => update === null || update === void 0 ? void 0 : update(null));
            }
        };
        zoneData.circleData.forEach((data) => addCircle(data));
        zoneData.userCircleData.forEach((data) => {
            addCircle(data, (circleData) => {
                update === null || update === void 0 ? void 0 : update({ name: circleData.drone || '', reserve: circleData.reserve || '' });
            });
        });
        zoneData.otherCircleData.forEach((data) => {
            addCircle(data, (circleData) => {
                update === null || update === void 0 ? void 0 : update({ name: '', reserve: circleData.reserve || '' });
            });
        });
    }
    toggleScrollWheelZoom(dataStorage) {
        let isZoomed = true;
        const mapElement = document.querySelector('#map');
        mapElement === null || mapElement === void 0 ? void 0 : mapElement.addEventListener('click', () => {
            var _a;
            if (isZoomed) {
                (_a = dataStorage.map) === null || _a === void 0 ? void 0 : _a.scrollWheelZoom.enable();
                mapElement.focus();
                mapElement.classList.add('map-scroll-active');
                mapElement.classList.remove('map-scroll-inactive');
                isZoomed = !isZoomed;
            }
        });
        mapElement === null || mapElement === void 0 ? void 0 : mapElement.addEventListener("mouseleave", () => {
            var _a;
            if (!isZoomed) {
                (_a = dataStorage.map) === null || _a === void 0 ? void 0 : _a.scrollWheelZoom.disable();
                mapElement.classList.remove('map-scroll-active');
                mapElement.classList.add('map-scroll-inactive');
                isZoomed = !isZoomed;
            }
        });
    }
}
class MapAPI {
    constructor(dataStorage, legendCreator) {
        this.legendCreator = legendCreator;
        this.dataStorage = dataStorage;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.dataStorage.info = new CustomControl({ position: 'topright' });
                this.legendCreator.addInfoControl();
                yield this.loadZoneData();
                yield this.userLogApi();
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    userLogApi() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch('./php/check_register.php');
            this.dataStorage.isLoggedUser = yield response.json();
        });
    }
    loadZoneData() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const response = yield fetch('./php/db/getCircles.php', {
                method: "GET",
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            });
            const data = yield response.json();
            this.dataStorage.zoneData = {
                circleData: (_a = data.circleData) !== null && _a !== void 0 ? _a : [],
                userCircleData: (_b = data.userCircleData) !== null && _b !== void 0 ? _b : [],
                otherCircleData: (_c = data.otherCircleData) !== null && _c !== void 0 ? _c : []
            };
            MapInteraction.addCirclesToMap(this.dataStorage);
            (_e = (_d = this.dataStorage.info) === null || _d === void 0 ? void 0 : _d.update) === null || _e === void 0 ? void 0 : _e.call(_d, null);
        });
    }
}
class MapUI {
    static toggleVisibility(isVisible) {
        const notificationBox = document.querySelector('.notification');
        notificationBox.style.display = isVisible ? 'flex' : 'none';
        notificationBox.style.visibility = isVisible ? 'visible' : 'hidden';
        notificationBox.style.opacity = isVisible ? '1' : '0';
    }
    static showNotification() {
        const closeButton = document.querySelector('.notification__button');
        closeButton.addEventListener('click', e => e.target === closeButton && this.toggleVisibility(false));
        this.toggleVisibility(true);
        setTimeout(() => this.toggleVisibility(false), 5000);
    }
}
class MapEvents {
    constructor(dataStorage) {
        this.dataStorage = dataStorage;
        this.mapHelpers = new MapHelpers(this.dataStorage);
    }
    ReserveArea(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const closeModal = document.querySelector(".modal__close-btn");
            const sendButton = document.querySelector(".modal__submit-btn");
            const formElement = document.querySelector(".modal__form");
            let newCircle = null;
            let hasReserved = false;
            const clearData = () => {
                newCircle = null;
                event = null;
                formElement.reset();
            };
            const handleCloseModal = () => {
                this.mapHelpers.displayModal(false, this.dataStorage.isLoggedUser);
                this.dataStorage.getErrorMessage().textContent = "";
                !hasReserved && clearData();
            };
            !this.dataStorage.isLoggedUser && this.mapHelpers.displayModal(true, this.dataStorage.isLoggedUser);
            const sendButtonOnClick = (e) => __awaiter(this, void 0, void 0, function* () {
                e.preventDefault();
                if (!(event === null || event === void 0 ? void 0 : event.latlng))
                    return;
                const { lat, lng } = event.latlng;
                newCircle = { lat, lng };
                const formData = new FormData(formElement);
                try {
                    const response = yield this.mapHelpers.saveCircle(newCircle, formData);
                    if (!response)
                        return;
                    hasReserved = true;
                    this.dataStorage.getErrorMessage().textContent = "";
                    this.mapHelpers.displayModal(false, this.dataStorage.isLoggedUser);
                    MapUI.showNotification();
                    setTimeout(() => window.location.reload(), 2000);
                }
                catch (error) {
                    console.error("Error saving circle:", error);
                    newCircle = null;
                }
            });
            closeModal.addEventListener("click", handleCloseModal);
            sendButton === null || sendButton === void 0 ? void 0 : sendButton.addEventListener("click", sendButtonOnClick);
            this.mapHelpers.displayModal(true, this.dataStorage.isLoggedUser);
        });
    }
    searchCity(cityParam) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            if (!cityParam)
                return;
            const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityParam)}&format=json&limit=1`;
            const response = yield fetch(url);
            const data = response.json();
            const dataArr = yield data;
            if (dataArr.length > 0) {
                const { lat, lon } = dataArr[0];
                (_a = this.dataStorage.map) === null || _a === void 0 ? void 0 : _a.setView([parseFloat(lat), parseFloat(lon)], 13);
            }
        });
    }
    buttonSettings() {
        const inputCity = document.getElementById('cityId');
        const buttons = document.querySelectorAll('.search__container-button');
        const handleSearch = () => this.searchCity(inputCity.value.trim());
        buttons.forEach(button => button.addEventListener('click', () => button.dataset.translate === "search" && handleSearch()));
    }
}
class AppInit {
    constructor() {
        this.dataStorage = new DataStorage();
        this.legendCreator = new LegendCreator(this.dataStorage);
        this.mapApi = new MapAPI(this.dataStorage, this.legendCreator);
        this.mapInteraction = new MapInteraction();
        this.mapEvents = new MapEvents(this.dataStorage);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield this.mapApi.init();
            this.legendCreator.addLegend();
            this.mapEvents.buttonSettings();
            this.mapInteraction.toggleScrollWheelZoom(this.dataStorage);
            (_a = this.dataStorage.map) === null || _a === void 0 ? void 0 : _a.on('contextmenu', event => this.mapEvents.ReserveArea(event));
        });
    }
}
new AppInit().init().then(() => console.log('App initialized')).catch((error) => console.error(error));

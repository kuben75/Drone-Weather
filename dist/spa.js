var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class DIContainer {
    constructor() {
        this.services = new Map();
        this.singletons = new Map();
    }
    register(key, constructor, dependencies, singleton = false) {
        if (this.services.has(key)) {
            throw new Error(`Service ${key} is already registered.`);
        }
        this.services.set(key, { constructor, dependencies, singleton });
        if (singleton)
            this.resolve(key);
    }
    resolve(key) {
        const service = this.services.get(key);
        if (!service)
            throw new Error(`Service ${key} not found`);
        if (service.singleton && this.singletons.has(key))
            return this.singletons.get(key);
        const { constructor, dependencies } = service;
        const resolvedDependencies = dependencies.map((depKey) => this.resolve(depKey));
        const instance = new constructor(...resolvedDependencies);
        if (service.singleton)
            this.singletons.set(key, instance);
        return instance;
    }
}
class SPAHandler {
    constructor() {
        this.handleSPAClickBound = this.handleSPAClick.bind(this);
    }
    setDashboardHandler(dashboardHandler) {
        this.dashboardHandler = dashboardHandler;
    }
    initializeSPAClickListeners() {
        document.querySelectorAll('.spa').forEach((element) => {
            element.removeEventListener('click', this.handleSPAClickBound);
            element.addEventListener('click', this.handleSPAClickBound);
        });
    }
    handleSPAClick(e) {
        const makeAction = () => {
            e.preventDefault();
            this.loadContent(url).catch(error => console.error(error));
        };
        const { logout, header, url } = e.currentTarget.dataset;
        logout ? window.location.href = logout : header ? window.location.href = header : url && (makeAction());
    }
    loadContent(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield fetch(url);
                document.querySelector('.dashboard').innerHTML = yield response.text();
                this.dashboardHandler.initializeDashboard();
            }
            catch (error) {
                console.error(error);
            }
        });
    }
}
class FormHandler {
    constructor(apiHandler, uiHelper) {
        this.apiHandler = apiHandler;
        this.uiHelper = uiHelper;
    }
    initFormListener(config) {
        const form = document.querySelector(config.formSelector);
        form === null || form === void 0 ? void 0 : form.addEventListener('submit', (e) => __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            const formData = new FormData(e.target);
            try {
                const method = config.method || 'POST';
                const data = yield this.apiHandler.sendRequest(config.url, formData, method);
                this.handleResponse(data, e.target);
            }
            catch (error) {
                console.error("Błąd podczas wysyłania formularza:", error);
            }
        }));
    }
    handleResponse(data, formElement) {
        this.setMessage(data.status === 'success', data);
        data.data && Array.isArray(data.data) ? this.uiHelper.renderTable({
            status: data.status,
            message: data.message,
            data: data.data
        }) : null;
        formElement.reset();
    }
    setMessage(success, data) {
        document.querySelectorAll('.modal__error-text').forEach((m) => {
            m.style.color = success ? 'green' : 'red';
            m.textContent = data.message;
        });
    }
}
class LoginHistoryFilter {
    constructor(apiHandler, uiHelper) {
        this.form = null;
        this.resetButton = null;
        this.showSearchButton = null;
        this.searchFormContainer = null;
        this.currentPage = 1;
        this.apiHandler = apiHandler;
        this.uiHelper = uiHelper;
    }
    initHistorySearch() {
        var _a, _b;
        this.form = document.getElementById('search-form');
        this.resetButton = document.getElementById('reset-button');
        this.showSearchButton = document.querySelector("#show-search");
        this.searchFormContainer = document.querySelector('.dashboard-table__controls__filter');
        this.destroy();
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.addEventListener("submit", this.handleSearch.bind(this));
        (_b = this.resetButton) === null || _b === void 0 ? void 0 : _b.addEventListener("click", this.handleReset.bind(this));
        if (this.showSearchButton && this.searchFormContainer) {
            this.updateShowSearchButtonText();
            this.showSearchButton.addEventListener('click', this.toggleSearchVisibility.bind(this));
        }
    }
    toggleSearchVisibility() {
        if (this.searchFormContainer && this.showSearchButton) {
            this.searchFormContainer.classList.toggle('visible');
            this.updateShowSearchButtonText();
        }
    }
    updateShowSearchButtonText() {
        if (this.searchFormContainer && this.showSearchButton)
            this.showSearchButton.textContent = this.searchFormContainer.classList.contains('visible')
                ? 'Ukryj wyszukiwarkę'
                : 'Pokaż wyszukiwarkę';
    }
    handleSearch(e) {
        return __awaiter(this, void 0, void 0, function* () {
            if (e) {
                e.preventDefault();
                this.currentPage = 1;
            }
            if (!this.form)
                return;
            const formData = new FormData(this.form);
            const params = new URLSearchParams();
            for (const pair of formData.entries()) {
                const key = pair[0];
                const value = pair[1];
                if (value && typeof value === 'string' && value.trim() !== '') {
                    params.append(key, value);
                }
            }
            const areFiltersEmpty = params.toString() === '';
            if (areFiltersEmpty && e) {
                this.uiHelper.renderTable({ status: 'info', message: 'Brak wyników wyszukiwania.', data: [] });
                this.showFilterMessage(true, 'Brak wyników wyszukiwania.');
                this.clearPaginationControls();
                return;
            }
            params.append('page', this.currentPage.toString());
            const requestUrl = `php/classes/HistoryLoginFilter.php`;
            try {
                const response = yield this.apiHandler.sendRequest(requestUrl, params, 'GET');
                this.uiHelper.renderTable(response);
                response.pagination && response.data && response.data.length > 0
                    ? this.renderPaginationControls(response.pagination)
                    : this.clearPaginationControls();
                if (e) {
                    const message = (response.data && response.data.length > 0) ? response.message : 'Brak wyników dla podanych kryteriów';
                    this.showFilterMessage(response.status === 'success', message || '');
                }
                else
                    this.showFilterMessage(true, '');
            }
            catch (error) {
                const errorMessage = (error === null || error === void 0 ? void 0 : error.message) || 'Wystąpił błąd podczas wyszukiwania.';
                this.uiHelper.renderTable({ status: 'error', message: errorMessage, data: [] });
                this.showFilterMessage(false, errorMessage);
                this.clearPaginationControls();
            }
        });
    }
    handleReset() {
        if (this.form) {
            this.form.reset();
            this.currentPage = 1;
            this.handleSearch();
        }
    }
    showFilterMessage(success, message) {
        const messageContainer = document.querySelector('.dashboard-table__controls__message');
        if (messageContainer) {
            messageContainer.textContent = message;
            messageContainer.className = `dashboard-table__controls__message ${success
                ? 'message-success'
                : 'message-error'}`;
        }
    }
    destroy() {
        var _a, _b, _c;
        (_a = this.form) === null || _a === void 0 ? void 0 : _a.removeEventListener("submit", this.handleSearch.bind(this));
        (_b = this.resetButton) === null || _b === void 0 ? void 0 : _b.removeEventListener("click", this.handleReset.bind(this));
        (_c = this.showSearchButton) === null || _c === void 0 ? void 0 : _c.removeEventListener('click', this.toggleSearchVisibility.bind(this));
    }
    renderPaginationControls(paginationInfo) {
        const { total_pages, current_page } = paginationInfo.pagination;
        const container = document.getElementById('pagination-controls');
        if (!container)
            return;
        console.log('Pagination info:', paginationInfo, 'Total pages:', total_pages, 'Current page:', current_page);
        container.innerHTML = '';
        if (total_pages <= 1)
            return;
        for (let i = 1; i <= total_pages; i++) {
            const button = document.createElement('button');
            button.textContent = i.toString();
            button.dataset.page = i.toString();
            if (i === current_page) {
                button.classList.add('active');
            }
            button.addEventListener('click', (e) => {
                const target = e.currentTarget;
                const newPage = parseInt(target.dataset.page || '1', 10);
                if (newPage === this.currentPage)
                    return;
                this.currentPage = newPage;
                this.handleSearch();
            });
            container.appendChild(button);
        }
    }
    clearPaginationControls() {
        const container = document.getElementById('pagination-controls');
        if (container)
            container.innerHTML = '';
    }
}
class DashboardHandler {
    constructor(formHandler, uiHelper, spaHandler, apiHandler) {
        this.loginHistoryFilter = null;
        this.formHandler = formHandler;
        this.uiHelper = uiHelper;
        this.spaHandler = spaHandler;
        this.apiHandler = apiHandler;
    }
    handleButtonClick() {
        const buttonConfig = [
            { buttonSelector: '.edit__options--btn', indexSelector: '.edit__options' },
            { buttonSelector: '.edit-btn', indexSelector: '.edit__options' },
            { buttonSelector: '.delete-btn', indexSelector: null }
        ];
        document.addEventListener('click', (e) => {
            var _a;
            const target = e.target;
            for (const config of buttonConfig) {
                const button = target.closest(config.buttonSelector);
                if (button) {
                    e.preventDefault();
                    const action = button.dataset.action;
                    const index = config.indexSelector
                        ? (_a = button.closest(config.indexSelector)) === null || _a === void 0 ? void 0 : _a.dataset.index
                        : button.dataset.index;
                    if (action && index) {
                        const modalID = `edit-${action}-${index}`;
                        const modal = document.getElementById(modalID);
                        if (modal)
                            this.uiHelper.setVisibility(modal, true);
                        break;
                    }
                }
            }
        });
    }
    initReservation() {
        this.uiHelper.toggleVisibility('.edit-btn', '.edit__options');
        this.handleButtonClick();
        document.addEventListener('click', (event) => {
            if (event.target.matches('.dashboard__modal__close, .dashboard__modal__close *')) {
                const modal = event.target.closest('.dashboard__modal');
                if (modal)
                    this.uiHelper.setVisibility(modal, false);
            }
        });
        document.querySelectorAll('.dashboard__modal__form').forEach((e) => {
            const formId = e.getAttribute('id');
            const config = { formSelector: `#${formId}`, url: "php/get_reservation.php" };
            this.formHandler.initFormListener(config);
        });
    }
    initAccount() {
        const config = [
            { formSelector: "#password-form", url: "php/classes/new_password.php" },
            { formSelector: "#account-form", url: "php/classes/account_management.php" }
        ];
        config.forEach((item) => this.formHandler.initFormListener(item));
        this.openAccountModal();
        const fields = ['#login', '#contact-email'];
        fields.forEach((field) => {
            const inputElement = document.querySelector(field);
            inputElement === null || inputElement === void 0 ? void 0 : inputElement.addEventListener('blur', () => this.uiHelper.detectChange(inputElement));
        });
        this.uiHelper.togglePasswordVisibility();
        this.uiHelper.generateRandomPassword();
    }
    openAccountModal() {
        document.querySelectorAll('.dashboard__account__edit').forEach((button) => {
            button.addEventListener("click", (e) => {
                e.preventDefault();
                const modalId = e.currentTarget.dataset.click;
                const modal = document.getElementById(`dashboard__modal__${modalId}`);
                modal && this.uiHelper.setVisibility(modal, true);
                document.querySelectorAll('.account-close').forEach((btn) => {
                    btn.addEventListener('click', () => {
                        modal && this.uiHelper.setVisibility(modal, false);
                    });
                });
            });
        });
    }
    initializeDashboard() {
        this.spaHandler.initializeSPAClickListeners();
        const formConfig = { formSelector: "#window__form", url: "php/validate_f2a.php" };
        const elements = {
            auth: document.querySelector('[data-auth="true"]'),
            reservation: document.querySelector('[data-reservation="true"]'),
            account: document.querySelector('[data-account="true"]'),
            calendar: document.querySelector('[data-calendar="true"]'),
            search: document.querySelector('[data-search="true"]')
        };
        const actions = {
            auth: () => this.formHandler.initFormListener(formConfig),
            reservation: () => this.initReservation(),
            account: () => this.initAccount(),
            calendar: () => this.uiHelper.toggleVisibility('.calendar__days__num__event.green', '.calendar__days__num__modal'),
            search: () => {
                var _a;
                (_a = this.loginHistoryFilter) === null || _a === void 0 ? void 0 : _a.destroy();
                this.loginHistoryFilter = new LoginHistoryFilter(this.apiHandler, this.uiHelper);
                if (this.loginHistoryFilter) {
                    this.loginHistoryFilter.initHistorySearch();
                    this.loginHistoryFilter.handleSearch();
                }
            }
        };
        Object.keys(elements).forEach((key) => {
            var _a;
            if (elements[key]) {
                (_a = actions[key]) === null || _a === void 0 ? void 0 : _a.call(actions);
            }
            else if (key === 'search' && this.loginHistoryFilter) {
                this.loginHistoryFilter.destroy();
                this.loginHistoryFilter = null;
            }
        });
    }
}
class DashboardInitializer {
    constructor(spaHandler, dashboardHandler) {
        this.spaHandler = spaHandler;
        this.dashboardHandler = dashboardHandler;
    }
    initialize() {
        this.spaHandler.setDashboardHandler(this.dashboardHandler);
    }
}
class UIHelper {
    toggleVisibility(selector, targetSelector) {
        const hideAll = () => {
            document.querySelectorAll(targetSelector).forEach((el) => el.style.display = 'none');
        };
        const toggleElement = (activeOption, isVisible) => {
            hideAll();
            activeOption.style.display = isVisible ? 'none' : 'flex';
        };
        document.querySelectorAll(selector).forEach((el) => {
            el.addEventListener('click', (e) => {
                e.stopPropagation();
                const elementID = e.currentTarget.dataset.index;
                const activeOption = document.querySelector(`${targetSelector}[data-index="${elementID}"]`);
                if (activeOption && activeOption.style.display === 'flex')
                    hideAll();
                else if (activeOption)
                    toggleElement(activeOption, false);
            });
        });
        document.addEventListener("click", (e) => {
            const target = e.target;
            (!target.closest(targetSelector) && !target.closest(selector) && hideAll());
        });
    }
    setVisibility(selector, isVisible) {
        selector.style.display = isVisible ? 'flex' : 'none';
        selector.style.visibility = isVisible ? 'visible' : 'hidden';
        selector.style.opacity = isVisible ? '1' : '0';
    }
    manageError(input, isError) {
        const message = document.querySelector(`.dashboard__modal__body__group--error[data-field="${input.id}"]`);
        message && this.setVisibility(message, isError);
        input.style.border = isError ? '2px solid red' : '1px solid #d0d0d0';
    }
    detectChange(input) {
        this.manageError(input, input.value.trim() === '');
    }
    togglePasswordVisibility() {
        document.querySelectorAll(".show__password").forEach((el) => {
            el.addEventListener("click", () => {
                const input = el.parentElement.querySelector("input");
                input.type = input.type === "password" ? "text" : "password";
            });
        });
    }
    renderTable(response) {
        const tableBody = document.querySelector('.dashboard-table__body');
        tableBody.innerHTML = '';
        if (response.data && response.data.length > 0 && Array.isArray(response.data)) {
            response.data.forEach((row) => {
                const tr = document.createElement('tr');
                tr.className = 'dashboard-table__results__row row__result';
                const dateCell = document.createElement('td');
                dateCell.className = 'dashboard-table__results__cell';
                dateCell.textContent = row.login_time;
                const ipCell = document.createElement('td');
                ipCell.className = 'dashboard-table__results__cell';
                ipCell.textContent = row.ip_address;
                tr.appendChild(dateCell);
                tr.appendChild(ipCell);
                tableBody.appendChild(tr);
            });
        }
        else {
            tableBody.innerHTML = `<tr><td colspan="2" class="dashboard-table__results__cell">Brak wyników</td></tr>`;
        }
        const footerCount = document.querySelector('.dashboard-table__controls--footer__count');
        if (footerCount && response.pagination) {
            footerCount.textContent = response.pagination.pagination.total_records.toString();
        }
    }
    generateRandomPassword() {
        document.querySelector(".generate__password").addEventListener('click', () => {
            const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            let password = "";
            for (let i = 0; i < 12; i++) {
                password += chars[Math.floor(Math.random() * chars.length)];
            }
            document.querySelectorAll(".new__password").forEach((e) => {
                e.value = password;
            });
        });
    }
}
class APIHandler {
    sendRequest(endpoint, formData, method) {
        return __awaiter(this, void 0, void 0, function* () {
            const options = {
                method,
                headers: { 'X-Requested-With': 'XMLHttpRequest' }
            };
            let finalEndpoint = endpoint;
            if (method === 'POST') {
                if (formData instanceof FormData)
                    options.body = formData;
            }
            else if (method === 'GET') {
                let queryString = '';
                if (formData instanceof URLSearchParams) {
                    queryString = formData.toString();
                }
                else if (formData instanceof FormData) {
                    queryString = this.createQueryParams(formData).toString();
                }
                else if (typeof formData === 'object' && formData !== null && !(formData instanceof FormData) && !(formData instanceof URLSearchParams)) {
                    const tempParams = new URLSearchParams();
                    for (const [key, value] of Object.entries(formData)) {
                        if (typeof value === 'string') {
                            tempParams.append(key, value);
                        }
                        else if (typeof value === 'number' || typeof value === 'boolean') {
                            tempParams.append(key, String(value));
                        }
                    }
                    queryString = tempParams.toString();
                }
                if (queryString)
                    finalEndpoint = `${endpoint}?${queryString}`;
            }
            const response = yield fetch(finalEndpoint, options);
            if (!response.ok) {
                const errorText = yield response.text();
                throw new Error(`Request failed with status ${response.status}: ${errorText}`);
            }
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json"))
                return yield response.json();
            else
                return null;
        });
    }
    createQueryParams(formData) {
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                params.append(key, value.trim() || value);
            }
        }
        return params.toString();
    }
}
class App {
    constructor(container) {
        this.container = container;
        this.spaHandler = this.container.resolve('SPAHandler');
        this.dashboardInitializer = this.container.resolve('DashboardInitializer');
        this.dashboardInitializer.initialize();
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.spaHandler.loadContent('./php/spa/panel.php');
        });
    }
    start() {
        this.init().then(() => console.log('APP initialized')).catch((error) => console.error(error));
    }
}
const container = new DIContainer();
container.register('UIHelper', UIHelper, [], true);
container.register('APIHandler', APIHandler, [], true);
container.register('FormHandler', FormHandler, ['APIHandler', 'UIHelper'], true);
container.register('SPAHandler', SPAHandler, [], true);
container.register('DashboardHandler', DashboardHandler, ['FormHandler', 'UIHelper', 'SPAHandler', 'APIHandler'], true);
container.register('DashboardInitializer', DashboardInitializer, ['SPAHandler', 'DashboardHandler'], true);
const app = new App(container);
app.start();
export {};

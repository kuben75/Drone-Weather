export interface ApiResponse<T = any> {
    status: 'success' | 'error' | 'info' | '2fa_required'
    message: string
    data?: T
    pagination?: PaginationInfo
}
interface FormConfig<T = ApiResponse, R = unknown> {
    formSelector: string
    url: string
    responseType?: T
    customHandler?: (response: R) => void
    method?: 'POST' | 'GET';
}
export interface PaginationInfo {
    pagination: {
        current_page: number;
        total_pages: number;
        total_records: number;
        records_per_page: number;
    }
}
interface TableRow {
    login_time: string
    ip_address: string
}

type ButtonConfig = {
    buttonSelector: string
    indexSelector?: string | null
}

type Constructor<T> = new (...args: any[]) => T

class DIContainer {
    private services: Map<string, any> = new Map()
    private singletons: Map<string, any> = new Map()

    public register<T>(key: string, constructor: Constructor<T>, dependencies: string[], singleton: boolean = false): void {
        if (this.services.has(key)) {
            throw new Error(`Service ${key} is already registered.`)
        }

        this.services.set(key, {constructor, dependencies, singleton})

        if (singleton)
            this.resolve<T>(key)
    }

    public resolve<T>(key: string): T {
        const service = this.services.get(key)
        if (!service)
            throw new Error(`Service ${key} not found`);

        if (service.singleton && this.singletons.has(key))
            return this.singletons.get(key)

        const {constructor, dependencies} = service
        const resolvedDependencies = dependencies.map((depKey: string) => this.resolve(depKey))
        const instance = new constructor(...resolvedDependencies)

        if (service.singleton)
            this.singletons.set(key, instance)

        return instance
    }
}

class SPAHandler {
    private dashboardHandler!: DashboardHandler
    private readonly handleSPAClickBound: (e: Event) => void

    constructor() {
        this.handleSPAClickBound = this.handleSPAClick.bind(this)
    }

    public setDashboardHandler(dashboardHandler: DashboardHandler): void {
        this.dashboardHandler = dashboardHandler
    }

    public initializeSPAClickListeners(): void {
        (document.querySelectorAll('.spa') as NodeListOf<HTMLElement>).forEach((element: HTMLElement): void => {
            element.removeEventListener('click', this.handleSPAClickBound)
            element.addEventListener('click', this.handleSPAClickBound)
        })
    }

    private handleSPAClick(e: Event): void {
        const makeAction = () => {
            e.preventDefault()
            this.loadContent(url).catch(error => console.error(error))
        }
        const {logout, header, url} = (e.currentTarget as HTMLElement).dataset as {
            logout?: string,
            header?: string,
            url: string
        }
        logout ? window.location.href = logout : header ? window.location.href = header : url && (makeAction())
    }

    public async loadContent(url: string): Promise<void> {
        try {
            const response: Response = await fetch(url);
            (document.querySelector('.dashboard') as HTMLElement).innerHTML = await response.text()
            this.dashboardHandler.initializeDashboard()
        } catch (error) {
            console.error(error)
        }
    }

}

class FormHandler {
    constructor(private apiHandler: APIHandler, private uiHelper: UIHelper) {
    }

    public initFormListener<T>(config: FormConfig<T>): void {
        const form = document.querySelector<HTMLFormElement>(config.formSelector) as HTMLFormElement | null

        form?.addEventListener('submit', async (e: Event): Promise<void> => {
            e.preventDefault()
            const formData: FormData = new FormData(e.target as HTMLFormElement)
            try {
                const method = config.method || 'POST'
                const data: Awaited<T> = await this.apiHandler.sendRequest<T>(config.url, formData, method)

                this.handleResponse(data as ApiResponse, e.target as HTMLFormElement)
            } catch (error) {
                console.error("Błąd podczas wysyłania formularza:", error)
            }
        })

    }

    private handleResponse(data: ApiResponse, formElement: HTMLFormElement): void {
        this.setMessage(data.status === 'success', data)
        data.data && Array.isArray(data.data) ? this.uiHelper.renderTable({
            status: data.status,
            message: data.message,
            data: data.data
        }) : null
        formElement.reset()
    }

    private setMessage(success: boolean, data: Pick<ApiResponse, 'message'>): void {
        document.querySelectorAll<HTMLElement>('.modal__error-text').forEach((m: HTMLElement) => {
            m.style.color = success ? 'green' : 'red'
            m.textContent = data.message
        })
    }
}

class LoginHistoryFilter {
    private apiHandler: APIHandler
    private uiHelper: UIHelper

    private form: HTMLFormElement | null = null
    private resetButton: HTMLButtonElement | null = null
    private showSearchButton: HTMLElement | null = null
    private searchFormContainer: HTMLElement | null = null
    private currentPage: number = 1

    constructor(apiHandler: APIHandler, uiHelper: UIHelper) {
        this.apiHandler = apiHandler
        this.uiHelper = uiHelper
    }

    public initHistorySearch(): void {
        this.form = document.getElementById('search-form') as HTMLFormElement | null
        this.resetButton = document.getElementById('reset-button') as HTMLButtonElement | null
        this.showSearchButton = document.querySelector("#show-search") as HTMLElement | null
        this.searchFormContainer = document.querySelector('.dashboard-table__controls__filter') as HTMLElement | null

        this.destroy();
        this.form?.addEventListener("submit", this.handleSearch.bind(this))
        this.resetButton?.addEventListener("click", this.handleReset.bind(this))

        if (this.showSearchButton && this.searchFormContainer) {
            this.updateShowSearchButtonText()
            this.showSearchButton.addEventListener('click', this.toggleSearchVisibility.bind(this))
        }
    }

    private toggleSearchVisibility(): void {
        if (this.searchFormContainer && this.showSearchButton) {
            this.searchFormContainer.classList.toggle('visible')
            this.updateShowSearchButtonText()
        }
    }

    private updateShowSearchButtonText(): void {
        if (this.searchFormContainer && this.showSearchButton)
            this.showSearchButton.textContent = this.searchFormContainer.classList.contains('visible')
                ? 'Ukryj wyszukiwarkę'
                : 'Pokaż wyszukiwarkę'

    }

    public async handleSearch(e?: Event): Promise<void> {
        if (e) {
            e.preventDefault();
            this.currentPage = 1;
        }
        if (!this.form) return

        const formData: FormData = new FormData(this.form)
        const params: URLSearchParams = new URLSearchParams()
        for (const pair of formData.entries()) {
            const key: string = pair[0]
            const value: FormDataEntryValue = pair[1]
            if (value && typeof value === 'string' && value.trim() !== '') {
                params.append(key, value)
            }
        }
        const areFiltersEmpty: boolean = params.toString() === ''
        if (areFiltersEmpty && e) {
            this.uiHelper.renderTable({ status: 'info', message: 'Brak wyników wyszukiwania.', data: [] })
            this.showFilterMessage(true, 'Brak wyników wyszukiwania.')
            this.clearPaginationControls()
            return
        }

        params.append('page', this.currentPage.toString())
        const requestUrl = `php/classes/HistoryLoginFilter.php`

        try {
            const response: ApiResponse<TableRow[]> = await this.apiHandler.sendRequest<ApiResponse<TableRow[]>>(
                requestUrl,
                params,
                'GET'
            )
            this.uiHelper.renderTable(response)
            response.pagination && response.data && response.data.length > 0
               ? this.renderPaginationControls(response.pagination)
               : this.clearPaginationControls()

            if(e){
                const message = (response.data && response.data.length > 0) ? response.message : 'Brak wyników dla podanych kryteriów'
                this.showFilterMessage(response.status === 'success', message || '')
            }
            else
                this.showFilterMessage(true, '')
        } catch (error: any) {
            const errorMessage = error?.message || 'Wystąpił błąd podczas wyszukiwania.';
            this.uiHelper.renderTable({ status: 'error', message: errorMessage, data: [] })
            this.showFilterMessage(false, errorMessage)
            this.clearPaginationControls();
        }
    }

    private handleReset(): void {
        if (this.form) {
            this.form.reset();
            this.currentPage = 1;
            this.handleSearch();
        }
    }

    private showFilterMessage(success: boolean, message: string): void {
        const messageContainer = document.querySelector('.dashboard-table__controls__message') as HTMLElement | null
        if (messageContainer) {
            messageContainer.textContent = message
            messageContainer.className = `dashboard-table__controls__message ${success 
                ? 'message-success' 
                : 'message-error'
            }`
        }
    }

    public destroy(): void {
        this.form?.removeEventListener("submit", this.handleSearch.bind(this))
        this.resetButton?.removeEventListener("click", this.handleReset.bind(this))
        this.showSearchButton?.removeEventListener('click', this.toggleSearchVisibility.bind(this))
    }

    private renderPaginationControls(paginationInfo: PaginationInfo): void {
        const { total_pages, current_page } = paginationInfo.pagination
        const container = document.getElementById('pagination-controls')
        if (!container) return

        console.log('Pagination info:', paginationInfo , 'Total pages:', total_pages, 'Current page:', current_page)
        container.innerHTML = ''

        if (total_pages <= 1) return


        for (let i = 1; i <= total_pages; i++) {
            const button = document.createElement('button')
            button.textContent = i.toString()
            button.dataset.page = i.toString()
            if (i === current_page) {
                button.classList.add('active')
            }
            button.addEventListener('click', (e) => {
                const target = e.currentTarget as HTMLElement
                const newPage = parseInt(target.dataset.page || '1', 10)
                if (newPage === this.currentPage) return
                this.currentPage = newPage
                this.handleSearch()
            })
            container.appendChild(button)
        }
    }

    private clearPaginationControls(): void {
        const container = document.getElementById('pagination-controls')
        if (container)
            container.innerHTML = ''

    }
}

class DashboardHandler {
    private formHandler: FormHandler
    private readonly uiHelper: UIHelper
    private spaHandler: SPAHandler
    private readonly apiHandler: APIHandler
    private loginHistoryFilter: LoginHistoryFilter | null = null

    constructor(
        formHandler: FormHandler,
        uiHelper: UIHelper,
        spaHandler: SPAHandler,
        apiHandler: APIHandler
    ) {
        this.formHandler = formHandler
        this.uiHelper = uiHelper
        this.spaHandler = spaHandler
        this.apiHandler = apiHandler
    }

    private handleButtonClick(): void {
        const buttonConfig: ButtonConfig[] = [
            { buttonSelector: '.edit__options--btn', indexSelector: '.edit__options' },
            { buttonSelector: '.edit-btn', indexSelector: '.edit__options' },
            { buttonSelector: '.delete-btn', indexSelector: null }
        ]

        document.addEventListener('click', (e: Event): void => {
            const target = e.target as HTMLElement

            for (const config of buttonConfig) {
                const button = target.closest(config.buttonSelector) as HTMLElement
                if (button) {
                    e.preventDefault()
                    const action = button.dataset.action as string
                    const index = config.indexSelector
                        ? (button.closest(config.indexSelector) as HTMLElement)?.dataset.index
                        : button.dataset.index
                    if (action && index) {
                        const modalID: string = `edit-${action}-${index}`
                        const modal = document.getElementById(modalID) as HTMLElement
                        if (modal)
                            this.uiHelper.setVisibility(modal, true)
                        break
                    }
                }
            }
        })
    }

    private initReservation(): void {
        this.uiHelper.toggleVisibility('.edit-btn', '.edit__options')

        this.handleButtonClick()

        document.addEventListener('click', (event: Event) => {
            if ((event.target as HTMLElement).matches('.dashboard__modal__close, .dashboard__modal__close *')) {
                const modal = (event.target as HTMLElement).closest('.dashboard__modal') as HTMLElement
                if (modal) this.uiHelper.setVisibility(modal, false)
            }
        })


        document.querySelectorAll<HTMLElement>('.dashboard__modal__form').forEach((e): void => {
            const formId: string | null = e.getAttribute('id')
            const config: FormConfig = {formSelector: `#${formId}`, url: "php/get_reservation.php"}
            this.formHandler.initFormListener(config)
        })
    }


    private initAccount(): void {
        const config: FormConfig[] = [
            {formSelector: "#password-form", url: "php/classes/new_password.php"},
            {formSelector: "#account-form", url: "php/classes/account_management.php"}
        ];
        config.forEach((item) => this.formHandler.initFormListener(item));
        this.openAccountModal();
        const fields: string[] = ['#login', '#contact-email'];
        fields.forEach((field) => {
            const inputElement = document.querySelector(field) as HTMLInputElement | null;
            inputElement?.addEventListener('blur', () => this.uiHelper.detectChange(inputElement));
        });
        this.uiHelper.togglePasswordVisibility();
        this.uiHelper.generateRandomPassword();
    }


    private openAccountModal(): void {
        (document.querySelectorAll('.dashboard__account__edit') as NodeListOf<HTMLElement>).forEach((button: HTMLElement): void => {
            button.addEventListener("click", (e: MouseEvent) => {
                e.preventDefault();
                const modalId = (e.currentTarget as HTMLElement).dataset.click;
                const modal = document.getElementById(`dashboard__modal__${modalId}`) as HTMLElement;
                modal && this.uiHelper.setVisibility(modal, true);
                (document.querySelectorAll('.account-close') as NodeListOf<HTMLElement>).forEach((btn: HTMLElement) => {
                    btn.addEventListener('click', () => {
                        modal && this.uiHelper.setVisibility(modal, false);
                    });
                });
            });
        });
    }

    public initializeDashboard(): void {
        this.spaHandler.initializeSPAClickListeners();
        const formConfig: FormConfig = {formSelector: "#window__form", url: "php/validate_f2a.php"};
        const elements: { [key: string]: HTMLElement | null } = {
            auth: document.querySelector('[data-auth="true"]'),
            reservation: document.querySelector('[data-reservation="true"]'),
            account: document.querySelector('[data-account="true"]'),
            calendar: document.querySelector('[data-calendar="true"]'),
            search: document.querySelector('[data-search="true"]')
        };
        const actions: { [key: string]: () => void } = {
            auth: () => this.formHandler.initFormListener(formConfig),
            reservation: () => this.initReservation(),
            account: () => this.initAccount(),
            calendar: () => this.uiHelper.toggleVisibility('.calendar__days__num__event.green', '.calendar__days__num__modal'),
            search: () =>  {
                this.loginHistoryFilter?.destroy()
                this.loginHistoryFilter = new LoginHistoryFilter(
                    this.apiHandler,
                    this.uiHelper
                )
                if (this.loginHistoryFilter) {
                    this.loginHistoryFilter.initHistorySearch()
                    this.loginHistoryFilter.handleSearch()
                }
            }
        }
        Object.keys(elements).forEach((key: string) => {
            if (elements[key]) {
                actions[key]?.()
            } else if (key === 'search' && this.loginHistoryFilter) {
                this.loginHistoryFilter.destroy()
                this.loginHistoryFilter = null
            }
        })
    }
}

class DashboardInitializer {
    private spaHandler: SPAHandler
    private readonly dashboardHandler: DashboardHandler

    constructor(spaHandler: SPAHandler, dashboardHandler: DashboardHandler) {
        this.spaHandler = spaHandler
        this.dashboardHandler = dashboardHandler
    }

    public initialize(): void {
        this.spaHandler.setDashboardHandler(this.dashboardHandler)
    }
}

class UIHelper {
    public toggleVisibility(selector: string, targetSelector: string): void {
        const hideAll = (): void => {
            (document.querySelectorAll(targetSelector) as NodeListOf<HTMLElement>).forEach((el: HTMLElement): string => el.style.display = 'none')
        }
        const toggleElement = (activeOption: HTMLElement, isVisible: boolean): void => {
            hideAll()
            activeOption.style.display = isVisible ? 'none' : 'flex'
        };
        (document.querySelectorAll(selector) as NodeListOf<HTMLElement>).forEach((el: HTMLElement): void => {
            el.addEventListener('click', (e) => {
                e.stopPropagation()
                const elementID = (e.currentTarget as HTMLElement).dataset.index;
                const activeOption = document.querySelector(`${targetSelector}[data-index="${elementID}"]`) as HTMLElement

                if (activeOption && activeOption.style.display === 'flex') hideAll()

                else if (activeOption) toggleElement(activeOption, false)

            })
        })
        document.addEventListener("click", (e): void => {
            const target = e.target as HTMLElement;
            (!target.closest(targetSelector) && !target.closest(selector) && hideAll())
        })
    }

    public setVisibility(selector: HTMLElement, isVisible: boolean): void {
        selector.style.display = isVisible ? 'flex' : 'none'
        selector.style.visibility = isVisible ? 'visible' : 'hidden'
        selector.style.opacity = isVisible ? '1' : '0'
    }

    public manageError(input: HTMLInputElement, isError: boolean): void {
        const message = document.querySelector(`.dashboard__modal__body__group--error[data-field="${input.id}"]`) as HTMLElement
        message && this.setVisibility(message, isError)
        input.style.border = isError ? '2px solid red' : '1px solid #d0d0d0'
    }

    public detectChange(input: HTMLInputElement): void {
        this.manageError(input, input.value.trim() === '')
    }

    public togglePasswordVisibility(): void {
        (document.querySelectorAll(".show__password") as NodeListOf<HTMLElement>).forEach((el: HTMLElement): void => {
            el.addEventListener("click", (): void => {
                const input = (el.parentElement as HTMLInputElement).querySelector("input") as HTMLInputElement
                input.type = input.type === "password" ? "text" : "password"
            })
        })
    }

    public renderTable(response: ApiResponse<TableRow[]>): void {

        const tableBody = document.querySelector('.dashboard-table__body') as HTMLElement
        tableBody.innerHTML =''
        if (response.data && response.data.length > 0 && Array.isArray(response.data)) {
            response.data.forEach((row: TableRow): void => {
                const tr = document.createElement('tr')
                tr.className = 'dashboard-table__results__row row__result'

                const dateCell = document.createElement('td')
                dateCell.className = 'dashboard-table__results__cell'
                dateCell.textContent = row.login_time

                const ipCell = document.createElement('td')
                ipCell.className = 'dashboard-table__results__cell'
                ipCell.textContent = row.ip_address

                tr.appendChild(dateCell)
                tr.appendChild(ipCell)
                tableBody.appendChild(tr)
            })
        } else {
            tableBody.innerHTML = `<tr><td colspan="2" class="dashboard-table__results__cell">Brak wyników</td></tr>`
        }
        const footerCount = document.querySelector('.dashboard-table__controls--footer__count') as HTMLElement | null

        if (footerCount && response.pagination) {
            footerCount.textContent = response.pagination.pagination.total_records.toString();
        }

    }

    public generateRandomPassword(): void {
        (document.querySelector(".generate__password") as HTMLElement).addEventListener('click', () => {
            const chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            let password = ""
            for (let i = 0; i < 12; i++) {
                password += chars[Math.floor(Math.random() * chars.length)]
            }
            document.querySelectorAll(".new__password").forEach((e) => {
                (e as HTMLInputElement).value = password
            })
        })
    }
}

class APIHandler {
    async sendRequest<T>(endpoint: string, formData?: FormData | URLSearchParams | object, method?: 'GET' | 'POST'): Promise<T> {

        const options: RequestInit = {
            method,
            headers: {'X-Requested-With': 'XMLHttpRequest'}
        }
        let finalEndpoint: string = endpoint

        if (method === 'POST') {
            if (formData instanceof FormData)
                options.body = formData

        } else if (method === 'GET') {
            let queryString = '';
            if (formData instanceof URLSearchParams) {
                queryString = formData.toString()
            } else if (formData instanceof FormData) {
                queryString = this.createQueryParams(formData).toString();
            } else if (typeof formData === 'object' && formData !== null && !(formData instanceof FormData) && !(formData instanceof URLSearchParams)) {
                const tempParams = new URLSearchParams();
                for (const [key, value] of Object.entries(formData)) {
                    if (typeof value === 'string') {
                        tempParams.append(key, value);
                    } else if (typeof value === 'number' || typeof value === 'boolean') {
                        tempParams.append(key, String(value));
                    }
                }
                queryString = tempParams.toString();
            }
            if (queryString) finalEndpoint = `${endpoint}?${queryString}`
        }

        const response = await fetch(finalEndpoint, options)

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Request failed with status ${response.status}: ${errorText}`);
        }
        const contentType = response.headers.get("content-type")
        if (contentType && contentType.includes("application/json"))
            return await response.json()
        else
            return null as T

    }


    private createQueryParams(formData: FormData): string {
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            if (typeof value === 'string') {
                params.append(key, value.trim() || value)
            }
        }
        return params.toString();
    }
}

class App {
    private readonly spaHandler: SPAHandler;
    private readonly dashboardInitializer: DashboardInitializer

    constructor(private container: DIContainer) {
        this.spaHandler = this.container.resolve<SPAHandler>('SPAHandler')
        this.dashboardInitializer = this.container.resolve<DashboardInitializer>('DashboardInitializer')
        this.dashboardInitializer.initialize()
    }

    private async init(): Promise<void> {
        await this.spaHandler.loadContent('./php/spa/panel.php')

    }

    public start(): void {
        this.init().then(() => console.log('APP initialized')).catch((error) => console.error(error))
    }
}

const container: DIContainer = new DIContainer()

container.register<UIHelper>('UIHelper', UIHelper, [], true);
container.register<APIHandler>('APIHandler', APIHandler, [], true);
container.register<FormHandler>('FormHandler', FormHandler, ['APIHandler', 'UIHelper'], true)
container.register<SPAHandler>('SPAHandler', SPAHandler, [], true);
container.register<DashboardHandler>('DashboardHandler', DashboardHandler, ['FormHandler', 'UIHelper', 'SPAHandler', 'APIHandler'], true);
container.register<DashboardInitializer>('DashboardInitializer', DashboardInitializer, ['SPAHandler', 'DashboardHandler'], true);
const app = new App(container)
app.start()





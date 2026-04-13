interface CircleData {
    drone: string | null
    reserve: string | null
    lat: number
    lng: number
    radius: number
    color: string
    fillColor: string
    fillOpacity: number
    user_color?: string
    user_fillColor?: string
    user_fillOpacity?: number
}

type Circles = {
    [key: string]: CircleData[]
}
interface MapOptions {
    maxZoom: number
    scrollWheelZoom: boolean
    attribution: string
}
class CustomControl extends L.Control {

    update?: (props: { name: string, reserve: string } | null) => void
}
class DataStorage {
    errorMessage: HTMLElement | null
    zoneData: Circles
    isLoggedUser: boolean
    info: CustomControl
    map: L.Map | null
    legend: L.Control
    constructor() {

        this.errorMessage = document.querySelector(".modal__error-text")
        this.zoneData = {} as Circles
        this.isLoggedUser = false
        this.info = new CustomControl()
        this.map = this.initializeMap()
        this.legend = new L.Control({ position: 'bottomright' })
    }
    initializeMap(): L.Map {
        const mapOptions: MapOptions = {
            maxZoom: 15,
            scrollWheelZoom: false,
            attribution: '&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }

       const map = L.map("map", {scrollWheelZoom: mapOptions.scrollWheelZoom,}).setView([52.42036626625626, 16.911187840699196], 9)

        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: mapOptions.maxZoom,
            attribution: mapOptions.attribution
        }).addTo(map)
        return map
    }
    getErrorMessage(): HTMLElement | null {
        return this.errorMessage
    }
}

class MapHelpers {
    private readonly dataStorage: DataStorage
    constructor(dataStorage: DataStorage) {
        this.dataStorage = dataStorage
    }
     saveCircle = async (newCircle: { lat: number, lng: number}, formData: FormData): Promise<boolean> => {
        try{
            formData.append('lat', newCircle.lat.toString())
            formData.append('lng', newCircle.lng.toString())
            const response: Response = await fetch('./php/db/save_coords.php', {
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
            })
            const data = await response.json()
            if(data.status === "success") {
                (this.dataStorage.getErrorMessage() as HTMLElement).textContent = ''
                return true
            }
            else {
                (this.dataStorage.getErrorMessage() as HTMLElement).textContent = data.message
                return false
            }
        }catch(error) {
            console.error("Błąd serwera:", error)
            return false
        }
    }
     displayModal = (modalStatus: boolean, isLogged: boolean): void => {
        const modalWindow = document.querySelector(".modal") as HTMLElement | null
        const modalError = document.querySelector('.modal__error') as HTMLElement | null
        const toggleModal = isLogged ? modalWindow : modalError
        toggleModal?.classList.toggle("modal--active", modalStatus)
        toggleModal?.classList.toggle("bodyoverflow", modalStatus)
    }

}
class LegendCreator {
    private static _section: HTMLElement
    private static _header: HTMLElement
    private static _content: HTMLElement
    private readonly dataStorage: DataStorage
    constructor(dataStorage: DataStorage) {
        this.dataStorage = dataStorage
    }
     addInfoControl(): void {
        this.dataStorage.info.onAdd =  (): HTMLElement => {
            LegendCreator._section = L.DomUtil.create('section', 'info')
            LegendCreator._header = L.DomUtil.create('h4', 'info__header translate', LegendCreator._section)
            LegendCreator._header.setAttribute('data-translate', 'infoTitle')
            LegendCreator._content = L.DomUtil.create('section', 'info__content', LegendCreator._section)
            return LegendCreator._section
        };

        (this.dataStorage.info as CustomControl).update =  (props: { name: string, reserve: string } | null):void => {
            LegendCreator._content.innerHTML = props
                ? `<b data-translate="name" class="info__content-name translate"></b>${props.name}<br />
                   <span data-translate="reserve" class="info__content-datetime translate"></span>${props.reserve}`
                : '<span class="info__content-empty translate" data-translate="empty"></span>'
        }
         this.dataStorage.info?.addTo(this.dataStorage.map as L.Map)
    }
     addLegend(): void {
         this.dataStorage.legend.onAdd =  (): HTMLElement =>{
            const section = L.DomUtil.create('section', 'legend')
            section.innerHTML += "<h4 class='legend__title translate' data-translate='legendTitle'></h4>"
            section.innerHTML += '<i style="background: #448D40"></i><span class="legend__info translate" data-translate="reserved"></span><br>'
            section.innerHTML += '<i style="background: blue"></i><span class="legend__info translate" data-translate="others"></span><br>'
            section.innerHTML += '<i style="background: #F03"></i><span class="legend__info translate" data-translate="airports"></span><br>'
            return section
        }
         this.dataStorage.legend.addTo(this.dataStorage.map as L.Map)
    }
}

class MapInteraction {
    static normalizeCircleData(data: CircleData): CircleData {
        return {
            ...data,
            color: data.user_color || data.color,
            fillColor: data.user_fillColor || data.fillColor,
            fillOpacity: data.user_fillOpacity || data.fillOpacity
        }
    }
    static addCirclesToMap(dataStorage: DataStorage):void {
        const {map, info, zoneData} = dataStorage
        const update = info?.update
        const addCircle = (data: CircleData, customUpdate?: (data: CircleData) => void): void => {
            const normalizeData = this.normalizeCircleData(data)
            const circle = L.circle([normalizeData.lat, normalizeData.lng], {
                color: normalizeData.color,
                fillColor: normalizeData.fillColor,
                fillOpacity: normalizeData.fillOpacity,
                radius: normalizeData.radius
            }).addTo(map as L.Map)
            if(customUpdate){
                circle.on('mouseover', () => customUpdate(data))
                circle.on('mouseout', () => update?.(null))
            }
        }
        zoneData.circleData.forEach((data: CircleData) => addCircle(data))
        zoneData.userCircleData.forEach((data: CircleData): void => {
            addCircle(data, (circleData: CircleData) => {
                 update?.({name: circleData.drone || '', reserve: circleData.reserve || ''})
            })
        })
        zoneData.otherCircleData.forEach((data: CircleData): void => {
            addCircle(data, (circleData: CircleData) => {
               update?.({name: '', reserve: circleData.reserve || ''})
            })
        })
    }
    toggleScrollWheelZoom(dataStorage: DataStorage): void {
        let isZoomed = true
        const mapElement = document.querySelector('#map') as HTMLElement|null
        mapElement?.addEventListener('click', () => {
            if(isZoomed){
                dataStorage.map?.scrollWheelZoom.enable()
                mapElement.focus()
                mapElement.classList.add('map-scroll-active')
                mapElement.classList.remove('map-scroll-inactive')
                isZoomed = !isZoomed;
            }
        })
        mapElement?.addEventListener("mouseleave", () => {
            if(!isZoomed){
                dataStorage.map?.scrollWheelZoom.disable()
                mapElement.classList.remove('map-scroll-active')
                mapElement.classList.add('map-scroll-inactive')
                isZoomed = !isZoomed;
            }
        })
    }
}
class MapAPI {
    private readonly dataStorage: DataStorage
    private readonly legendCreator: LegendCreator
    constructor(dataStorage: DataStorage, legendCreator: LegendCreator) {
        this.legendCreator = legendCreator
        this.dataStorage = dataStorage
    }
     async init () :Promise<void> {
         try {
             this.dataStorage.info = new CustomControl( { position: 'topright' })
             this.legendCreator.addInfoControl()
             await this.loadZoneData()
             await this.userLogApi()
         }catch (e) {
             console.error(e)
         }
     }
    async userLogApi (): Promise<void> {
         const response = await fetch('./php/check_register.php')
        this.dataStorage.isLoggedUser = await response.json()
     }
     async loadZoneData (): Promise<void>
     {
          const response = await fetch('./php/db/getCircles.php', {
              method: "GET",
              headers: {'X-Requested-With': 'XMLHttpRequest'}
          })
         const data: { circleData: CircleData[], userCircleData: CircleData[], otherCircleData: CircleData[] } = await response.json()
         this.dataStorage.zoneData = {
             circleData: data.circleData ?? [],
             userCircleData: data.userCircleData ?? [],
             otherCircleData: data.otherCircleData ?? []
         }
         MapInteraction.addCirclesToMap(this.dataStorage)
         this.dataStorage.info?.update?.(null)
     }

}
class MapUI {
    static toggleVisibility (isVisible: boolean): void {
        const notificationBox = document.querySelector('.notification') as HTMLElement
        notificationBox.style.display = isVisible ? 'flex' : 'none'
        notificationBox.style.visibility = isVisible ? 'visible' : 'hidden'
        notificationBox.style.opacity = isVisible ? '1' : '0'
    }
    static showNotification (): void {
        const closeButton = document.querySelector('.notification__button') as HTMLElement
        closeButton.addEventListener('click', e => e.target === closeButton && this.toggleVisibility(false))
        this.toggleVisibility(true)
        setTimeout(() => this.toggleVisibility(false), 5000)
    }
}
class MapEvents {
    private readonly dataStorage: DataStorage
    private readonly mapHelpers: MapHelpers
    constructor(dataStorage: DataStorage) {
        this.dataStorage = dataStorage
        this.mapHelpers = new MapHelpers(this.dataStorage)
    }

    async ReserveArea(event: L.LeafletMouseEvent | null): Promise<void> {
        const closeModal = document.querySelector(".modal__close-btn") as HTMLElement
        const sendButton = document.querySelector(".modal__submit-btn") as HTMLElement
        const formElement = document.querySelector(".modal__form") as HTMLFormElement
        let newCircle: { lat: number; lng: number } | null = null
        let hasReserved = false
        const clearData = (): void => {
            newCircle = null
            event = null
            formElement.reset()
        }
        const handleCloseModal = (): void => {
            this.mapHelpers.displayModal(false, this.dataStorage.isLoggedUser);
            (this.dataStorage.getErrorMessage() as HTMLElement).textContent = ""
            !hasReserved && clearData()
        }
        !this.dataStorage.isLoggedUser && this.mapHelpers.displayModal(true, this.dataStorage.isLoggedUser)
        const sendButtonOnClick = async (e: Event): Promise<void> => {

            e.preventDefault()
            if (!event?.latlng) return

            const { lat, lng } = event.latlng
            newCircle = { lat, lng }
            const formData = new FormData(formElement)
            try {
                const response = await this.mapHelpers.saveCircle(newCircle, formData)
                if (!response) return
                hasReserved = true;
                (this.dataStorage.getErrorMessage() as HTMLElement).textContent = ""

                this.mapHelpers.displayModal(false, this.dataStorage.isLoggedUser)
                MapUI.showNotification()
                setTimeout(() => window.location.reload(), 2000)
            } catch (error) {
                console.error("Error saving circle:", error)
                newCircle = null
            }
        }
        closeModal.addEventListener("click", handleCloseModal)
        sendButton?.addEventListener("click", sendButtonOnClick)
        this.mapHelpers.displayModal(true, this.dataStorage.isLoggedUser)
    }
     async searchCity (cityParam: string): Promise<void> {
        if (!cityParam) return
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityParam)}&format=json&limit=1`
        const response = await fetch(url)
        const data: Promise<{ lat: string, lon: string }[]> = response.json()
        const dataArr = await data
        if (dataArr.length > 0) {
            const { lat, lon } = dataArr[0]
            this.dataStorage.map?.setView([parseFloat(lat), parseFloat(lon)], 13)
        }
    }
     buttonSettings () :void {
        const inputCity = document.getElementById('cityId') as HTMLInputElement
        const buttons = document.querySelectorAll('.search__container-button') as NodeListOf<HTMLElement>
        const handleSearch = () =>  this.searchCity(inputCity.value.trim())
         buttons.forEach(button => button.addEventListener('click', () => button.dataset.translate === "search" && handleSearch()))
    }

}

class AppInit {
    dataStorage: DataStorage
    mapApi: MapAPI
    legendCreator: LegendCreator
    mapInteraction: MapInteraction
    mapEvents: MapEvents
    constructor() {
        this.dataStorage = new DataStorage()
        this.legendCreator = new LegendCreator(this.dataStorage )
        this.mapApi = new MapAPI(this.dataStorage, this.legendCreator)
        this.mapInteraction = new MapInteraction()
        this.mapEvents = new MapEvents(this.dataStorage)
    }
    async init (): Promise<void> {
        await this.mapApi.init()
        this.legendCreator.addLegend()
        this.mapEvents.buttonSettings()
        this.mapInteraction.toggleScrollWheelZoom(this.dataStorage)
        this.dataStorage.map?.on('contextmenu', event => this.mapEvents.ReserveArea(event))
    }
}

new AppInit().init().then(() => console.log('App initialized')).catch((error) => console.error(error))



interface Elements {
    celsious: number,
    fahrenheit: number
}

class Main {
    constructor() {
        this.appInit()
    }
    changeMenu = (navMenuToggle: HTMLElement) => {

        const navMenu = document.querySelector('ul') as HTMLElement
        const navMenuItems =  document.querySelectorAll('li') as NodeListOf<HTMLElement>
        navMenuToggle.classList.toggle('closeMenu')
        navMenu.classList.toggle('showMenu')
        navMenuItems.forEach(element => element.classList.toggle('showMenu'))
    }
    toggleTemperatureUnit = () => {
        const temperatureElement = document.querySelector(".main-content__temperature") as HTMLElement & Elements
        const temperatureSlider = document.querySelector(".temp-switch__slider") as HTMLElement
        temperatureSlider.classList.toggle("toright")
        temperatureElement.textContent = temperatureSlider.classList.contains("toright") ? `${temperatureElement.fahrenheit} ℉` : `${temperatureElement.celsious}`
    }
    animateContent = () =>  {
        const tableListElements = document.querySelectorAll('.table__list li') as NodeListOf<HTMLElement>
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible')
                    observer.unobserve(entry.target)
                    tableListElements.forEach((element, index) => {
                        if (index > 0) {
                            setTimeout(() => element.classList.add('visible'), index * 400)
                        }
                    })
                }
            })
        })
        observer.observe(tableListElements[0])
    }
    appInit () {
        const navMenuToggle = document.querySelector('.nav__menu-toggle') as HTMLElement
        navMenuToggle.addEventListener('click', () => this.changeMenu(navMenuToggle));
        (document.querySelector("#temp-toggle") as HTMLElement).addEventListener("change", this.toggleTemperatureUnit)
        this.animateContent()
    }
}
new Main()
"use sctrict"
import { searchCity } from "./api.js"
import { mapElement } from "./circleConfig.js"
export const removeAccents = (str) => 
    str.replace( /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g,
         (char) => "acelnoszzACELNOSZZ" ["ąćęłńóśźżĄĆĘŁŃÓŚŹŻ".indexOf(char)])
  export function setCookie(cname, cvalue, exdays) {
        const d = new Date()
        d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000)
        const expires = "expires=" + d.toUTCString()
        document.cookie = cname + "=" + cvalue + "" + expires + "path=/"
        
    }
 export function getCookie(cname) {
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
    export const changeMenu = () => {
            document.querySelector('.nav__menu-toggle').addEventListener('click', () => {
            document.querySelector('.nav__menu-toggle').classList.toggle('closeMenu')
               document.querySelector('ul').classList.toggle('showMenu')
               document.querySelector('li').classList.toggle('showMenu')
           })
    }

   export const celToFhr = () => {
        const temperature = document.querySelector(".main-content__temperature")
        const sliderOne = document.querySelector(".temp-switch__slider")
        sliderOne.classList.toggle("toright")
        if (sliderOne.classList.contains("toright")) {
            temperature.textContent = `${temperature.fahrenheit} ℉`
        } else {
            temperature.textContent = `${temperature.celsious}`
        }
    }
    
 export function animateContent() {
    const olcardsElements = document.querySelectorAll('.table__list li')
    const firstElementObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible')
                observer.unobserve(entry.target)
                setTimeout(() => {
                    olcardsElements.forEach((element, index) => {
                        if (index > 0) {
                            setTimeout(() => {
                                element.classList.add('visible')
                            }, index * 400)
                        }
                    })
                }, 500)
            }
        })
    })
    
    firstElementObserver.observe(olcardsElements[0])
}

export function buttonSettings () {
    const buttons = document.querySelectorAll('.search__container-button')
    const inputCity = document.getElementById('cityId')
    if (inputCity) {
        inputCity.addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                searchCity()
            }
        })
    }
    buttons.forEach((element) => {
        const buttonSet = element.dataset.translate
        element.addEventListener('click', () => {
            if (buttonSet === "search")  {
                searchCity()
            }
        })
    })
}

const toggleVisibility = (isVisible) => {
    const notificationBox = document.querySelector('.notification')
    notificationBox.style.display = isVisible ? 'flex' : 'none'
    notificationBox.style.visibility = isVisible ? 'visible' : 'hidden'
    notificationBox.style.opacity = isVisible ? '1' : '0'
}

export function showNotification (e) {
   const closeButton = document.querySelector('.notification__button')
    closeButton.addEventListener('click', e => {
        if (e.target === closeButton) {
            toggleVisibility(false)
            console.log("clicked")
        }
    })
        toggleVisibility(true)
        setTimeout(function () {
            toggleVisibility(false)
        }, 5000)

}

export const displayModal = (show) => {
    const bodyElement = document.body
    const modalWindow = document.querySelector(".modal")

    if (show) {
        bodyElement.classList.add("bodyoverflow")
        modalWindow.classList.add("modal--active")
    } else {
        bodyElement.classList.remove("bodyoverflow")
        modalWindow.classList.remove("modal--active")
    }
}


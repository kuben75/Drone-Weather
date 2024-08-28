"use strict"
import {zoneData, isLoggedUser} from "./api.js"
import { map } from "./map.js"
import { showNotification, displayModal} from "./utils.js"
import {currentLanguage} from "./main.js"
import {info} from "./map_config.js";

export const mapElement = document.querySelector('#map')
const errorMessage = document.querySelector(".modal__error-text")
let d = true
export function enableScrollWheelZoom() {
        mapElement.addEventListener('click',  () => {
            if (d) {
                map.scrollWheelZoom.enable()
                mapElement.focus()
                mapElement.classList.add('map-scroll-active')
                mapElement.classList.remove('map-scroll-inactive')
                d = false
                console.log("enableScrollWheelZoom: ", d)
            }
        })
}
export function disableScrollWheelZoom() {
        mapElement.addEventListener("mouseleave", () => {
            if(!d) {
                map.scrollWheelZoom.disable()
                mapElement.classList.remove('map-scroll-active')
                mapElement.classList.add('map-scroll-inactive')
                d = true
                console.log("disableScrollWheelZoom: ", d)
            }
        })
}

function saveCircle(newCircle, formData) {
    formData.append('lat', newCircle.lat)
    formData.append('lng', newCircle.lng)

    return fetch('./php/db/save_coords.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            lat: newCircle.lat,
            lng: newCircle.lng,
            formData: Object.fromEntries(formData.entries())
        })
    })
        .then(response => response.text())
        .then(text => {
            try {
                const data = JSON.parse(text)
                console.log(data)
                if (data.error) {
                    errorMessage.textContent = data.error
                    console.log(data.error)
                    return false
                } else {
                    errorMessage.textContent = ''
                    return true
                }
            } catch (error) {
                console.error('Błąd:', error)
                return false
            }
        })
        .catch(error => {
            console.error('Błąd:', error)
            return false
        })
}
export async function reserveArea(target, lang = currentLanguage) {
    const closeModal = document.querySelector(".modal__close-btn")
    const sendButton = document.querySelector(".modal__submit-btn")
    if (!isLoggedUser) {
        const modalError = document.querySelector('.modal__error')
        modalError.classList.add("modal--active")
        closeModal.addEventListener('click', () => {
            modalError.classList.remove("modal--active")
        })
    } else {
        displayModal(true)
        document.addEventListener("click", async (e) => {
            if (e.target === sendButton) {
                e.preventDefault()
                const latlng = target.latlng
                const newCircle = {
                    lat: latlng.lat,
                    lng: latlng.lng,
                }
                const formElement = document.querySelector(".modal__form")
                const formData = new FormData(formElement)
                const response = await saveCircle(newCircle, formData)
                if (!response) {
                } else {
                    errorMessage.textContent = ''
                    window.currentCircle = L.circle([latlng.lat, latlng.lng], {
                        color: 'green',
                        fillColor: 'green',
                        fillOpacity: 0.3,
                        radius: 1500
                    }).addTo(map)
                    map.setView([latlng.lat, latlng.lng], 13)
                    displayModal(false)
                    showNotification(e)
                }
            } else if (e.target === closeModal) {
                displayModal(false)
                errorMessage.textContent = ""
            }
        })
    }
}

export function addCircles(map) {
    zoneData.circleData.forEach(function(param) {
        L.circle([param.lat, param.lng], {
            color: param.color,
            fillColor: param.fillColor,
            fillOpacity: param.fillOpacity,
            radius: param.radius
        }).addTo(map)
    })
    zoneData.userCircleData.forEach((param, index) => {
    let circleObject  = L.circle([param.lat, param.lng], {
            color: param.user_color,
            fillColor: param.user_fillColor,
            fillOpacity: param.user_fillOpacity,
            radius: param.radius
        }).addTo(map)
        circleObject.on('mouseover', () => {
            info.update({
                name: zoneData.userCircleData[index]?.drone || '',
                reserve: zoneData.userCircleData[index]?.reserve || ''
            })
        })
        circleObject.on('mouseout', () => {
            info.update()
        })
    })
    zoneData.otherCircleData.forEach((param, index) => {
       let otherUserCircle = L.circle([param.lat, param.lng], {
            color: param.color,
            fillColor: param.fillColor,
            fillOpacity: param.fillOpacity,
            radius: param.radius
        }).addTo(map)
        otherUserCircle.on('mouseover', () => {
            info.update({
                name: ' ',
                reserve: zoneData.otherCircleData[index]?.reserve || ''
            })
        })
        otherUserCircle.on('mouseout', () => {
            info.update()
        })
    })
}
/*
const zip = (...arr) => {
    return Array.from({
        length: Math.max(...arr.map(a => a.length)),
    }, (_, i) => arr.map(a => a[i]))
}

export function addCircles(map) {
    zip(zoneData.circleData, zoneData.userCircleData, zoneData.otherCircleData).forEach(([param, index]) => {
        circleObject = L.circle([param.lat, param.lng], {
            color: param.color || param.user_color,
            fillColor: param.color || param.user_color,
            fillOpacity: param.fillOpacity || param.user_fillOpacity,
            radius: param.radius
        }).addTo(map)
        circleObject.on('mouseover', () => {
            info.update({
                name: zoneData.userCircleData[index]?.drone || zoneData.otherCircleData[index]?.drone || '',
                reserve: zoneData.userCircleData[index]?.reserve || zoneData.otherCircleData[index]?.reserve || ''
            })
        })
        circleObject.on('mouseout', () => {
            info.update()
        })
    })

}
 */
"use strict";
import { zoneData } from "./api.js";
import { map } from "./map.js";
import { areCirclesColliding } from "./utils.js";
export const mapElement = document.querySelector('#map')

export function enableScrollWheelZoom() {
    map.scrollWheelZoom.enable()
    mapElement.classList.add('map-scroll-active')
    mapElement.classList.remove('map-scroll-inactive')
}
export function disableScrollWheelZoom() {
    map.scrollWheelZoom.disable()
    mapElement.classList.remove('map-scroll-active')
    mapElement.classList.add('map-scroll-inactive')
}
map.on('click', function() {
    enableScrollWheelZoom()
    mapElement.focus()
})

export function reserveArea (e) {
    const warningText = document.querySelector('.map__warning-text')
    const latlng = e.latlng
    const newCircle = {
        lat: latlng.lat,
        lng: latlng.lng,
        radius: 1500
    }
    const collides = zoneData.circleData.some(circle => areCirclesColliding(newCircle, circle))
    if (collides) {
        warningText.textContent = "Nie można rezerwować obszaru przy lotnisku"
    } else {
        warningText.textContent = ""
        if (window.currentCircle) {
            window.currentCircle.remove()
        }
        window.currentCircle = L.circle([latlng.lat, latlng.lng], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.3,
            radius: 1500
        }).addTo(map)
        map.setView([latlng.lat, latlng.lng], 13)
        localStorage.setItem('circleCoords', JSON.stringify({
            lat: latlng.lat,
            lon: latlng.lng
        }))
    }
}
export function addCircles(map) {
    zoneData.circleData.forEach(function(circleInfo) {
        var circle = L.circle([circleInfo.lat, circleInfo.lng], {
            color: circleInfo.color,
            fillColor: circleInfo.fillColor,
            fillOpacity: circleInfo.fillOpacity,
            radius: circleInfo.radius
        }).addTo(map)
    })
}

export function drawSavedCircle() {
    const savedCoords = localStorage.getItem('circleCoords')
    if (savedCoords) {
        const { lat, lon } = JSON.parse(savedCoords)
        window.currentCircle = L.circle([lat, lon], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.3,
            radius: 1500
        }).addTo(map)
        map.setView([lat, lon], 13)
    }
}

export function removeCircle() {
    if (window.currentCircle) {
        window.currentCircle.remove()
        localStorage.removeItem('circleCoords')
    }
}


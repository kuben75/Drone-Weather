const map = L.map("map").setView([52.42036626625626, 16.911187840699196], 9)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    scrollWheelZoom: false,
    attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)

const mapElement = document.querySelector('#map')
let zoneData = []
const warningText = document.querySelector('.map__warning-text');

function enableScrollWheelZoom() {
    map.scrollWheelZoom.enable()
    mapElement.classList.add('map-scroll-active')
    mapElement.classList.remove('map-scroll-inactive')
}

function disableScrollWheelZoom() {
    map.scrollWheelZoom.disable()
    mapElement.classList.remove('map-scroll-active')
    mapElement.classList.add('map-scroll-inactive')
}

map.on('click', function() {
    enableScrollWheelZoom()
    mapElement.focus()
})

mapElement.addEventListener('mouseleave', disableScrollWheelZoom)

window.onload = function() {
    disableScrollWheelZoom()
}

const loadZoneData = () => {
    return fetch('./json/zoneData.json')
        .then(response => response.json())
        .then(data => {
            zoneData = data
            const styleOne = {
                color: "blue",
                weight: 5,
                opacity: 0.65
            }
            L.geoJSON(zoneData.myLines, {
                style: styleOne
            }).addTo(map)
            addCircles(map)
        })
        .catch(error => console.error('Błąd ładowania danych pogodowych:', error))
}

function addCircles(map) {
    zoneData.circleData.forEach(function(circleInfo) {
        var circle = L.circle([circleInfo.lat, circleInfo.lng], {
            color: circleInfo.color,
            fillColor: circleInfo.fillColor,
            fillOpacity: circleInfo.fillOpacity,
            radius: circleInfo.radius
        }).addTo(map)
    })
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
    return distance * 1000
}

function areCirclesColliding(circle1, circle2) {
    const distance = haversineDistance(circle1.lat, circle1.lng, circle2.lat, circle2.lng)
    return distance < (circle1.radius + circle2.radius)
}

function searchCity() {
    const cityParam = document.getElementById('cityId').value.trim()
    if (cityParam) {
        const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityParam)}&format=json&limit=1`

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = parseFloat(data[0].lat)
                    const lon = parseFloat(data[0].lon)
                    const newCircle = {
                        lat: lat,
                        lng: lon,
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
                        window.currentCircle = L.circle([lat, lon], {
                            color: 'green',
                            fillColor: 'green',
                            fillOpacity: 0.3,
                            radius: 1500
                        }).addTo(map)

                        map.setView([lat, lon], 13)
                        localStorage.setItem('circleCoords', JSON.stringify({
                            lat: lat,
                            lon: lon
                        }))
                    }
                } else {
                    console.log('Miasto nie zostało znalezione')
                }
            })
            .catch(error => {
                console.error('Błąd:', error)
         })
    }}

function drawSavedCircle() {
    const savedCoords = localStorage.getItem('circleCoords')
    if (savedCoords) {
        const {
            lat,
            lon
        } = JSON.parse(savedCoords)
        window.currentCircle = L.circle([lat, lon], {
            color: 'green',
            fillColor: 'green',
            fillOpacity: 0.3,
            radius: 2000
        }).addTo(map)
        map.setView([lat, lon], 13)
    }
}

function removeCircle() {
    if (window.currentCircle) {
        window.currentCircle.remove()
        localStorage.removeItem('circleCoords')
    } else {
        console.log("Nie ma okręgów do usunięcia")
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.search__container-button')
    buttons.forEach((button) => {
        const buttonSet = button.dataset.translate
        button.addEventListener('click', () => {
            if (buttonSet == "search") {
                searchCity()
            } else if (buttonSet == "remove") {
                removeCircle()
            }
        })
    })
    loadZoneData()
    drawSavedCircle()
})
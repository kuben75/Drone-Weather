const map = L.map("map").setView([52.42036626625626, 16.911187840699196], 9)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  scrollWheelZoom: false,
  attribution:
    '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)
const mapElement = document.querySelector('#map')

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
let zoneData =[]
const loadZoneData = () => {
  return fetch('http://localhost/nauka/json/zoneData.json')
    .then(response => response.json())
    .then(data => {
      zoneData = data;
    })
    .catch(error => console.error('Error loading weather data:', error));
}
const styleOne = {
  "color": "blue",
  "weight": 5,
  "opacity": 0.65
}
L.geoJSON(zoneData.myLines, {
  style: styleOne
}).addTo(map)

function addCircles(map) {
  circleData.forEach(function(data) {
    var circle = L.circle([zoneData.circleData.lat, zoneData.circleData.lng], {
      color: zoneData.circleData.color,
      fillColor: zoneData.circleData.fillColor,
      fillOpacity: zoneData.circleData.fillOpacity,
      radius: zoneData.circleData.radius
    }).addTo(map)
  })
}
addCircles(map)

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
const warningText = document.querySelector('.map__warning-text')
function searchCity() {
  const cityParam = document.getElementById('cityId').value.trim()
  if (cityParam) {
    const url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityParam)}&format=json&limit=1`

    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(zoneData.circleData)
        if (zoneData.circleData.length > 0) {
          const lat = parseFloat(zoneData.circleData[0].lat)
          const lon = parseFloat(zoneData.circleData[0].lon)
          const newCircle = { lat: lat, lng: lon, radius: 1500 }

          const collides = circleData.some(airport => areCirclesColliding(newCircle, airport))
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
            localStorage.setItem('circleCoords', JSON.stringify({ lat: lat, lon: lon }))
          }
        } else {
          console.log('Miasto nie zostało znalezione')
        }
      })
      .catch(error => {
        console.error('error:', error)
      })
  }
}

function drawSavedCircle() {
  const savedCoords = localStorage.getItem('circleCoords')
  if (savedCoords) {
    const { lat, lon } = JSON.parse(savedCoords)
    window.currentCircle = L.circle([lat, lon], {
      color: 'green',
      fillColor: 'green',
      fillOpacity: 0.3,
      radius: 2000
    }).addTo(map)
    map.setView([lat, lon], 13)
  }
}

drawSavedCircle()

function removeCircle() {
  if (window.currentCircle) {
    window.currentCircle.remove()
    localStorage.removeItem('circleCoords')
  } else {
    console.log("Nie ma okręgów do usunięcia")
  }
}

const remButton = document.querySelector('.search__container-button--remove')
remButton.addEventListener('click', removeCircle)

document.getElementById('cityId').addEventListener('change', searchCity)
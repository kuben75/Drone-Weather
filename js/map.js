"use strict";
import { loadZoneData } from "./api.js";
import { reserveArea, drawSavedCircle, disableScrollWheelZoom } from "./circleConfig.js";
import { buttonSettings } from "./utils.js";
export const map = L.map("map").setView([52.42036626625626, 16.911187840699196], 9)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    scrollWheelZoom: false,
    attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)
map.on('contextmenu', reserveArea)

document.addEventListener("DOMContentLoaded", () => {
    loadZoneData()
    drawSavedCircle()
    buttonSettings()
    disableScrollWheelZoom()
})
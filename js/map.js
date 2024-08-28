"use strict";
import {getVariable, loadZoneData} from "./api.js";
import {reserveArea, disableScrollWheelZoom, enableScrollWheelZoom} from "./circleConfig.js";
import { buttonSettings } from "./utils.js";
export const map = L.map("map").setView([52.42036626625626, 16.911187840699196], 9)
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    scrollWheelZoom: false,
    attribution: '&copy <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map)
document.addEventListener("DOMContentLoaded", () => {
    loadZoneData()
    getVariable()
    buttonSettings()
    enableScrollWheelZoom()
    disableScrollWheelZoom()
    map.on('contextmenu', reserveArea)
})


"use strict";
import {map} from "./map.js"

export const info = L.control()
info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info')
    this.update();
    return this._div;
}
info.update = function (props) {
    const contents = props
        ? `<b>Nazwa: ${props.name}</b><br />Data rezerwacji: ${props.reserve}` : '<span class="empty">Najedź myszką na element</span>'
    this._div.innerHTML = `<h4>Informacje o dronach</h4>${contents}`
}
info.addTo(map);

const legend = L.control({position: 'bottomright'})
legend.onAdd =  function () {
    let div = L.DomUtil.create("div", "legend")
    div.innerHTML += "<h4>Oznaczenia na mapie</h4>"
    div.innerHTML += '<i style="background: #448D40"></i><span>Twoje zarezerwowane obszary</span><br>'
    div.innerHTML += '<i style="background: blue"></i><span>Obszary innych użytkowników</span><br>'
    div.innerHTML += '<i style="background: #F03"></i><span>Lotniska</span><br>'
    return div
}
legend.addTo(map);
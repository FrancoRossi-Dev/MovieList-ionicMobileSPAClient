import { getLocation, getUsersByCountry } from '../services/geolocationService.js';
import { countryCoords } from '../shared/constants.js';

let map;

export function getMap() {
  return map;
}

export async function renderMap() {
  const data = await getUsersByCountry();
  const paises = data.paises;
  paises.sort((a, b) => b.cantidadDeUsuarios - a.cantidadDeUsuarios);

  setTimeout(() => {
    drawMap(paises);
  }, 200);
}

export async function drawMap(paises) {
  if (map) {
    map.remove();
  }
  const location = await getLocation();

  map = L.map('map').setView([location.lat, location.lng], 2);

  // open street map tilelayer
  //   L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   maxZoom: 19,
  //   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  // }).addTo(map);

  // carto cdn
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    subdomains: 'abcd',
  }).addTo(map);

  for (let i = 0; i < 10; i++) {
    addMarker(paises[i], i);
  }
}

export async function addMarker(pais, rank = 0) {
  const coords = countryCoords[pais.nombre];
  if (!coords) return;

  const isTop = rank === 0;
  const size = isTop ? [38, 95] : [24, 60];
  const anchor = isTop ? [22, 94] : [14, 59];
  const popup = isTop ? [-3, -76] : [-3, -50];

  var myIcon = L.icon({
    iconUrl: '../../assets/map_icon.svg',
    iconSize: size,
    iconAnchor: anchor,
    popupAnchor: popup,
  });

  const popupContent = `
    <div class="ml-popup-inner">
      <div class="ml-popup-title">${pais.nombre}</div>
      <div class="ml-popup-sub">
        ${pais.cantidadDeUsuarios} usuarios
        ${rank < 3 ? `<span class="ml-popup-rank">#${rank + 1}</span>` : ''}
      </div>
    </div>
  `;

  L.marker(coords, { icon: myIcon })
    .bindPopup(
      L.popup({ className: 'ml-popup', closeButton: false, offset: [0, -6] }).setContent(
        popupContent,
      ),
    )
    .addTo(map);
}

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

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  for (let i = 0; i < 10; i++) {
    addMarker(paises[i]);
  }
}

export async function addMarker(pais) {
  const coords = countryCoords[pais.nombre];
  L.marker(coords).bindPopup(`${pais.nombre}: ${pais.cantidadDeUsuarios} usuarios`).addTo(map);
}

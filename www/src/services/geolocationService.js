import { API_URL } from '../shared/constants.js';
import { fetchMovieApi, loadToken } from '../shared/utils.js';

let location = [];

export async function getCountries() {
  const data = fetchMovieApi('/paises', 'GET');
  return data;
}

export async function getLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        resolve(coords);
      },
      (error) => {
        reject(error);
      },
    );
  });
}

export async function getUsersByCountry() {
  const token = loadToken();
  const headers = { Authorization: `Bearer ${token}` };
  const data = await fetchMovieApi('/usuariosPorPais', 'GET', { headers });
  return data;
}

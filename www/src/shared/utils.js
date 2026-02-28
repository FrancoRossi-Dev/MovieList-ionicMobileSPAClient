import { API_URL } from './constants.js';

export function saveToken(token) {
  localStorage.setItem('movieListToken', JSON.stringify(token));
}
export function checkToken() {
  const token = loadToken();
  return token != null;
}
export function loadToken() {
  const token = localStorage.getItem('movieListToken');
  return JSON.parse(token);
}

export function clearToken() {
  localStorage.removeItem('movieListToken');
}

export async function fetchMovieApi(endpoint, method = 'GET', args = {}) {
  const res = await fetch(API_URL + endpoint, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...(args.headers || {}),
    },
    body: args.body ? JSON.stringify(args.body) : undefined,
  });

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('No esta autorizado');
    }

    try {
      const data = await res.json();
      throw new Error(data.mensaje);
    } catch (e) {
      throw new Error(`error ${res.status}: ${res.statusText}`);
    }
  }

  const data = await res.json();
  return data;
}

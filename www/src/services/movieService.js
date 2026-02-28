import { fetchMovieApi, loadToken } from '../shared/utils.js';

export async function getMovies() {
  const token = loadToken();
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const data = await fetchMovieApi('/peliculas', 'GET', { headers });
  return data;
}
export async function addMovie(movie) {
  const token = loadToken();
  const headers = { Authorization: `Bearer ${token}` };
  const body = movie;
  const data = await fetchMovieApi('/peliculas', 'POST', { headers, body });

  return data;
}

export async function deleteMovie(movieId) {
  const token = loadToken();
  const headers = { Authorization: `Bearer ${token}` };
  const res = await fetchMovieApi(`/peliculas/${movieId}`, 'DELETE', { headers });
}

export async function getCategories() {
  const token = loadToken();
  if (!token) throw new Error('Usuario desconocido');

  const data = await fetchMovieApi('/categorias', 'GET', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
}

export async function sentimentAnalysis(prompt) {
  const body = {
    prompt: prompt,
  };
  const data = await fetchMovieApi('/genai', 'POST', { body });
  return data;
}

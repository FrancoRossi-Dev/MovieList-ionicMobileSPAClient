import { clearToken, fetchMovieApi, saveToken } from '../shared/utils.js';

export async function SignUp(userData) {
  const data = await fetchMovieApi('/usuarios', 'POST', { body: userData });
  return data;
}

export async function Login(userData) {
  console.log(userData);
  const data = await fetchMovieApi('/login', 'POST', { body: userData });
  saveToken(data.token);
  return data;
}

export async function Logout() {
  clearToken();
}

import { Login, Logout, SignUp } from '../services/userService.js';
import { clearInputs, toast } from '../ui/ui.js';
import { navigateTo } from './router.js';

export async function handleLogin(e) {
  try {
    const usuario = document.querySelector('#login-usuario').value;
    const password = document.querySelector('#login-password').value;

    if (!usuario || !password) {
      throw new Error('Campos vacios');
    }
    const credentials = {
      usuario,
      password,
    };
    await Login(credentials);
    clearInputs('#loginForm');
    document.querySelector('.user-name').textContent = usuario;
    navigateTo('home');
  } catch (error) {
    await toast(error.message, 'warning');
  }

  // todo validar
}

export async function handleSignup(e) {
  try {
    const usuario = document.querySelector('#signup-usuario').value;
    const password = document.querySelector('#signup-password').value;
    const idPais = document.querySelector('#signup-pais').value;

    if (!usuario || !password || !idPais) throw new Error('Campos vacios');

    const data = { usuario, password, idPais };
    console.log(data);

    await SignUp(data);

    clearInputs('#signupForm');
    await Login({ usuario, password });
  } catch (error) {
    console.log('fail');
    console.log(error.message);
  }
}

export function handleLogout() {
  // todo modal
  Logout();
  navigateTo('login');
}

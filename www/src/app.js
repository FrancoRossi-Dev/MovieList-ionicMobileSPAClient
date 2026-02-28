import { addRouter, navigateTo } from './handlers/router.js';
import { deleteMovie } from './services/movieService.js';
import { checkToken, clearToken } from './shared/utils.js';
import { addEventListeners, appLoaded, initUi, toast } from './ui/ui.js';

await init();

async function init() {
  initUi();
  addRouter();
  addEventListeners();

  try {
    if (!checkToken()) throw new Error('usuario desconocido');
    await navigateTo('home');
  } catch (error) {
    if (error.message === 'No esta autorizado') {
      toast('Su sesion ha caducado, porfavor ingrese nuevamente', 'danger');
      clearToken();
    }
    await navigateTo('login');
  }

  appLoaded(true);
}

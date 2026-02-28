import { appLoaded, displayTabBar } from '../ui/ui.js';
import { renderAddMovie } from '../ui/uiAddMovie.js';
import { renderEstadisticas } from '../ui/uiEstadisticas.js';
import { renderMap } from '../ui/uiMap.js';
import { renderMovies } from '../ui/uiMovies.js';
import { renderSignup } from '../ui/uiSignup.js';
let tabs = document.getElementById('mainTabs');
let navHistory = [];

export function addRouter() {
  // tabs = document.getElementById('mainTabs');

  const buttons = document.querySelectorAll('ion-tab-button');
  buttons.forEach((btn) => {
    btn.addEventListener('click', handleTabClick);
  });
  document.querySelector('#fab-agregar').addEventListener('click', () => {
    navigateTo('addMovie');
  });
}

async function handleTabClick(e) {
  const destination = e.currentTarget.getAttribute('tab');
  await navigateTo(destination);
}

export async function navigateTo(destination) {
  appLoaded(false);
  const doesntHasTabBar = ['login', 'signup'];
  displayTabBar(!doesntHasTabBar.includes(destination));

  //todo expand
  switch (destination) {
    case 'login':
      break;
    case 'signup':
      await renderSignup();
      break;
    case 'home':
      await renderMovies();
      break;
    case 'addMovie':
      await renderAddMovie();
      break;
    case 'estadisticas':
      await renderEstadisticas();
      break;
    case 'mapa':
      await renderMap();
      break;
    default:
      break;
  }

  tabs.select(destination);
  navHistory.push(destination);
  appLoaded(true);
}

export async function navigateBack() {
  navHistory.pop();
  if (navHistory.length === 0) return;
  const prevDestination = navHistory[navHistory.length - 1];
  navHistory.pop();
  await navigateTo(prevDestination);
}

export async function handleNavigate(destiny) {
  await navigateTo(destiny);
}

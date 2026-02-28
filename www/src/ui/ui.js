import { handleMovieDateFilter, handleSubmitMovie } from '../handlers/movieHandlers.js';
import { handleNavigate } from '../handlers/router.js';
import { handleLogin, handleLogout, handleSignup } from '../handlers/userHandlers.js';
import { routes } from '../shared/constants.js';

const tabsMenu = document.querySelector('#tabsMenu');
const menu = document.querySelector('ion-menu');
const fabBtn = document.querySelector('.fab-container');

export function initUi() {
  populateTabBar();
}

export function populateTabBar() {
  let tabsMenu = document.querySelector('#tabsMenu');

  let tabsHTML = '';
  routes.forEach((r) => {
    tabsHTML += `
      <ion-tab-button id=${r.route} tab=${r.route}>
        <ion-icon name=${r.icon}></ion-icon>
        <ion-label>${r.label}</ion-label>
      </ion-tab-button>
    `;
  });
  tabsMenu.innerHTML = tabsHTML;
}

export function displayTabBar(state) {
  if (state) {
    tabsMenu.style.display = 'flex';
    fabBtn.style.display = 'block';
    menu.disabled = false;
  } else {
    tabsMenu.style.display = 'none';
    fabBtn.style.display = 'none';
    menu.disabled = true;
  }
}

export function addEventListeners() {
  // user btn
  document.getElementById('loginBtn').addEventListener('click', handleLogin); // login
  document.getElementById('signupBtn').addEventListener('click', handleSignup); // signup
  document.getElementById('logout-btn').addEventListener('click', handleLogout); // logout

  // movie btn
  document.getElementById('addMovie-submit').addEventListener('click', handleSubmitMovie); // add movie

  // navigation
  document.querySelectorAll('.navigator').forEach((el) => {
    el.addEventListener('click', () => handleNavigate(el.dataset.destiny));
  });

  // movieFilter
  document.querySelector('#movieDateFilter').addEventListener('ionChange', handleMovieDateFilter);
}

export async function toast(msg, status, duration = 5000) {
  const statusStyles = ['danger', 'warning', 'success', 'primary'];

  if (!statusStyles.includes(status)) {
    status = 'primary';
  }

  const toastEl = document.createElement('ion-toast');
  toastEl.message = msg;
  toastEl.color = status;
  toastEl.duration = duration;
  toastEl.position = 'top';

  document.body.appendChild(toastEl);
  await toastEl.present();
}

export function appLoaded(loaded) {
  if (loaded) {
    document.querySelector('.app').classList.remove('hidden');
    document.querySelector('.spinner-container').classList.add('hidden');
  } else {
    document.querySelector('.app').classList.add('hidden');
    document.querySelector('.spinner-container').classList.remove('hidden');
  }
}

export function clearInputs(parent) {
  const inputArr = document.querySelectorAll(
    `${parent} ion-input,
    ${parent} ion-select,
    ${parent} ion-textarea`,
  );
  inputArr.forEach((el) => {
    el.value = '';
  });
}

export async function confirmSheet(cb) {
  const sheet = document.querySelector('#confirmSheet');
  sheet.header = '¿Esta seguro que desea borrar esta reseña?';
  sheet.buttons = [
    {
      text: 'Borrar reseña',
      role: 'destructive',
      cssClass: 'ion-color-danger',
      data: {
        action: 'delete',
      },
    },
    {
      text: 'Cancel',
      role: 'cancel',
      data: {
        action: 'cancel',
      },
    },
  ];

  await sheet.present();

  const result = await sheet.onDidDismiss();

  if (result.data?.action === 'delete') {
    cb();
  }
}

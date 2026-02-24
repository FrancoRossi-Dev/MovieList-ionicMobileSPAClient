import { getCountries } from '../services/geolocationService.js';

export async function renderSignup() {
  const paises = await getCountries();
  populateCountrySelector(paises.paises);
}

const populateCountrySelector = (paises) => {
  let signupInnerHtml = '';

  paises.forEach((p) => {
    signupInnerHtml += optionHTML(p);
  });

  document.querySelector('#signup-pais').innerHTML = signupInnerHtml;
};

function optionHTML(p) {
  return `<ion-select-option value=${p.id}>${p.nombre}</ion-select-option>`;
}

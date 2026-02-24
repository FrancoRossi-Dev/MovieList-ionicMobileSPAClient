import { getCategories } from '../services/movieService.js';

export async function renderAddMovie() {
  // get categories
  let categorias = '';
  const data = await getCategories();

  data.categorias.forEach((c) => {
    categorias += optionHTML(c);
  });

  document.querySelector('#addMovie-categoria').innerHTML = categorias;
}

function optionHTML(c) {
  return `<ion-select-option value=${c.id}>${c.nombre}</ion-select-option>`;
}

0;

// {id: 1, nombre: 'Acción', edad_requerida: 13, estado: 'Activo', emoji: '🔫'}

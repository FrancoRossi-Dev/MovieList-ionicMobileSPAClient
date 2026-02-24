import { addDeleteHandlers, handleDeleteMovie } from '../handlers/movieHandlers.js';
import { getCategories, getMovies } from '../services/movieService.js';

export async function renderMovies() {
  const data = await getMovies();
  const movies = data.peliculas;
  const content = document.querySelector('#home .movieTable');

  movies.sort((a, b) => new Date(b.fechaEstreno) - new Date(a.fechaEstreno));
  let movieTable = '';
  let { categorias } = await getCategories();

  movies.forEach((m) => {
    const categoria = categorias.find((c) => c.id === m.idCategoria);
    movieTable += movieRow(m, categoria);
  });
  content.innerHTML = movieTable;
  addDeleteHandlers();

  filterMovies('semana');
  checkIfThereAreMovies();
}

export function checkIfThereAreMovies() {
  const movieTable = document.querySelector('#home .movieTable');
  const hasMovies = movieTable.children.length > 0;
  const msg = document.querySelector('#emptyMessage');
  if (!hasMovies) {
    msg.style.display = 'block';
    msg.textContent = 'No hay peliculas en tu lista';
  } else {
    msg.textContent = 'No hay reseñas en este periodo de tiempo';
  }
  return hasMovies;
}

export function filterMovies(option) {
  const options = ['semana', 'mes', 'todo'];
  if (!options.includes(option)) throw new Error('Ha suciedido un error, argumento invalido');

  const movieArr = document.querySelectorAll('.movieRow');
  const hoy = Date.now();

  const filters = {
    semana: 7 * 24 * 60 * 60 * 1000,
    mes: 30 * 24 * 60 * 60 * 1000,
    todo: Infinity,
  };
  const threshold = filters[option];

  let visibleCounter = 0;
  movieArr.forEach((node) => {
    const movieDate = new Date(node.dataset.date);
    const dateDiff = hoy - movieDate;
    if (dateDiff <= threshold) {
      node.style.display = 'grid';
      visibleCounter++;
    } else {
      node.style.display = 'none';
    }
  });

  const msg = document.querySelector('#emptyMessage');
  if (visibleCounter === 0) {
    msg.style.display = 'block';
  } else {
    msg.style.display = 'none';
  }
}

// aux
function movieRow(m, categoria) {
  if (!m || !categoria) return '';
  return `   
      <ion-grid class="movieRow" data-date='${m.fechaEstreno}'>
        <ion-row class='tableMovieName'> 
          ${m.nombre}
        </ion-row>
        <ion-row class='tableMovieDescription'>
          <ion-col>${categoria.emoji} ${categoria.nombre}</ion-col>
          <ion-col><ion-icon name="calendar"></ion-icon> ${m.fechaEstreno}</ion-col>
          <ion-col class="deleteMovieBtn" size="auto" data-id="${m.id}"><ion-icon name="trash"></ion-icon></ion-col>
        </ion-row>
      </ion-grid>`;
}

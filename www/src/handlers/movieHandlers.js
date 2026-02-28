import { addMovie, deleteMovie, sentimentAnalysis } from '../services/movieService.js';
import { clearInputs, confirmSheet, toast } from '../ui/ui.js';
import { checkIfThereAreMovies, filterMovies } from '../ui/uiMovies.js';
import { navigateBack } from './router.js';

export async function handleSubmitMovie() {
  try {
    const nombre = document.querySelector('#addMovie-nombre').value;
    const review = document.querySelector('#addMovie-review').value;
    const idCategoria = document.querySelector('#addMovie-categoria').value;
    const fecha = document.querySelector('#addMovie-fecha').value;
    if (!nombre || !review || !idCategoria || !fecha)
      throw new Error('Todos los campos deben estar rellenos');

    if (new Date(fecha) > Date.now())
      throw new Error('No puede ingresar una fecha que aun no ha ocurrido');

    const sentiment = await sentimentAnalysis(review);
    if (sentiment.sentiment === 'Negativo') {
      toast('Pelicula no registrada: ' + sentiment.comment, 'danger');
      return;
    }
    const movie = {
      idCategoria,
      nombre,
      fecha,
    };

    const res = await addMovie(movie);
    if (res.codigo == 200) {
      clearInputs('#addMovieForm');
      toast(res.mensaje, 'success');
      await navigateBack();
    }
  } catch (error) {
    toast(error.message, 'warning');
  }
}

export async function handleDeleteMovie(btn) {
  if (!btn) return;

  const id = btn.dataset.id;
  const row = btn.closest('.movieRow');

  if (!id || !row) {
    toast('Error al identificar la película', 'danger');
    return;
  }

  confirmSheet(async () => {
    try {
      await deleteMovie(id);
      row.remove();
      toast('Película borrada', 'success');
    } catch (error) {
      toast('Error al borrar la película, intente mas tarde', 'danger');
    }
    checkIfThereAreMovies();
  });
}

export function addDeleteHandlers() {
  document.querySelectorAll('.deleteMovieBtn').forEach((btn) => {
    btn.addEventListener('click', () => {
      handleDeleteMovie(btn);
    });
  });
}

export async function handleMovieDateFilter(e) {
  filterMovies(e.detail.value);
}

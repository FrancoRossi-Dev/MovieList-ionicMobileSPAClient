import { getCategories, getMovies } from '../services/movieService.js';

let categoriasChart = null;
let edadChart = null;

export async function renderEstadisticas() {
  const categoriaStatsContainer = document.querySelector('.categoriaStatsContainer');
  const edadPorcentajeContainer = document.querySelector('.edadPorcentajeContainer');
  const data = await getMovies();
  const movies = data.peliculas;

  if (movies.length === 0) {
    edadPorcentajeContainer.textContent = 'no hay pelis';
    return;
  }

  const categorias = await getCategories();
  const movieStats = [];
  const ageStats = {
    mayores: 0,
    todoPublico: 0,
  };

  movies.forEach((m) => {
    const categoria = categorias.categorias.find((cat) => cat.id == m.idCategoria);
    const movie = movieStats.find((movie) => movie.categoria == categoria.nombre);

    movie ? movie.qty++ : movieStats.push({ categoria: categoria.nombre, qty: 1 });
    categoria.edad_requerida > 12 ? ageStats.mayores++ : ageStats.todoPublico++;
  });

  const distinctCategories = [...new Set(movies.map((m) => m.idCategoria))].length;

  if (distinctCategories >= 3) {
    CatogriasRadarChart(movieStats);
  } else {
    CatogriasPieChart(movieStats);
  }

  EdadPieChart(ageStats);

  let categoriaStatsHtml = '';
  movieStats.forEach((m) => {
    categoriaStatsHtml += `<p>${m.categoria} : ${m.qty}</p>`;
  });
  categoriaStatsContainer.innerHTML = categoriaStatsHtml;

  const total = Number(ageStats.mayores) + Number(ageStats.todoPublico);
  const porcentage = {
    mayores: Math.round((Number(ageStats.mayores) / total) * 100),
    todoPublico: Math.round((Number(ageStats.todoPublico) / total) * 100),
  };
  const edadPorcentajeHtml = `
     <li>Apto para todo publico: ${porcentage.todoPublico}%</li>
     <li>Apto solo para mayores: ${porcentage.mayores}%</li>
     `;
  edadPorcentajeContainer.innerHTML = edadPorcentajeHtml;
}

export function CatogriasRadarChart(stats) {
  const radarChartCanvas = document.querySelector('#categoriasChart');

  if (categoriasChart) {
    categoriasChart.destroy();
    categoriasChart = null;
  }

  const categoryLabels = [];
  const qtyData = [];

  stats.forEach((s) => {
    categoryLabels.push(s.categoria);
    qtyData.push(s.qty);
  });

  const data = {
    labels: categoryLabels,
    datasets: [
      {
        label: 'Peliculas',
        data: qtyData,
        fill: true,
        backgroundColor: 'rgba(232, 197, 71, 0.15)',
        borderColor: '#E8C547',
        pointBackgroundColor: '#E8C547',
        pointBorderColor: '#0A0A0C',
        pointHoverBackgroundColor: '#F2D567',
        pointHoverBorderColor: '#0A0A0C',
        pointHitRadius: 20, // fat finger friendly
        pointRadius: 4,
      },
    ],
  };

  const config = {
    type: 'radar',
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1, // square — best on mobile
      onClick: () => {}, // disables dataset toggle on tap
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      scales: {
        r: {
          min: 0,
          max: qtyData.length > 0 ? Math.max(...qtyData) : 5,
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { color: '#A09A93', font: { size: 12 } },
          ticks: {
            color: '#5C5851',
            backdropColor: 'transparent',
            stepSize: 1,
            precision: 0,
          },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          mode: 'nearest',
          intersect: true,
          backgroundColor: '#2C2C36',
          titleColor: '#F2EDE8',
          bodyColor: '#A09A93',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
        },
      },
      elements: {
        line: { borderWidth: 2 },
      },
    },
  };

  categoriasChart = new Chart(radarChartCanvas, config);
}

export function CatogriasPieChart(stats) {
  const categorieCanvas = document.querySelector('#categoriasChart');

  if (categoriasChart) {
    categoriasChart.destroy();
    categoriasChart = null;
  }

  const categoryLabels = [];
  const qtyData = [];

  stats.forEach((s) => {
    categoryLabels.push(s.categoria);
    qtyData.push(s.qty);
  });

  const BG = ['rgba(232,197,71,0.15)', 'rgba(43,191,176,0.15)'];
  const BORDER = ['#E8C547', '#2BBFB0'];
  const HOVER = ['rgba(232,197,71,0.3)', 'rgba(43,191,176,0.3)'];

  const config = {
    type: stats.length === 1 ? 'doughnut' : 'pie',
    data: {
      labels: categoryLabels,
      datasets: [
        {
          label: 'Distribución categoría',
          data: qtyData,
          backgroundColor: BG.slice(0, stats.length),
          borderColor: BORDER.slice(0, stats.length),
          borderWidth: 2,
          hoverBackgroundColor: HOVER.slice(0, stats.length),
          hoverBorderColor: BORDER.slice(0, stats.length),
          hoverOffset: 8,
        },
      ],
    },
    options: {
      onClick: () => {},
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#A09A93',
            font: { family: "'DM Sans', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyle: 'rectRounded',
            pointStyleWidth: 13,
          },
          onClick: () => {},
        },
        tooltip: {
          mode: 'nearest',
          intersect: true,
          backgroundColor: '#2C2C36',
          titleColor: '#F2EDE8',
          bodyColor: '#A09A93',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = Math.round((ctx.raw / total) * 100);
              return `  ${ctx.raw} películas (${pct}%)`;
            },
          },
        },
      },
    },
  };

  categoriasChart = new Chart(categorieCanvas, config);
}

export function EdadPieChart(edadData) {
  const edadCanvas = document.querySelector('#edadChart');

  if (edadChart) {
    edadChart.destroy();
    edadChart = null;
  }

  const data = {
    labels: ['Todo público', 'Solo mayores'],
    datasets: [
      {
        label: 'Distribución por edad',
        data: [edadData.todoPublico, edadData.mayores],
        backgroundColor: ['rgba(43,191,176,0.15)', 'rgba(155,89,182,0.15)'],
        borderColor: ['#2BBFB0', '#9B59B6'],
        borderWidth: 2,
        hoverBackgroundColor: ['rgba(43,191,176,0.3)', 'rgba(155,89,182,0.3)'],
        hoverBorderColor: ['#40CCBE', '#b07cc6'],
        hoverOffset: 8,
      },
    ],
  };

  const config = {
    type: 'pie',
    data: data,
    options: {
      onClick: () => {},
      hover: {
        mode: 'nearest',
        intersect: true,
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: '#A09A93',
            font: { family: "'DM Sans', sans-serif", size: 12 },
            padding: 16,
            usePointStyle: true,
            pointStyle: 'rectRounded',
            pointStyleWidth: 13,
          },
          onClick: () => {},
        },
        tooltip: {
          mode: 'nearest',
          intersect: true,
          backgroundColor: '#2C2C36',
          titleColor: '#F2EDE8',
          bodyColor: '#A09A93',
          borderColor: 'rgba(255,255,255,0.1)',
          borderWidth: 1,
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: (ctx) => {
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
              const pct = Math.round((ctx.raw / total) * 100);
              return `  ${ctx.raw} películas (${pct}%)`;
            },
          },
        },
      },
    },
  };

  edadChart = new Chart(edadCanvas, config);
}

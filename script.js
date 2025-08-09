const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer SEU_TOKEN_AQUI' // Substitua com seu token da API TMDB
  }
};

const userLang = navigator.language || 'pt-BR';

// Carregar filmes/séries nos containers
function loadCardMovies(filmes, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';

  filmes.forEach(filme => {
    const divCard = document.createElement('div');
    divCard.className = 'card movie-card-interactive';

    const imageURL = 'https://media.themoviedb.org/t/p/w440_and_h660_face';
    const title = filme.title || filme.name || 'Sem título';
    const id = filme.id;
    const movieUrl = filme.title
      ? `https://www.themoviedb.org/movie/${id}`
      : `https://www.themoviedb.org/tv/${id}`;
    const percent = Math.round(filme.vote_average * 10);

    divCard.innerHTML = `
      <div class="img-wrapper">
        <a href="${movieUrl}" target="_blank" title="${title}">
          <img src="${imageURL}${filme.poster_path}" class="card-img-top" alt="${title}">
          <span class="badge badge-rating">${percent}%</span>
        </a>
      </div>
    `;

    container.appendChild(divCard);
  });
}

// Buscar filmes via input
function searchMovies(query) {
  const popularContainer = document.getElementById('popular-container');
  fetch(`https://api.themoviedb.org/3/search/movie?language=${userLang}&query=${encodeURIComponent(query)}`, options)
    .then(res => res.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        loadCardMovies(data.results, 'popular-container');
      } else {
        popularContainer.innerHTML = '<p class="text-center mt-4">Nenhum filme encontrado.</p>';
      }
    })
    .catch(() => {
      popularContainer.innerHTML = '<p class="text-center mt-4">Erro ao buscar filmes.</p>';
    });
}

// Carrossel de tendências da semana
function loadTrendingCarousel() {
  const carousel = document.getElementById('carousel-trends');
  if (!carousel) return;

  fetch('https://api.themoviedb.org/3/trending/movie/week?language=pt-BR', options)
    .then(res => res.json())
    .then(data => {
      if (!data.results || data.results.length === 0) return;

      const slides = data.results.map((movie, idx) => {
        const shortOverview = movie.overview?.substring(0, 180) ?? '';
        const fullOverview = movie.overview ?? 'Sem descrição.';

        return `
          <div class="carousel-item${idx === 0 ? ' active' : ''}" style="position:relative; min-height:350px;">
            <div style="
              position:absolute;
              inset:0;
              background: url('https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}') center center / cover no-repeat;
              filter: brightness(0.4) blur(2px);
              z-index:1;
            "></div>

            <div class="d-flex flex-column flex-md-row align-items-center justify-content-center h-100" style="position:relative; z-index:2;">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path || movie.backdrop_path}" class="d-block rounded shadow" alt="${movie.title}" style="max-width:220px; max-height:320px; object-fit:cover;">
              
              <div class="ms-md-4 mt-3 mt-md-0 text-center text-md-start text-white">
                <h4 class="fw-bold">${movie.title}</h4>

                <p class="movie-overview" data-full="${fullOverview}" data-short="${shortOverview}">
                  ${shortOverview}${fullOverview.length > 180 ? '...' : ''}
                </p>

                <span class="badge bg-warning text-dark fs-6">Nota: ${movie.vote_average?.toFixed(1) ?? '-'}</span>

                ${fullOverview.length > 180 ? `
                  <button class="btn btn-sm btn-outline-light mt-2 ver-mais-btn">Ver mais</button>
                ` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      carousel.innerHTML = slides;

      // Adiciona evento aos botões "Ver mais"
      setTimeout(() => {
        document.querySelectorAll('.ver-mais-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            const p = btn.parentElement.querySelector('p');
            const isExpanded = btn.innerText === 'Ver menos';

            if (isExpanded) {
              p.innerHTML = p.dataset.short + '...';
              btn.innerText = 'Ver mais';
            } else {
              p.innerHTML = p.dataset.full;
              btn.innerText = 'Ver menos';
            }
          });
        });
      }, 500);
    })
    .catch(err => console.error('Erro ao carregar carrossel:', err));
}

// Carrega todas as séries populares com paginação
async function fetchAllSeries() {
  let allSeries = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await fetch(`https://api.themoviedb.org/3/tv/popular?language=${userLang}&page=${page}`, options);
    const data = await response.json();
    if (!data.results) break;

    allSeries = allSeries.concat(data.results);
    totalPages = data.total_pages;
    page++;
  }

  return allSeries;
}

// DOM Loaded
document.addEventListener('DOMContentLoaded', function () {
  // Carregar filmes populares
  fetch(`https://api.themoviedb.org/3/movie/popular?language=${userLang}`, options)
    .then(response => response.json())
    .then(data => {
      loadCardMovies(data.results, 'popular-container');
    })
    .catch(err => console.error('Erro ao carregar filmes populares:', err));

  // Carregar filmes em cartaz
  fetch(`https://api.themoviedb.org/3/movie/now_playing?language=${userLang}`, options)
    .then(response => response.json())
    .then(data => {
      loadCardMovies(data.results, 'movies-container');
    })
    .catch(err => console.error('Erro ao carregar filmes em cartaz:', err));

  // Carregar séries populares
  fetchAllSeries()
    .then(series => {
      loadCardMovies(series, 'series-container');
    })
    .catch(err => console.error('Erro ao carregar séries:', err));

  // Carregar carrossel
  loadTrendingCarousel();

  // Função de busca
  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');

  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const query = input.value.trim();
      if (query) {
        searchMovies(query);
      }
    });
  }
});
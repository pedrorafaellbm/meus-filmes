const API_KEY = '6f0126d646958ec832fa374ac8d708e5'
const userLang = navigator.language || 'pt-BR';

function buildUrl(path, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', userLang);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

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
          <img
            src="${imageURL}${filme.poster_path}"
            class="card-img-top"
            alt="${title}"
          />
          <span class="badge badge-rating">${percent}%</span>
        </a>
      </div>
    `;

    container.appendChild(divCard);
  });
}

function searchMovies(query) {
  const popularContainer = document.getElementById('popular-container');
  fetch(buildUrl('search/movie', { query }))
    .then(res => res.json())
    .then(data => {
      if (data.results?.length) {
        loadCardMovies(data.results, 'popular-container');
      } else {
        popularContainer.innerHTML = '<p class="text-center mt-4">Nenhum filme encontrado.</p>';
      }
    })
    .catch(() => {
      popularContainer.innerHTML = '<p class="text-center mt-4">Erro ao buscar filmes.</p>';
    });
}

function loadTrendingCarousel() {
  const carousel = document.getElementById('carousel-trends');
  const carouselWrapper = document.getElementById('trendCarousel');
  if (!carousel || !carouselWrapper) return;

  fetch(buildUrl('trending/movie/week'))
    .then(res => res.json())
    .then(data => {
      if (!data.results?.length) return;

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
                ${fullOverview.length > 180 ? `<button class="btn btn-sm btn-outline-light mt-2 ver-mais-btn">Ver mais</button>` : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');

      carousel.innerHTML = slides;

      // Re-inicializa o carrossel Bootstrap para ativar setas e funcionalidades
      bootstrap.Carousel.getInstance(carouselWrapper)?.dispose();
      new bootstrap.Carousel(carouselWrapper);

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

async function fetchAllSeries() {
  let allSeries = [], page = 1, totalPages = 1;
  while (page <= totalPages) {
    const response = await fetch(buildUrl('tv/popular', { page }));
    const data = await response.json();
    if (!data.results) break;
    allSeries = allSeries.concat(data.results);
    totalPages = data.total_pages;
    page++;
  }
  return allSeries;
}

document.addEventListener('DOMContentLoaded', function () {
  fetch(buildUrl('movie/popular'))
    .then(r => r.json())
    .then(data => loadCardMovies(data.results, 'popular-container'))
    .catch(err => console.error('Erro ao carregar filmes populares:', err));

  fetch(buildUrl('movie/now_playing'))
    .then(r => r.json())
    .then(data => loadCardMovies(data.results, 'movies-container'))
    .catch(err => console.error('Erro ao carregar filmes em cartaz:', err));

  fetchAllSeries()
    .then(series => loadCardMovies(series, 'series-container'))
    .catch(err => console.error('Erro ao carregar séries:', err));

  loadTrendingCarousel();

  const form = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  if (form && input) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (input.value.trim()) searchMovies(input.value.trim());
    });
  }

  // Botão perfil na navbar
  const perfilBtn = document.getElementById('btn-perfil');
  const perfilAvatar = document.getElementById('perfil-avatar');

  if (perfilBtn && perfilAvatar) {
    const perfilData = localStorage.getItem('perfil-selecionado');
    if (perfilData) {
      try {
        const perfil = JSON.parse(perfilData);
        if (perfil.avatar) {
          perfilAvatar.src = perfil.avatar;
          perfilAvatar.alt = perfil.nome || 'Perfil';
        } else {
          perfilAvatar.src = `https://i.pravatar.cc/150?u=${encodeURIComponent(perfil.nome)}`;
          perfilAvatar.alt = perfil.nome || 'Perfil';
        }
      } catch {}
    }

    perfilBtn.addEventListener('click', () => {
      window.location.href = 'perfis.html';
    });
  }
});

async function fetchGenresWithPoster() {
  try {
    const genreRes = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=pt-BR`);
    const genreData = await genreRes.json();
    const genres = genreData.genres;

    const container = document.getElementById('genres-container');
    container.innerHTML = '';

    for (const genre of genres) {
      // Pega o filme mais popular do gênero para a imagem
      const movieRes = await fetch(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genre.id}&sort_by=popularity.desc&language=pt-BR&page=1`);
      const movieData = await movieRes.json();
      const movie = movieData.results?.[0];

      if (!movie || !movie.poster_path) continue;

      const card = document.createElement('button');
      card.className = 'genre-card';
      card.title = `${genre.name} — ${movie.title}`;
      card.type = 'button';

      card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${genre.name}">
        <span class="genre-label">${genre.name}</span>
      `;

      card.onclick = () => {
        // Exemplo de ação: abrir página do gênero no TMDb
        window.open(`https://www.themoviedb.org/genre/${genre.id}-${genre.name.toLowerCase()}`, '_blank');
      };

      container.appendChild(card);
    }
  } catch (err) {
    console.error('Erro ao carregar gêneros:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Seu código atual...

  // Carrega os gêneros com capas circulares
  fetchGenresWithPoster();
});

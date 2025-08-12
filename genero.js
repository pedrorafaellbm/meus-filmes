const API_KEY = '6f0126d646958ec832fa374ac8d708e5';

// Função para pegar parâmetros da URL
function getQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    id: params.get('id'),
    name: params.get('name')
  };
}

function buildUrl(path, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', 'pt-BR');
  for (const key in params) {
    url.searchParams.set(key, params[key]);
  }
  return url.toString();
}

// Carregar filmes do gênero
async function loadMoviesByGenre(genreId) {
  const res = await fetch(buildUrl('discover/movie', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page: 1
  }));
  const data = await res.json();
  return data.results;
}

// Carregar séries do gênero
async function loadSeriesByGenre(genreId) {
  const res = await fetch(buildUrl('discover/tv', {
    with_genres: genreId,
    sort_by: 'popularity.desc',
    page: 1
  }));
  const data = await res.json();
  return data.results;
}

function createCard(item, type = 'movie') {
  const card = document.createElement('div');
  card.className = 'card movie-card-interactive';

  const title = item.title || item.name || 'Sem título';
  const id = item.id;
  const url = type === 'movie'
    ? `https://www.themoviedb.org/movie/${id}`
    : `https://www.themoviedb.org/tv/${id}`;

  card.innerHTML = `
    <div class="img-wrapper">
      <a href="${url}" target="_blank" title="${title}">
        <img
          src="https://image.tmdb.org/t/p/w440_and_h660_face${item.poster_path}"
          alt="${title}"
          class="card-img-top"
        />
      </a>
    </div>
  `;

  return card;
}

async function renderContent() {
  const params = getQueryParams();
  if (!params.id) {
    alert('Gênero inválido!');
    window.location.href = 'index.html';
    return;
  }

  document.getElementById('genre-title').textContent = `Gênero: ${params.name}`;

  const moviesContainer = document.getElementById('movies-container');
  const seriesContainer = document.getElementById('series-container');

  // Limpa containers
  moviesContainer.innerHTML = '';
  seriesContainer.innerHTML = '';

  try {
    const [movies, series] = await Promise.all([
      loadMoviesByGenre(params.id),
      loadSeriesByGenre(params.id)
    ]);

    if (movies.length === 0) {
      moviesContainer.innerHTML = '<p>Nenhum filme encontrado.</p>';
    } else {
      movies.forEach(movie => {
        moviesContainer.appendChild(createCard(movie, 'movie'));
      });
    }

    if (series.length === 0) {
      seriesContainer.innerHTML = '<p>Nenhuma série encontrada.</p>';
    } else {
      series.forEach(serie => {
        seriesContainer.appendChild(createCard(serie, 'tv'));
      });
    }

  } catch (err) {
    console.error('Erro ao carregar conteúdos:', err);
    moviesContainer.innerHTML = '<p>Erro ao carregar filmes.</p>';
    seriesContainer.innerHTML = '<p>Erro ao carregar séries.</p>';
  }
}

// Chamar renderContent quando a página carregar
document.addEventListener('DOMContentLoaded', renderContent);
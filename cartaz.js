const API_KEY = "6f0126d646958ec832fa374ac8d708e5"; // Substitua pela sua chave TMDb
let currentPage = 1; // só vamos carregar a primeira página

// Buscar filmes em cartaz no Brasil
async function getNowPlaying(page = 1) {
  const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR&region=BR&page=${page}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    return data.results;
  } catch (err) {
    console.error("Erro ao buscar filmes:", err);
    return [];
  }
}

// Renderizar filmes em cards
function renderMovies(movies) {
  const container = document.getElementById("movies-container");

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w300${movie.poster_path}" alt="${movie.title}" />
      <div class="title">${movie.title}</div>
    `;

    container.appendChild(card);
  });
}

// Carregar apenas a primeira página automaticamente
async function loadMovies() {
  const movies = await getNowPlaying(currentPage);
  renderMovies(movies);
}

// Chamar função para carregar os filmes ao abrir a página
loadMovies();
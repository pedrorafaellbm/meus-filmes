const API_KEY = '6f0126d646958ec832fa374ac8d708e5';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w440_and_h660_face';

const form = document.getElementById('search-form');
const input = document.getElementById('search-input');
const resultsContainer = document.getElementById('results');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const query = input.value.trim();

  if (!query) {
    alert('Por favor, digite um termo para pesquisar.');
    return;
  }

  resultsContainer.innerHTML = '<p>Carregando...</p>';

  try {
    // Buscar filmes
    const movieRes = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`);
    const movieData = await movieRes.json();

    // Buscar séries
    const tvRes = await fetch(`https://api.themoviedb.org/3/search/tv?api_key=${API_KEY}&language=pt-BR&query=${encodeURIComponent(query)}&page=1`);
    const tvData = await tvRes.json();

    const combinedResults = [];

    if (movieData.results) {
      movieData.results.forEach(item => combinedResults.push({ ...item, type: 'movie' }));
    }

    if (tvData.results) {
      tvData.results.forEach(item => combinedResults.push({ ...item, type: 'tv' }));
    }

    if (combinedResults.length === 0) {
      resultsContainer.innerHTML = '<p>Nenhum resultado encontrado.</p>';
      return;
    }

    // Ordena por popularidade
    combinedResults.sort((a,b) => b.popularity - a.popularity);

    // Exibir resultados
    resultsContainer.innerHTML = '';
    combinedResults.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      const title = item.title || item.name || 'Sem título';
      const poster = item.poster_path
        ? `${IMAGE_BASE}${item.poster_path}`
        : 'https://via.placeholder.com/300x450?text=Sem+Imagem';

      card.innerHTML = `
        <img src="${poster}" alt="${title}" />
        <div class="title">${title}</div>
      `;

      card.addEventListener('click', () => {
        window.location.href = `avaliacao.html?id=${item.id}&type=${item.type}`;
      });

      resultsContainer.appendChild(card);
    });

  } catch (err) {
    console.error('Erro na busca:', err);
    resultsContainer.innerHTML = '<p>Erro ao buscar resultados. Tente novamente.</p>';
  }
});
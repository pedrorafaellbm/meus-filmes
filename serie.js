const API_KEY = '6f0126d646958ec832fa374ac8d708e5';
const IMAGE_BASE = 'https://image.tmdb.org/t/p/w440_and_h660_face';

const seriesContainer = document.getElementById('series-container');
const loadMoreBtn = document.getElementById('load-more');

let currentPage = 1;
let totalPages = 1;

async function loadSeries(page = 1) {
  loadMoreBtn.disabled = true;
  loadMoreBtn.textContent = 'Carregando...';

  try {
    const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=pt-BR&page=${page}`);
    const data = await res.json();

    totalPages = data.total_pages;

    data.results.forEach(serie => {
      const card = document.createElement('div');
      card.className = 'card';

      const title = serie.name || 'Sem título';
      const poster = serie.poster_path
        ? `${IMAGE_BASE}${serie.poster_path}`
        : 'https://via.placeholder.com/300x450?text=Sem+Imagem';

      card.innerHTML = `
        <img src="${poster}" alt="${title}" />
        <div class="title">${title}</div>
      `;

      card.addEventListener('click', () => {
        window.location.href = `avaliacao.html?id=${serie.id}&type=tv`;
      });

      seriesContainer.appendChild(card);
    });

    if (currentPage >= totalPages) {
      loadMoreBtn.style.display = 'none';
    } else {
      loadMoreBtn.style.display = 'block';
      loadMoreBtn.disabled = false;
      loadMoreBtn.textContent = 'Carregar Mais';
    }
  } catch (err) {
    console.error('Erro ao carregar séries:', err);
    alert('Erro ao carregar séries. Tente novamente.');
    loadMoreBtn.disabled = false;
    loadMoreBtn.textContent = 'Carregar Mais';
  }
}

loadMoreBtn.addEventListener('click', () => {
  if (currentPage < totalPages) {
    currentPage++;
    loadSeries(currentPage);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  loadSeries(currentPage);
});

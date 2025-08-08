const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjAxMjZkNjQ2OTU4ZWM4MzJmYTM3NGFjOGQ3MDhlNSIsIm5iZiI6MTc1MjAxODY1OS4xNTIsInN1YiI6IjY4NmRhZWUzMzY0YmVmMDM4NGNlZWQyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9fobntkbwah6K5MyC5II7J9QYLuBanDYbB1HMIHyNW8`
    }
};
const userLang = navigator.language || 'en-US';

function loadCardMovies(filmes) {
    const container = document.getElementById('movie-container');
    container.innerHTML = "";

    filmes.forEach(filme => {
        const divCard = document.createElement('div');
        divCard.className = 'card movie-card-interactive';

        const imageURL = `https://media.themoviedb.org/t/p/w440_and_h660_face`;
        const movieUrl = `https://www.themoviedb.org/movie/${filme.id}`;
        const percent = Math.round(filme.vote_average * 10);

        divCard.innerHTML =
            `<div class="img-wrapper">
                <a href="${movieUrl}" target="_blank" title="${filme.title}">
                    <img src="${imageURL}/${filme.poster_path}" class="card-img-top" alt="${filme.title}">
                    <span class="badge badge-rating">${percent}%</span>
                </a>
            </div>`;

        container.appendChild(divCard);
    });
}

// Carrega filmes populares ao iniciar
fetch(`https://api.themoviedb.org/3/movie/popular?language=${userLang}`, options)
    .then(response => response.json())
    .then(data => {
        loadCardMovies(data.results);
    })
    .catch(err => console.error(err));

// Pesquisa de filmes
document.addEventListener('DOMContentLoaded', function () {
    // Pesquisa
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const movieContainer = document.getElementById('movie-container');

    if (form && input && movieContainer) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const query = input.value.trim();
            if (query) {
                searchMovies(query);
            }
        });
    }

    function searchMovies(query) {
        fetch(`https://api.themoviedb.org/3/search/movie?language=${userLang}&query=${encodeURIComponent(query)}`, options)
            .then(res => res.json())
            .then(data => {
                if (data.results && data.results.length > 0) {
                    loadCardMovies(data.results);
                } else {
                    movieContainer.innerHTML = '<p class="text-center mt-4">Nenhum filme encontrado.</p>';
                }
            })
            .catch(() => {
                movieContainer.innerHTML = '<p class="text-center mt-4">Erro ao buscar filmes.</p>';
            });
    }

      // Carrossel de tendências da semana (todas as tendências)
    const carousel = document.getElementById('carousel-trends');
    if (carousel) {
        fetch('https://api.themoviedb.org/3/trending/movie/week?language=pt-BR', options)
            .then(res => res.json())
            .then(data => {
                if (!data.results || data.results.length === 0) return;
 // Carrossel de tendências da semana (todas as tendências)
const carousel = document.getElementById('carousel-trends');
if (carousel) {
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

                      <div class="d-flex flex-column flex-md-row align-items-center justify-content-center h-100" style="position:relative; z-index:2; min-height:350px;">
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

            // Adiciona eventos aos botões "Ver mais"
            document.querySelectorAll('.ver-mais-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const p = btn.previousElementSibling.previousElementSibling; // o <p> com a descrição
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
        });
}
                carousel.innerHTML = slides;
            });
    }
});
slides
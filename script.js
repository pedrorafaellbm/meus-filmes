const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjAxMjZkNjQ2OTU4ZWM4MzJmYTM3NGFjOGQ3MDhlNSIsIm5iZiI6MTc1MjAxODY1OS4xNTIsInN1YiI6IjY4NmRhZWUzMzY0YmVmMDM4NGNlZWQyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9fobntkbwah6K5MyC5II7J9QYLuBanDYbB1HMIHyNW8`
    }
}
const userLang = navigator.language || 'en-US';

fetch(`https://api.themoviedb.org/3/movie/popular?language=${userLang}`, options)
    .then(response => response.json())
    .then(data => {
        loadCardMovies(data.results)
    })
    .catch(err => console.error(err))

const loadCardMovies = (filmes) => {
    const container = document.getElementById('movie-container')
    container.innerHTML = ""; // Limpa antes de adicionar novos cards

    filmes.forEach(filme => {
        const divCard = document.createElement('div')
        divCard.className = 'card movie-card-interactive'

        const imageURL = `https://media.themoviedb.org/t/p/w440_and_h660_face`
        const movieUrl = `https://www.themoviedb.org/movie/${filme.id}`
        const percent = Math.round(filme.vote_average * 10); // Calcula a porcentagem

        divCard.innerHTML =
    `<div class="img-wrapper">
        <a href="${movieUrl}" target="_blank" title="${filme.title}">
            <img src="${imageURL}/${filme.poster_path}" class="card-img-top" alt="${filme.title}">
            <span class="badge badge-rating">${percent}%</span>
        </a>
    </div>`;

        container.appendChild(divCard)
    })

    document.addEventListener('keydown', function (event) {
        const container = document.getElementById('movie-container');
        if (event.key === 'ArrowRight') {
            container.scrollBy({ left: 200, behavior: 'smooth' });
        }
        if (event.key === 'ArrowLeft') {
            container.scrollBy({ left: -200, behavior: 'smooth' });
        }
    });
}





// fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, options)
// .then( ress => ress.json())
// .then(ress => console.log(ress))
// .catch(err => console.error(err))
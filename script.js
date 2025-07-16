const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjAxMjZkNjQ2OTU4ZWM4MzJmYTM3NGFjOGQ3MDhlNSIsIm5iZiI6MTc1MjAxODY1OS4xNTIsInN1YiI6IjY4NmRhZWUzMzY0YmVmMDM4NGNlZWQyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9fobntkbwah6K5MyC5II7J9QYLuBanDYbB1HMIHyNW8`
    }
}
const userLang = navigator.language || 'en-US';


fetch(`https://api.themoviedb.org/3/movie/popular?api_key=SEU_API_KEY&language=${userLang}`, options)
    .then(response => response.json())
    .then(data => {
        console.log(data)
        loadCardMovies(data.results)
    })
    .catch(err => console.error(err))

const loadCardMovies = (filmes) => {
    const container = document.getElementById('movie-container')
    // https://media.themoviedb.org/t/p/w440_and_h660_face/c90Lt7OQGsOmhv6x4JoFdoHzw5l.jpg
    filmes.forEach(filme => {
        const divCol = document.createElement('div')
        divCol.className = 'col-12 col-sm-6 mb-4 col-md-4 col-lg-3 mb-4'

        const divCard = document.createElement('div')
        divCard.className = 'card h-100 d-flex flex-column'

        const imageURL = `https://media.themoviedb.org/t/p/w440_and_h660_face`

        divCard.innerHTML =
            `<img src="${imageURL}/${filme.poster_path}" class = "card-img-top" alt="${filme.title}">
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${filme.title}</h5>
              <p class="card-text text-overview">${filme.overview}</p>
              <div class=" mt-auto d-flex justify-content-between align-items-center ">
                <a href="#" class="btn btn-primary btn-sm">Ver mais</a>
                <small class="text-muted"><strong>Estréia: </strong>
                ${formateDate(filme.release_date)}</small>    
              </div>
            </div>`

        divCol.appendChild(divCard)
        container.appendChild(divCol)
    })
}

const formateDate = (date) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' }
    return new Date(date).toLocaleDateString('pt-BR', options)
}






// fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, options)
// .then( ress => ress.json())
// .then(ress => console.log(ress))
// .catch(err => console.error(err))
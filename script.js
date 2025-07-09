const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer yJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2ZjAxMjZkNjQ2OTU4ZWM4MzJmYTM3NGFjOGQ3MDhlNSIsIm5iZiI6MTc1MjAxODY1OS4xNTIsInN1YiI6IjY4NmRhZWUzMzY0YmVmMDM4NGNlZWQyYyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.9fobntkbwah6K5MyC5II7J9QYLuBanDYbB1HMIHyNW8`
    }
}

fetch(`https://api.themoviedb.org/3/authentication`, options)
.then(response => response.json())
.then(data =>{
    console.log(data)
})

fetch(`https://api.themoviedb.org/3/movie/popular?language=en-US&page=1`, options)
.then( ress => ress.json())
.then(ress => console.log(ress))
.catch(err => console.error(err))


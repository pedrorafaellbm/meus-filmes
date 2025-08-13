const API_KEY = '6f0126d646958ec832fa374ac8d708e5';
const userLang = navigator.language || 'pt-BR';

function getIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function buildUrl(path, params = {}) {
  const url = new URL(`https://api.themoviedb.org/3/${path}`);
  url.searchParams.set('api_key', API_KEY);
  url.searchParams.set('language', userLang);
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}

function fetchDetails(id) {
  // Tenta buscar filme, se não achar tenta série
  return fetch(buildUrl(`movie/${id}`))
    .then(res => {
      if (!res.ok) throw new Error('Not movie');
      return res.json();
    })
    .catch(() => {
      return fetch(buildUrl(`tv/${id}`)).then(res => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      });
    });
}

function fetchCast(id, type) {
  return fetch(buildUrl(`${type}/${id}/credits`))
    .then(res => {
      if (!res.ok) throw new Error('Erro ao buscar elenco');
      return res.json();
    })
    .then(data => data.cast || [])
    .catch(() => []);
}

function mostrarDetalhes(data) {
  document.getElementById('title').textContent = data.title || data.name || 'Sem título';
  document.getElementById('overview').textContent = data.overview || 'Sem descrição.';
  document.getElementById('release_date').textContent = data.release_date || data.first_air_date || 'N/A';
  document.getElementById('vote_average').textContent = data.vote_average ? data.vote_average.toFixed(1) : '-';
  document.getElementById('poster').src = data.poster_path
    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
    : 'https://via.placeholder.com/300x450?text=Sem+Imagem';
  document.getElementById('poster').alt = data.title || data.name || 'Poster';
}

function mostrarElenco(cast) {
  const container = document.getElementById('cast');
  container.innerHTML = '';
  if (cast.length === 0) {
    container.innerHTML = '<p>Nenhum elenco disponível.</p>';
    return;
  }
  cast.slice(0, 10).forEach(actor => {
    const imgSrc = actor.profile_path
      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
      : 'https://via.placeholder.com/120x160?text=Sem+Foto';
    const div = document.createElement('div');
    div.classList.add('cast-member');
    div.innerHTML = `
      <img src="${imgSrc}" alt="${actor.name}" />
      <p>${actor.name}</p>
      <small>${actor.character || ''}</small>
    `;
    container.appendChild(div);
  });
}

function salvarAvaliacao(id, nota, comentario) {
  const key = `avaliacoes_${id}`;
  const avaliacoes = JSON.parse(localStorage.getItem(key)) || [];
  avaliacoes.push({ nota, comentario, data: new Date().toLocaleString() });
  localStorage.setItem(key, JSON.stringify(avaliacoes));
}

function carregarAvaliacoes(id) {
  const key = `avaliacoes_${id}`;
  return JSON.parse(localStorage.getItem(key)) || [];
}

function mostrarAvaliacoes(avaliacoes) {
  const container = document.getElementById('avaliacoes');
  container.innerHTML = '';

  if (avaliacoes.length === 0) {
    container.innerHTML = '<p>Nenhuma avaliação até o momento.</p>';
    return;
  }

  avaliacoes.forEach(av => {
    const div = document.createElement('div');
    div.classList.add('avaliacao');
    div.innerHTML = `
      <h5>Nota: ${av.nota} / 10</h5>
      <p>${av.comentario}</p>
      <small class="text-muted">Avaliado em: ${av.data}</small>
    `;
    container.appendChild(div);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const id = getIdFromURL();
  if (!id) {
    alert('ID do filme/série não fornecido na URL!');
    return;
  }

  fetchDetails(id)
    .then(data => {
      mostrarDetalhes(data);
      return { data, type: data.title ? 'movie' : 'tv' };
    })
    .then(({ data, type }) => {
      fetchCast(id, type).then(cast => mostrarElenco(cast));
      mostrarAvaliacoes(carregarAvaliacoes(id));
    })
    .catch(() => alert('Erro ao carregar detalhes do filme/série.'));

  const form = document.getElementById('form-avaliacao');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const notaInput = document.getElementById('nota');
    const comentarioInput = document.getElementById('comentario');

    const nota = parseInt(notaInput.value);
    const comentario = comentarioInput.value.trim();

    if (nota < 1 || nota > 10) {
      alert('Por favor, insira uma nota entre 1 e 10.');
      return;
    }

    if (!comentario) {
      alert('Por favor, escreva um comentário.');
      return;
    }

    salvarAvaliacao(id, nota, comentario);
    mostrarAvaliacoes(carregarAvaliacoes(id));

    notaInput.value = '';
    comentarioInput.value = '';
  });
});


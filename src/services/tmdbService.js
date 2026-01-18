const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3'

async function fetchFromTMDB(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR`);
    if (!response.ok) {
        throw new Error('Erro ao buscar dados da API');
    }
    return response.json();
}

export function getPopularMovies() {
    return fetchFromTMDB('/movie/popular');
}

export function getTopRatedMovies() {
    return fetchFromTMDB('/movie/top_rated');
}

export function getMovieDetails(id) {
    return fetchFromTMDB(`/movie/${id}`);
}
/* 
    It centralizes communication with the TMDB API and handles errors
*/

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3'

async function fetchFromTMDB(endpoint, extraParams = "") {
    try {
        const response = await fetch(
            `${BASE_URL}${endpoint}?api_key=${API_KEY}&language=pt-BR${extraParams}`
        );
        if (!response.ok) {
            let errorMessage = `Erro ${response.status}: Falha na requisição`;
            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    errorMessage = errorData.status_message || errorMessage;
                }
            } catch (e) {
                // Keep the default message with the HTTP code
            }
            throw new Error(errorMessage);
        }
        return await response.json();

    } catch (error) {
        console.error('Erro técnico: ', error.message);

        if (error.message.includes("execute 'json'") || error.message.includes('is not valid JSON')) {
            throw new Error('O servidor retornou uma resposta inválida. Tente novamente mais tarde.')
        }
        
        if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
            throw new Error('Não foi possível conectar à internet. Verifique sua conexão.')
        }
        
        if (error instanceof Error) {
            throw error;
        }

        throw new Error('Erro de conexão com a API');
    }
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

export function getMovieCredits(id) {
    return fetchFromTMDB(`/movie/${id}/credits`)
}

export function getMoviesByGenre(genreId, page = 1) {
    return fetchFromTMDB('/discover/movie', `&with_genres=${genreId}&page=${page}`);
}

export function getGenres() {
    return fetchFromTMDB('/genre/movie/list');
}
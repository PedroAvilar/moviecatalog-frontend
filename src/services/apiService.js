import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.error || 'Erro na comunicação com o servidor'
        return Promise.reject(new Error(message));
    }
);

export const getPopularMovies = async () => {
    const response = await api.get('/movie/popular');
    return response.data;
};

export const getTopRatedMovies = async () => {
    const response = await api.get('/movie/top_rated');
    return response.data;
};

export const getMovieDetails = async (id) => {
    const response = await api.get(`/movie/${id}/details`);
    return response.data;
};

export const getGenres = async () => {
    const response = await api.get('/movie/genres');
    return response.data;
}

export const getMoviesByGenre = async (genreId, page) => {
    const response = await api.get('/movie/discover', {
        params: {
            with_genres: genreId,
            page
        }
    });
    return response.data;
}

export const login = (email, password) => api.post('/auth/login', { email, password });
export const register = (userData) => api.post('/auth/register', userData);
export const logout = () => api.post('/auth/logout');
export const getMe = () => api.get('/auth/me');

export const createReview = (reviewData) => api.post('/review', reviewData);
export const getMyReviews = () => api.get('/review/me');

export default api;
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

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
}

export const register = (userData) => api.post('/auth/register', userData);

export const logout = () => api.post('/auth/logout');

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const createReview = (reviewData) => api.post('/review', reviewData);

export const getMyReviews = async () => {
    const response = await api.get('/review/me');
    return response.data;
};

export const deleteReview = (reviewId) => api.delete(`/review/${reviewId}`);

export const updateReview = (reviewId, data) => api.put(`/review/${reviewId}`, data);

export default api;
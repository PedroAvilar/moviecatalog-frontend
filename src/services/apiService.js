import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => {
        return {
            message: response.data.message || 'Operação realizada com sucesso',
            data: response.data,
            type: 'success'
        };
    },
    (error) => {
        return Promise.reject({
            message: error.response?.data?.error || 'Erro na comunicação com o servidor',
            type: 'error'
        });
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
    return response;
}

export const register = async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response;
};

export const logout = async () => {
    const response = await api.post('/auth/logout');
    return response;
};

export const getMe = async () => {
    const response = await api.get('/auth/me');
    return response.data;
};

export const updateProfile = async (data) => {
    const response = await api.put('/auth/update-profile', data);
    return response;
};

export const updatePassword = async (data) => {
    const response = await api.put('/auth/update-password', data);
    return response;
};

export const deleteAccount =  async () => {
    const response = await api.delete('/auth/delete-account');
    return response;
};

export const createReview = async (reviewData) => {
    const response = await api.post('/review', reviewData);
    return response;
};

export const getMyReviews = async () => {
    const response = await api.get('/review/me');
    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await api.delete(`/review/${reviewId}`);
    return response;
};

export const updateReview = async (reviewId, data) => {
    const response = await api.put(`/review/${reviewId}`, data);
    return response;
};

export const getFavorites = async () => {
    const response = await api.get('/favorite');
    return response.data;
}

export const toggleFavorite = async (movie) => {
    const favoriteData = {
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average ? Number(Number(movie.vote_average).toFixed(1)) : 0
    };
    const response = await api.post('/favorite/toggle', favoriteData);
    return response;
}

export default api;
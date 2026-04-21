import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
	withCredentials: true,
});

api.interceptors.response.use(
	(response) => response,
	(error) => {
		return Promise.reject({
			message:
				error.response?.data?.message || 'Erro na comunicação com o servidor',
			type: 'error',
		});
	},
);

export const getPopularMovies = async () => {
	const { data } = await api.get('/movie/popular');
	return data;
};

export const getTopRatedMovies = async () => {
	const { data } = await api.get('/movie/top_rated');
	return data;
};

export const getMovieDetails = async (id) => {
	const { data } = await api.get(`/movie/${id}/details`);
	return data;
};

export const getGenres = async () => {
	const { data } = await api.get('/movie/genres');
	return data;
};

export const getMoviesByGenre = async (genreId, page) => {
	const { data } = await api.get('/movie/discover', {
		params: {
			with_genres: genreId,
			page,
		},
	});
	return data;
};

export const login = async (email, password) => {
	const { data } = await api.post('/auth/login', { email, password });
	return data;
};

export const register = async (userData) => {
	const { data } = await api.post('/auth/register', userData);
	return data;
};

export const logout = async () => {
	const { data } = await api.post('/auth/logout');
	return data;
};

export const getMe = async () => {
	const { data } = await api.get('/auth/me');
	return data;
};

export const updateProfile = async (payload) => {
	const { data } = await api.put('/auth/update-profile', payload);
	return data;
};

export const updatePassword = async (payload) => {
	const { data } = await api.put('/auth/update-password', payload);
	return data;
};

export const deleteAccount = async () => {
	const { data } = await api.delete('/auth/delete-account');
	return data;
};

export const createReview = async (reviewData) => {
	const { data } = await api.post('/review', reviewData);
	return data;
};

export const getMyReviews = async () => {
	const { data } = await api.get('/review/me');
	return data;
};

export const deleteReview = async (reviewId) => {
	const { data } = await api.delete(`/review/${reviewId}`);
	return data;
};

export const updateReview = async (reviewId, payload) => {
	const { data } = await api.put(`/review/${reviewId}`, payload);
	return data;
};

export const getFavorites = async () => {
	const { data } = await api.get('/favorite');
	return data;
};

export const toggleFavorite = async (movie) => {
	const favoriteData = {
		movieId: movie.id,
		title: movie.title,
		poster_path: movie.poster_path,
		vote_average: movie.vote_average
			? Number(Number(movie.vote_average).toFixed(1))
			: 0,
	};
	const { data } = await api.post('/favorite/toggle', favoriteData);
	return data;
};

export default api;

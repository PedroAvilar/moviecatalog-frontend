import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getMovieDetails } from '../../services/apiService';
import MovieDetails from './MovieDetails';

vi.mock('../../services/apiService', () => ({
	getMovieDetails: vi.fn(),
}));

vi.mock('../../components/castList/CastList', () => ({
	default: ({ cast }) => (
		<div data-testid="mock-cast-list">
			{cast?.map((c) => (
				<span key={c.id}>{c.name}</span>
			))}
		</div>
	),
}));

vi.mock('./MovieDetailsSkeleton', () => ({
	default: () => <div className="skeleton-base" data-testid="mock-movie-skeleton"></div>,
}));

vi.mock('../../components/castList/CastListSkeleton', () => ({
	default: () => <div className="skeleton-base" data-testid="mock-cast-skeleton"></div>,
}));

vi.mock('../../components/favoriteButton/FavoriteButton', () => ({
	default: () => <button data-testid="mock-favorite-button">Fav</button>,
}));

vi.mock('../../components/errorMessage/ErrorMessage', () => ({
	default: ({ message }) => (
		<div data-testid="mock-error-message">
			<p>{message || 'Algo deu errado'}</p>
		</div>
	),
}));

vi.mock('../../components/movieReviews/MovieReviews', () => ({
	default: () => <div data-testid="mock-movie-reviews"></div>,
}));

vi.mock('../../components/moviePoster/MoviePoster', () => ({
	default: ({ alt }) => <img data-testid="mock-movie-poster" alt={alt} />,
}));

const mockMovie = {
	id: 550,
	title: 'Filme A',
	release_date: '1999-10-15',
	overview: 'Desc A',
	vote_average: 8.4,
	runtime: 139,
	genres: [{ id: 1, name: 'Ação' }],
	directors: ['Diretor 1'],
	cast: [{ id: 1, name: 'Ator 1', character: 'Personagem 1', profile_path: '' }],
	poster_path: '/pathA.jpg',
	reviews: [],
};

describe('MovieDetails Page (Unit Tests)', () => {
	let queryClient;

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient = new QueryClient({
			defaultOptions: {
				queries: {
					retry: false,
					gcTime: 0,
					staleTime: 0,
				},
			},
		});
	});

	const renderComponent = (id = '550') =>
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={[`/filme/${id}/filme-a`]}>
					<Routes>
						<Route path="/filme/:id/:title" element={<MovieDetails />} />
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>
		);

	it('Deve renderizar os detalhes do filme após o carregamento', async () => {
		getMovieDetails.mockResolvedValue(mockMovie);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText(/filme a/i)).toBeInTheDocument();
			expect(screen.getByText(/1999/i)).toBeInTheDocument();
		});
	});

	it('Deve exibir o overview do filme', async () => {
		getMovieDetails.mockResolvedValue(mockMovie);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText(/desc a/i)).toBeInTheDocument();
		});
	});

	it('Deve exibir o elenco', async () => {
		getMovieDetails.mockResolvedValue(mockMovie);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId('mock-cast-list')).toBeInTheDocument();
			expect(screen.getByText(/ator 1/i)).toBeInTheDocument();
		});
	});

	it('Deve exibir ErrorMessage se a API falhar', async () => {
		getMovieDetails.mockRejectedValue(new Error('Filme não encontrado'));
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText(/filme não encontrado/i)).toBeInTheDocument();
		});
	});

	it('Deve renderizar os skeletons durante o carregamento', () => {
		getMovieDetails.mockReturnValue(new Promise(() => { }));
		const { container } = renderComponent();

		expect(screen.getByTestId('mock-movie-skeleton')).toBeInTheDocument();
		expect(screen.getByTestId('mock-cast-skeleton')).toBeInTheDocument();
		expect(container.querySelector('.skeleton-base')).toBeInTheDocument();
	});
});

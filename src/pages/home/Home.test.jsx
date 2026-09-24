import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPopularMovies, getTopRatedMovies } from '../../services/apiService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './Home';

vi.mock('../../services/apiService', () => ({
	getPopularMovies: vi.fn(),
	getTopRatedMovies: vi.fn(),
}));

vi.mock('../../components/banner/Banner', () => ({
	default: ({ movies }) => (
		<div data-testid="mock-banner">
			{movies?.map((m) => (
				<span key={m.id}>Banner: {m.title}</span>
			))}
		</div>
	),
}));

vi.mock('../../components/movieSection/MovieSection', () => ({
	default: ({ title, movies }) => (
		<div data-testid="mock-movie-section">
			<h2>{title}</h2>
			{movies?.map((m) => (
				<span key={m.id}>{m.title}</span>
			))}
		</div>
	),
}));

vi.mock('../../components/errorMessage/ErrorMessage', () => ({
	default: ({ message }) => (
		<div data-testid="mock-error-message">
			<p>{message || 'Algo deu errado'}</p>
		</div>
	),
}));

vi.mock('../../components/emptyState/EmptyState', () => ({
	default: ({ actionText }) => (
		<div data-testid="mock-empty-state">
			<button>{actionText}</button>
		</div>
	),
}));

const mockPopular = [
	{ id: 1, title: 'Filme Popular 1', backdrop_path: '/path1.jpg', overview: 'Desc 1' },
	{ id: 2, title: 'Filme Popular 2', backdrop_path: '/path2.jpg', overview: 'Desc 2' },
];

const mockTopRated = [
	{ id: 3, title: 'Filme Top 1' },
	{ id: 4, title: 'Filme Top 2' },
];

describe('Home Page (Unit Tests)', () => {
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

	const renderComponent = () => {
		return render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<Home />
				</MemoryRouter>
			</QueryClientProvider>
		);
	};

	it('Deve renderizar as seções de filmes populares e melhores avaliados', async () => {
		getPopularMovies.mockResolvedValue(mockPopular);
		getTopRatedMovies.mockResolvedValue(mockTopRated);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('Populares')).toBeInTheDocument();
			expect(screen.getByText('Melhores avaliados')).toBeInTheDocument();
		});
	});

	it('Deve renderizar o Banner com filmes populares', async () => {
		getPopularMovies.mockResolvedValue(mockPopular);
		getTopRatedMovies.mockResolvedValue(mockTopRated);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('Banner: Filme Popular 1')).toBeInTheDocument();
		});
	});

	it('Deve exibir ErrorMessage se a busca de filmes falhar', async () => {
		getPopularMovies.mockRejectedValue(new Error('Falha na conexão'));
		getTopRatedMovies.mockResolvedValue(mockTopRated);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId('mock-error-message')).toBeInTheDocument();
			expect(screen.getByText('Falha na conexão')).toBeInTheDocument();
		});
	});

	it('Deve exibir EmptyState se as listas retornarem vazias', async () => {
		getPopularMovies.mockResolvedValue([]);
		getTopRatedMovies.mockResolvedValue([]);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId('mock-empty-state')).toBeInTheDocument();
			expect(screen.getByRole('button', { name: /recarregar/i })).toBeInTheDocument();
		});
	});
});

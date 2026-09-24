import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getMoviesByGenre } from '../../services/apiService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Categories from './Categories';

const mockInView = vi.fn();

vi.mock('react-intersection-observer', () => ({
	useInView: () => ({
		ref: vi.fn(),
		inView: mockInView(),
	}),
}));

vi.mock('../../services/apiService', () => ({
	getMoviesByGenre: vi.fn(),
}));

vi.mock('../../components/movieSection/MovieSection', () => ({
	default: ({ title, movies, loading }) => (
		<div data-testid="mock-movie-section">
			<h2>{title}</h2>
			<div data-testid="loading-status">{loading ? 'Loading' : 'Loaded'}</div>
			{movies?.map((m) => (
				<h4 key={m.id}>{m.title}</h4>
			))}
		</div>
	),
}));

vi.mock('../../components/errorMessage/ErrorMessage', () => ({
	default: ({ message, onRetry }) => (
		<div data-testid="mock-error-message">
			<p>{message || 'Algo deu errado'}</p>
			{onRetry && <button onClick={onRetry}>Tentar de novo</button>}
		</div>
	),
}));

describe('Categories Page (Unit Tests)', () => {
	let queryClient;

	beforeEach(() => {
		vi.clearAllMocks();
		getMoviesByGenre.mockReset();
		mockInView.mockReturnValue(false);
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

	const renderComponent = (initialEntries = ['/categoria/28/acao']) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={initialEntries}>
					<Routes>
						<Route
							path="/categoria/:genreId/:genreName"
							element={<Categories />}
						/>
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>
		);
	};

	it('Deve formatar o título corretamente a partir dos parâmetros da URL', async () => {
		getMoviesByGenre.mockResolvedValueOnce({
			page: 1,
			total_pages: 1,
			results: [],
		});
		renderComponent(['/categoria/28/acao']);

		await waitFor(() => {
			expect(screen.getByText('Acao')).toBeInTheDocument();
		});
	});

	it('Deve priorizar o nome real vindo do location.state', async () => {
		getMoviesByGenre.mockResolvedValueOnce({
			page: 1,
			total_pages: 1,
			results: [],
		});
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter
					initialEntries={[
						{
							pathname: '/categoria/28/action',
							state: { genreRealName: 'Ação' },
						},
					]}
				>
					<Routes>
						<Route
							path="/categoria/:genreId/:genreName"
							element={<Categories />}
						/>
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>
		);

		await waitFor(() => {
			expect(screen.getByText('Ação')).toBeInTheDocument();
		});
	});

	it('Deve buscar próxima página quando entrar em view', async () => {
		mockInView.mockReturnValue(true);
		getMoviesByGenre.mockResolvedValueOnce({
			page: 1,
			total_pages: 2,
			results: [{ id: 1, title: 'Filme 1' }],
		}).mockResolvedValueOnce({
			page: 2,
			total_pages: 2,
			results: [{ id: 2, title: 'Filme 2' }],
		});
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('Filme 2')).toBeInTheDocument();
		});
	});

	it('Deve exibir erro compacto ao falhar ao buscar mais páginas', async () => {
		mockInView.mockReturnValue(true);
		getMoviesByGenre.mockResolvedValueOnce({
			page: 1,
			total_pages: 2,
			results: [{ id: 1, title: 'Filme 1' }],
		}).mockRejectedValueOnce(new Error('Erro na próxima página'));
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('Erro na próxima página')).toBeInTheDocument();
		});
	});

	it('Deve chamar refetch ao clicar em tentar novamente', async () => {
		getMoviesByGenre.mockRejectedValue(new Error('Erro Inicial'));
		renderComponent();
		const retryBtn = await screen.findByRole('button', {
			name: /tentar de novo/i,
		});
		getMoviesByGenre.mockResolvedValueOnce({
			page: 1,
			total_pages: 1,
			results: [{ id: 1, title: 'Filme 1' }],
		});
		fireEvent.click(retryBtn);

		await waitFor(() => {
			expect(screen.getByText('Filme 1')).toBeInTheDocument();
		});
	});

	it('Deve remover filmes duplicados da lista', async () => {
		getMoviesByGenre.mockResolvedValue({
			page: 1,
			total_pages: 1,
			results: [
				{ id: 1, title: 'Filme Repetido' },
				{ id: 1, title: 'Filme Repetido' },
				{ id: 2, title: 'Filme Único' },
			],
		});
		renderComponent();

		await waitFor(() => {
			const titles = screen.getAllByRole('heading', { level: 4 });
			const movieTitles = titles.map((t) => t.textContent);

			expect(movieTitles).toEqual(['Filme Repetido', 'Filme Único']);
		});
	});

	it('Deve renderizar ErrorMessage em caso de falha na primeira carga', async () => {
		getMoviesByGenre.mockRejectedValue(new Error('Erro ao buscar filmes'));
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('Erro ao buscar filmes')).toBeInTheDocument();
		});
	});
});

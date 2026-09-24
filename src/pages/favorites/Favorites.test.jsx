import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getFavorites } from '../../services/apiService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Favorites from './Favorites';

vi.mock('../../services/apiService', () => ({
	getFavorites: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
	useAuth: () => ({ user: { id: 'user123' } }),
}));

vi.mock('../../components/movieSection/MovieSection', () => ({
	default: ({ title, movies }) => (
		<div data-testid="mock-movie-section">
			<h2>{title}</h2>
			{movies?.map((m) => (
				<h4 key={m.id}>{m.title}</h4>
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
	default: ({ title }) => (
		<div data-testid="mock-empty-state">
			<h3>{title}</h3>
		</div>
	),
}));

describe('Favorites Page (Unit Tests)', () => {
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
					<Favorites />
				</MemoryRouter>
			</QueryClientProvider>
		);
	};

	it('Deve exibir EmptyState quando não há favoritos', async () => {
		getFavorites.mockResolvedValue([]);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId('mock-empty-state')).toBeInTheDocument();
			expect(screen.getByText(/nenhum filme/i)).toBeInTheDocument();
		});
	});

	it('Deve exibir a lista de favoritos em ordem inversa', async () => {
		getFavorites.mockResolvedValue([
			{ id: 1, title: 'Primeiro adicionado' },
			{ id: 2, title: 'Último adicionado' },
		]);
		renderComponent();

		await waitFor(() => {
			const items = screen.getAllByRole('heading', { level: 4 });
			expect(items[0].textContent).toBe('Último adicionado');
			expect(items[1].textContent).toBe('Primeiro adicionado');
		});
	});

	it('Deve exibir o botão "Ver mais" se favoritos excederem o limite', async () => {
		const manyFavorites = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `Filme ${i + 1}`,
		}));
		getFavorites.mockResolvedValue(manyFavorites);
		renderComponent();

		expect(await screen.findByRole('button', { name: /ver mais/i })).toBeInTheDocument();
	});

	it('Deve carregar mais favoritos ao clicar em "Ver mais"', async () => {
		const manyFavorites = Array.from({ length: 20 }, (_, i) => ({
			id: i + 1,
			title: `Filme ${i + 1}`,
		}));
		getFavorites.mockResolvedValue(manyFavorites);
		renderComponent();
		const verMaisBtn = await screen.findByRole('button', { name: /ver mais/i });
		fireEvent.click(verMaisBtn);

		await waitFor(() => {
			expect(screen.queryByRole('button', { name: /ver mais/i })).not.toBeInTheDocument();
		});
	});

	it('Deve exibir ErrorMessage em caso de falha', async () => {
		getFavorites.mockRejectedValue(new Error('Erro ao carregar favoritos'));
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId('mock-error-message')).toBeInTheDocument();
			expect(screen.getByText('Erro ao carregar favoritos')).toBeInTheDocument();
		});
	});
});

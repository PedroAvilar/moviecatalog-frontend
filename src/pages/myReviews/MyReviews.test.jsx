import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getMyReviews, deleteReview } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import userEvent from '@testing-library/user-event';
import MyReviews from './MyReviews';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../services/apiService', () => ({
	getMyReviews: vi.fn(),
	deleteReview: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
	useToast: vi.fn(),
}));

vi.mock('../../components/moviePoster/MoviePoster', () => ({
	default: ({ alt, onClick }) => (
		<img data-testid="mock-movie-poster" alt={alt} onClick={onClick} />
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

vi.mock('./MyReviewsSkeleton', () => ({
	default: () => <div data-testid="mock-my-reviews-skeleton">Loading...</div>,
}));

vi.mock('../../components/modal/Modal', () => ({
	default: ({ isOpen, title, children }) => {
		if (!isOpen) return null;
		return (
			<div data-testid="mock-modal">
				<h3>{title}</h3>
				{children}
			</div>
		);
	},
}));

vi.mock('../../components/movieReviews/EditMovieReview', () => ({
	default: ({ isOpen, review }) => {
		if (!isOpen) return null;
		return (
			<div data-testid="mock-edit-movie-review">
				Editando review {review.id}
			</div>
		);
	},
}));

const mockReview = {
	id: '1',
	rating: 8,
	comment: 'Muito bom!',
	createdAt: '2026-01-01T00:00:00Z',
	movie: {
		id: 550,
		title: 'Filme A',
		poster_path: '/pathA.jpg',
		release_date: '1999-10-15',
	},
};

describe('MyReviews Page (Unit Tests)', () => {
	let queryClient;

	const mockShowToast = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		useToast.mockReturnValue({ showToast: mockShowToast });
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

	const renderComponent = () =>
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<MyReviews />
				</MemoryRouter>
			</QueryClientProvider>
		);

	it('Deve exibir EmptyState quando não há avaliações', async () => {
		getMyReviews.mockResolvedValue([]);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId('mock-empty-state')).toBeInTheDocument();
			expect(screen.getByText(/ainda não avaliou/i)).toBeInTheDocument();
		});
	});

	it('Deve renderizar uma avaliação com seus dados', async () => {
		getMyReviews.mockResolvedValue([mockReview]);
		renderComponent();

		await waitFor(() => {
			expect(screen.getByText('Filme A')).toBeInTheDocument();
		});
		expect(screen.getByText(/⭐ 8\/10/i)).toBeInTheDocument();
		expect(screen.getByText(/muito bom/i)).toBeInTheDocument();
	});

	it('Deve abrir modal de confirmação ao clicar em Excluir', async () => {
		const user = userEvent.setup();
		getMyReviews.mockResolvedValue([mockReview]);
		renderComponent();
		const deleteBtn = await screen.findByRole('button', { name: /excluir/i });
		await user.click(deleteBtn);

		await waitFor(() => {
			expect(screen.getByTestId('mock-modal')).toBeInTheDocument();
		});
		expect(screen.getByText(/confirmar exclusão/i)).toBeInTheDocument();
		expect(screen.getByText(/deseja excluir sua avaliação de/i)).toBeInTheDocument();
	});

	it('Deve fechar o modal ao clicar em Cancelar', async () => {
		const user = userEvent.setup();
		getMyReviews.mockResolvedValue([mockReview]);
		renderComponent();
		const deleteBtn = await screen.findByRole('button', { name: /excluir/i });
		await user.click(deleteBtn);
		const cancelBtn = await screen.findByRole('button', { name: /cancelar/i });
		await user.click(cancelBtn);

		await waitFor(() => {
			expect(screen.queryByTestId('mock-modal')).not.toBeInTheDocument();
		});
	});

	it('Deve chamar deleteReview ao confirmar exclusão e mostrar toast', async () => {
		const user = userEvent.setup();
		getMyReviews.mockResolvedValue([mockReview]);
		deleteReview.mockResolvedValue({ message: 'Avaliação removida com sucesso' });
		renderComponent();
		const deleteBtn = await screen.findByRole('button', { name: /excluir/i });
		await user.click(deleteBtn);
		const confirmButtons = screen.getAllByRole('button', { name: /excluir/i });
		await user.click(confirmButtons[confirmButtons.length - 1]);

		await waitFor(() => {
			expect(deleteReview).toHaveBeenCalledWith('1');
			expect(mockShowToast).toHaveBeenCalledWith({
				message: 'Avaliação removida com sucesso',
			});
		});
	});

	it('Deve exibir ErrorMessage em caso de falha ao carregar', async () => {
		getMyReviews.mockRejectedValue(new Error('Erro ao carregar avaliações'));
		renderComponent();

		await waitFor(() => {
			expect(screen.getByTestId('mock-error-message')).toBeInTheDocument();
			expect(screen.getByText(/erro ao carregar avaliações/i)).toBeInTheDocument();
		});
	});

	it('Deve navegar para o filme ao clicar no título', async () => {
		const user = userEvent.setup();
		getMyReviews.mockResolvedValue([mockReview]);
		renderComponent();
		const titleEl = await screen.findByText('Filme A');
		await user.click(titleEl);

		expect(mockNavigate).toHaveBeenCalledWith('/filme/550/filme-a');
	});

	it('Deve abrir edição ao clicar em Editar', async () => {
		const user = userEvent.setup();
		getMyReviews.mockResolvedValue([mockReview]);
		renderComponent();
		const editBtn = await screen.findByRole('button', { name: /editar/i });
		await user.click(editBtn);

		await waitFor(() => {
			expect(screen.getByTestId('mock-edit-movie-review')).toBeInTheDocument();
			expect(screen.getByText('Editando review 1')).toBeInTheDocument();
		});
	});
});

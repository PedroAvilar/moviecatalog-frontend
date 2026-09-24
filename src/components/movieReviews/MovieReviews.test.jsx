import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { createReview } from '../../services/apiService';
import userEvent from '@testing-library/user-event';
import MovieReviews from './MovieReviews';

const mockShowToast = vi.fn();

vi.mock('../../services/apiService', () => ({
	createReview: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
	useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock('../../context/AuthContext', () => ({
	useAuth: vi.fn(),
}));

describe('MovieReviews Component (Unit Tests)', () => {
	let queryClient;

	const user = userEvent.setup();

	const mockReviews = [
		{
			id: '1',
			userId: { id: 'user123', name: 'Pedro' },
			rating: 8,
			comment: 'Filme muito bom!',
			createdAt: '2026-04-20T10:00:00Z',
		},
	];

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		useAuth.mockReturnValue({ signed: false, user: null });
	});

	const renderComponent = (props = {}) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<MovieReviews movieId={123} reviews={[]} {...props} />
			</QueryClientProvider>
		);
	};

	it('Deve exibir mensagem para login se o usuário não estiver autenticado', () => {
		renderComponent();

		expect(screen.getByText(/faça login para avaliar esse filme/i)).toBeInTheDocument();
	});

	it('Deve exibir o formulário se o usuário estiver logado e não avaliou o filme', () => {
		useAuth.mockReturnValue({ signed: true, user: { id: 'user456' } });
		renderComponent();

		expect(screen.getByText(/deixe sua avaliação/i)).toBeInTheDocument();
	});

	it('Deve exibir mensagem de bloqueio se o usuário já avaliou o filme', () => {
		useAuth.mockReturnValue({ signed: true, user: { id: 'user123' } });
		renderComponent({ reviews: mockReviews });

		expect(screen.getByText(/você já avaliou esse filme/i)).toBeInTheDocument();
	});

	it('Deve renderizar a lista de avaliações corretamente', () => {
		renderComponent({ reviews: mockReviews });

		expect(screen.getByText('Pedro')).toBeInTheDocument();
		expect(screen.getByText('⭐ 8')).toBeInTheDocument();
		expect(screen.getByText(/filme muito bom!/i)).toBeInTheDocument();
	});

	it('Não deve chamar API se enviar formulário vazio', async () => {
		useAuth.mockReturnValue({ signed: true, user: { id: 'user456' } });
		renderComponent();
		await user.click(screen.getByRole('button', { name: /publicar/i }));

		await waitFor(() => {
			expect(createReview).not.toHaveBeenCalled();
		});
	});

	it('Deve chamar a API para criar review com sucesso e exibir toast', async () => {
		useAuth.mockReturnValue({ signed: true, user: { id: 'user456' } });
		createReview.mockResolvedValue('Avaliação criada!');
		renderComponent();
		const commentInput = screen.getByPlaceholderText(/o que você achou do filme/i);
		await user.type(commentInput, 'Gostei muito deste filme!');
		await user.click(screen.getByRole('button', { name: /publicar/i }));

		await waitFor(() => {
			expect(createReview).toHaveBeenCalledWith({
				movieId: 123,
				rating: 10,
				comment: 'Gostei muito deste filme!',
			});
		});
		await waitFor(() => {
			expect(mockShowToast).toHaveBeenCalledWith('Avaliação criada!');
		});
	});

	it('Deve exibir toast de erro se a API falhar', async () => {
		useAuth.mockReturnValue({ signed: true, user: { id: 'user456' } });
		createReview.mockRejectedValue(new Error('Erro interno'));
		renderComponent();
		const commentInput = screen.getByPlaceholderText(/o que você achou do filme/i);
		await user.type(commentInput, 'Muito bom!');
		await user.click(screen.getByRole('button', { name: /publicar/i }));

		await waitFor(() => {
			expect(createReview).toHaveBeenCalled();
		});
		await waitFor(() => {
			expect(mockShowToast).toHaveBeenCalledWith(expect.any(Error));
		});
	});
});

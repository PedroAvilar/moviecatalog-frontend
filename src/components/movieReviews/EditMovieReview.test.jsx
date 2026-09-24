import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { updateReview } from '../../services/apiService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import EditMovieReview from './EditMovieReview';

const mockShowToast = vi.fn();

vi.mock('../../services/apiService', () => ({
	updateReview: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
	useToast: () => ({ showToast: mockShowToast }),
}));

describe('EditMovieReview Component (Unit Tests)', () => {
	const mockReview = {
		id: 'rev123',
		rating: 7,
		comment: 'Comentário original',
		movie: { title: 'Filme A', id: 1 },
	};

	const user = userEvent.setup();

	const mockOnClose = vi.fn();

	let queryClient;

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
	});

	const renderComponent = (props = {}) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<EditMovieReview
					isOpen={true}
					onClose={mockOnClose}
					review={mockReview}
					{...props}
				/>
			</QueryClientProvider>
		);
	};

	it('Deve carregar os dados originais da avaliação no formulário ao abrir', () => {
		renderComponent();
		const ratingInput = screen.getByDisplayValue('7');
		const commentInput = screen.getByDisplayValue('Comentário original');

		expect(ratingInput).toBeInTheDocument();
		expect(commentInput).toBeInTheDocument();
	});

	it('Deve fechar o modal ao clicar no botão cancelar', async () => {
		renderComponent();
		const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
		await user.click(cancelBtn);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('Não deve chamar API se o formulário for inválido (comentário vazio)', async () => {
		renderComponent();
		const commentInput = screen.getByPlaceholderText(/edite seu comentário/i);
		await user.clear(commentInput);
		await user.click(screen.getByRole('button', { name: /salvar/i }));

		await waitFor(() => {
			expect(updateReview).not.toHaveBeenCalled();
		});
	});

	it('Deve chamar a API para salvar com sucesso, exibir toast e fechar', async () => {
		updateReview.mockResolvedValue('Avaliação atualizada!');
		renderComponent();
		const commentInput = screen.getByPlaceholderText(/edite seu comentário/i);
		await user.clear(commentInput);
		await user.type(commentInput, 'Comentário atualizado e muito bom!');
		await user.click(screen.getByRole('button', { name: /salvar/i }));

		await waitFor(() => {
			expect(updateReview).toHaveBeenCalledWith('rev123', {
				rating: 7,
				comment: 'Comentário atualizado e muito bom!',
			});
		});
		await waitFor(() => {
			expect(mockShowToast).toHaveBeenCalledWith('Avaliação atualizada!');
			expect(mockOnClose).toHaveBeenCalledTimes(1);
		});
	});

	it('Deve exibir toast de erro se a API falhar', async () => {
		updateReview.mockRejectedValue(new Error('Erro de API'));
		renderComponent();
		await user.click(screen.getByRole('button', { name: /salvar/i }));

		await waitFor(() => {
			expect(updateReview).toHaveBeenCalled();
		});
		await waitFor(() => {
			expect(mockShowToast).toHaveBeenCalledWith(expect.any(Error));
		});
		expect(mockOnClose).not.toHaveBeenCalled();
	});
});

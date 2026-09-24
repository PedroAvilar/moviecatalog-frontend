import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { register } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import userEvent from '@testing-library/user-event';
import Register from './Register';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('../../services/apiService', () => ({
	register: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
	useToast: vi.fn(),
}));

describe('Register Page (Unit Tests)', () => {
	let queryClient;
	const mockShowToast = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		useToast.mockReturnValue({ showToast: mockShowToast });
		queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
	});

	const renderComponent = () =>
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter>
					<Register />
				</MemoryRouter>
			</QueryClientProvider>
		);

	it('Deve renderizar o formulário de cadastro', () => {
		renderComponent();

		expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /cadastrar/i })).toBeInTheDocument();
	});

	it('Deve exibir erros de validação com campos vazios', async () => {
		const user = userEvent.setup();
		renderComponent();
		await user.click(screen.getByRole('button', { name: /cadastrar/i }));

		await waitFor(() => {
			expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
		});
		expect(register).not.toHaveBeenCalled();
	});

	it('Deve chamar register na API, mostrar toast e redirecionar para login', async () => {
		const user = userEvent.setup();
		register.mockResolvedValue({ message: 'Conta criada com sucesso!' });
		renderComponent();
		await user.type(screen.getByLabelText(/nome/i), 'Pedro Avilar');
		await user.type(screen.getByLabelText(/e-mail/i), 'pedro@test.com');
		await user.type(screen.getByLabelText(/senha/i), 'password123');
		await user.click(screen.getByRole('button', { name: /cadastrar/i }));

		await waitFor(() => {
			expect(register).toHaveBeenCalledWith({
				name: 'Pedro Avilar',
				email: 'pedro@test.com',
				password: 'password123',
			}, expect.anything());
			expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({ message: 'Conta criada com sucesso!' }));
			expect(mockNavigate).toHaveBeenCalledWith('/login');
			expect(mockShowToast).toHaveBeenCalledWith({ message: 'Faça o login!' });
		});
	});

	it('Deve exibir ErrorMessage do Toast se a API falhar', async () => {
		const user = userEvent.setup();
		register.mockRejectedValue(new Error('Email já em uso'));
		renderComponent();
		await user.type(screen.getByLabelText(/nome/i), 'Pedro Avilar');
		await user.type(screen.getByLabelText(/e-mail/i), 'pedro@test.com');
		await user.type(screen.getByLabelText(/senha/i), 'password123');
		await user.click(screen.getByRole('button', { name: /cadastrar/i }));

		await waitFor(() => {
			expect(register).toHaveBeenCalled();
			expect(mockShowToast).toHaveBeenCalledWith(new Error('Email já em uso'));
			expect(mockNavigate).not.toHaveBeenCalled();
		});
	});

	it('Deve exibir link para a página de login', () => {
		renderComponent();

		expect(screen.getByRole('link', { name: /fazer login/i })).toBeInTheDocument();
	});
});

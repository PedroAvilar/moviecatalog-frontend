import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import userEvent from '@testing-library/user-event';
import Login from './Login';

vi.mock('../../context/AuthContext', () => ({
	useAuth: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
	useToast: vi.fn(),
}));

describe('Login Page (Unit Tests)', () => {
	let queryClient;
	const mockLogin = vi.fn();
	const mockShowToast = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		useAuth.mockReturnValue({ login: mockLogin });
		useToast.mockReturnValue({ showToast: mockShowToast });
		queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
	});

	const renderComponent = (initialEntries = ['/login']) => {
		return render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter initialEntries={initialEntries}>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/" element={<div data-testid="home-page" />} />
						<Route path="/favorites" element={<div data-testid="favorites-page" />} />
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>
		);
	};

	it('Deve renderizar os campos de e-mail e senha', () => {
		renderComponent();

		expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
		expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
	});

	it('Deve exibir mensagens de erro ao submeter o formulário vazio', async () => {
		const user = userEvent.setup();
		renderComponent();
		const btn = screen.getByRole('button', { name: /entrar/i });
		await user.click(btn);

		await waitFor(() => {
			expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
			expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
		});
		expect(mockLogin).not.toHaveBeenCalled();
	});

	it('Deve realizar login com sucesso, exibir toast e navegar para home', async () => {
		const user = userEvent.setup();
		mockLogin.mockResolvedValue({ message: 'Login realizado com sucesso' });
		renderComponent();
		await user.type(screen.getByLabelText(/e-mail/i), 'teste@exemplo.com');
		await user.type(screen.getByLabelText(/senha/i), '123456');
		const btn = screen.getByRole('button', { name: /entrar/i });
		await user.click(btn);

		await waitFor(() => {
			expect(mockLogin).toHaveBeenCalledWith('teste@exemplo.com', '123456');
			expect(mockShowToast).toHaveBeenCalledWith({ message: 'Login realizado com sucesso' });
			expect(screen.getByTestId('home-page')).toBeInTheDocument();
		});
	});

	it('Deve redirecionar para a página de origem (location.state.from) após login bem-sucedido', async () => {
		const user = userEvent.setup();
		mockLogin.mockResolvedValue({ message: 'Bem-vindo' });
		render(
			<QueryClientProvider client={queryClient}>
				<MemoryRouter
					initialEntries={[{ pathname: '/login', state: { from: { pathname: '/favorites' } } }]}
				>
					<Routes>
						<Route path="/login" element={<Login />} />
						<Route path="/favorites" element={<div data-testid="favorites-page" />} />
					</Routes>
				</MemoryRouter>
			</QueryClientProvider>
		);
		await user.type(screen.getByLabelText(/e-mail/i), 'teste@exemplo.com');
		await user.type(screen.getByLabelText(/senha/i), '123456');
		const btn = screen.getByRole('button', { name: /entrar/i });
		await user.click(btn);

		await waitFor(() => {
			expect(screen.getByTestId('favorites-page')).toBeInTheDocument();
		});
	});

	it('Deve exibir erro no toast se o login falhar', async () => {
		const user = userEvent.setup();
		const error = new Error('Credenciais inválidas');
		mockLogin.mockRejectedValue(error);
		renderComponent();
		await user.type(screen.getByLabelText(/e-mail/i), 'teste@exemplo.com');
		await user.type(screen.getByLabelText(/senha/i), 'errada');
		const btn = screen.getByRole('button', { name: /entrar/i });
		await user.click(btn);

		await waitFor(() => { expect(mockShowToast).toHaveBeenCalledWith(error) });
		expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
	});
});

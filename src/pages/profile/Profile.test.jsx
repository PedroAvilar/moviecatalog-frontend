import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { updatePassword, updateProfile, deleteAccount } from '../../services/apiService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import userEvent from '@testing-library/user-event';
import Profile from './Profile';

vi.mock('../../services/apiService', () => ({
	updatePassword: vi.fn(),
	updateProfile: vi.fn(),
	deleteAccount: vi.fn(),
}));

vi.mock('../../context/AuthContext', () => ({
	useAuth: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
	useToast: vi.fn(),
}));

vi.mock('../../components/modal/Modal', () => ({
	default: ({ isOpen, title, children }) => {
		if (!isOpen) return null;
		return (
			<div data-testid={`mock-modal-${title}`}>
				<h3>{title}</h3>
				{children}
			</div>
		);
	},
}));

describe('Profile Page (Unit Tests)', () => {
	let queryClient;

	const mockUpdateUser = vi.fn();
	const mockLogout = vi.fn();
	const mockShowToast = vi.fn();

	const mockUser = {
		name: 'Pedro Avilar',
		email: 'pedro@exemplo.com',
	};

	beforeEach(() => {
		vi.clearAllMocks();
		useAuth.mockReturnValue({
			user: mockUser,
			updateUser: mockUpdateUser,
			logout: mockLogout,
		});
		useToast.mockReturnValue({ showToast: mockShowToast });
		queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
	});

	const renderComponent = () =>
		render(
			<QueryClientProvider client={queryClient}>
				<Profile />
			</QueryClientProvider>
		);

	it('Deve renderizar os dados do usuário', () => {
		renderComponent();

		expect(screen.getByText(/pedro avilar/i)).toBeInTheDocument();
		expect(screen.getByText(/pedro@exemplo.com/i)).toBeInTheDocument();
	});

	describe('Edição de Perfil', () => {
		it('Deve abrir o modal de edição e atualizar perfil com sucesso', async () => {
			const user = userEvent.setup();
			updateProfile.mockResolvedValue({
				user: {
					name: 'Pedro Atualizado',
					email: 'pedro.novo@exemplo.com'
				},
				message: 'Perfil atualizado'
			});
			renderComponent();
			const editBtn = screen.getByRole('button', { name: /editar/i });
			await user.click(editBtn);

			expect(screen.getByTestId('mock-modal-Editar Perfil')).toBeInTheDocument();

			const nameInput = screen.getByPlaceholderText('Nome');
			await user.clear(nameInput);
			await user.type(nameInput, 'Pedro Atualizado');
			const saveBtn = screen.getByRole('button', { name: /salvar/i });
			await user.click(saveBtn);

			await waitFor(() => {
				expect(updateProfile).toHaveBeenCalledWith({ name: 'Pedro Atualizado', email: 'pedro@exemplo.com' }, expect.anything());
				expect(mockUpdateUser).toHaveBeenCalledWith({ name: 'Pedro Atualizado', email: 'pedro.novo@exemplo.com' });
				expect(mockShowToast).toHaveBeenCalledWith(expect.objectContaining({ message: 'Perfil atualizado' }));
				expect(screen.queryByTestId('mock-modal-Editar Perfil')).not.toBeInTheDocument();
			});
		});

		it('Deve validar campos no modal de edição', async () => {
			const user = userEvent.setup();
			renderComponent();
			const editBtn = screen.getByRole('button', { name: /editar/i });
			await user.click(editBtn);
			const nameInput = screen.getByPlaceholderText('Nome');
			await user.clear(nameInput);
			const saveBtn = screen.getByRole('button', { name: /salvar/i });
			await user.click(saveBtn);

			await waitFor(() => {
				expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument();
			});
			expect(updateProfile).not.toHaveBeenCalled();
		});
	});

	describe('Alteração de Senha', () => {
		it('Deve abrir o modal de senha e alterar a senha com sucesso', async () => {
			const user = userEvent.setup();
			updatePassword.mockResolvedValue({ message: 'Senha atualizada' });
			renderComponent();
			const passBtn = screen.getByRole('button', { name: /alterar senha/i });
			await user.click(passBtn);

			expect(screen.getByTestId('mock-modal-Alterar senha')).toBeInTheDocument();

			await user.type(screen.getByPlaceholderText('Senha atual'), 'senha123');
			await user.type(screen.getByPlaceholderText('Nova senha'), 'novasenha');
			await user.type(screen.getByPlaceholderText('Confirmar nova senha'), 'novasenha');
			const saveBtn = screen.getByRole('button', { name: /salvar/i });
			await user.click(saveBtn);

			await waitFor(() => {
				expect(updatePassword).toHaveBeenCalledWith({ currentPassword: 'senha123', newPassword: 'novasenha' }, expect.anything());
				expect(mockShowToast).toHaveBeenCalledWith({ message: 'Senha atualizada' });
				expect(screen.queryByTestId('mock-modal-Alterar senha')).not.toBeInTheDocument();
			});
		});

		it('Deve validar incompatibilidade de senhas', async () => {
			const user = userEvent.setup();
			renderComponent();
			const passBtn = screen.getByRole('button', { name: /alterar senha/i });
			await user.click(passBtn);
			await user.type(screen.getByPlaceholderText('Senha atual'), 'senha123');
			await user.type(screen.getByPlaceholderText('Nova senha'), 'novasenha');
			await user.type(screen.getByPlaceholderText('Confirmar nova senha'), 'diferente');
			const saveBtn = screen.getByRole('button', { name: /salvar/i });
			await user.click(saveBtn);

			await waitFor(() => {
				expect(screen.getByText(/as senhas não correspondem/i)).toBeInTheDocument();
			});
			expect(updatePassword).not.toHaveBeenCalled();
		});
	});

	describe('Exclusão de Conta', () => {
		it('Deve abrir o modal e excluir a conta com sucesso', async () => {
			const user = userEvent.setup();
			deleteAccount.mockResolvedValue({ message: 'Conta excluída' });
			renderComponent();
			const deleteBtn = screen.getByRole('button', { name: /excluir conta/i });
			await user.click(deleteBtn);

			expect(screen.getByTestId('mock-modal-Confirmar exclusão')).toBeInTheDocument();
			expect(screen.getByText('Pedro Avilar')).toBeInTheDocument();

			const confirmBtn = screen.getAllByRole('button', { name: /excluir/i })[1];
			await user.click(confirmBtn);

			await waitFor(() => {
				expect(deleteAccount).toHaveBeenCalled();
				expect(mockLogout).toHaveBeenCalled();
				expect(mockShowToast).toHaveBeenCalledWith({ message: 'Conta excluída' });
			});
		});

		it('Deve fechar o modal de exclusão ao cancelar', async () => {
			const user = userEvent.setup();
			renderComponent();
			const deleteBtn = screen.getByRole('button', { name: /excluir conta/i });
			await user.click(deleteBtn);
			const cancelBtn = screen.getByRole('button', { name: /cancelar/i });
			await user.click(cancelBtn);

			await waitFor(() => {
				expect(screen.queryByTestId('mock-modal-Confirmar exclusão')).not.toBeInTheDocument();
			});
			expect(deleteAccount).not.toHaveBeenCalled();
		});
	});
});

import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuth } from '../../context/AuthContext';
import { getGenres } from '../../services/apiService';
import userEvent from '@testing-library/user-event';
import Header from './Header';

vi.mock('../../context/AuthContext', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useAuth: vi.fn(),
	};
});

vi.mock('../../services/apiService', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		getGenres: vi.fn(),
		getMe: vi.fn().mockResolvedValue({ user: null }),
	};
});

vi.mock('../navDropdown/NavDropdown', () => ({
	default: ({ label, items = [], isOpen, onToggle, onCloseMenu }) => (
		<div data-testid={`dropdown-${label}`}>
			<button onClick={() => onToggle(!isOpen)} aria-expanded={isOpen}>
				{label}
			</button>
			{isOpen && (
				<ul data-testid="dropdown-items">
					{items.map((item, i) => (
						<li key={i}>
							{item.type === 'button' ? (
								<button
									onClick={() => {
										item.onClick();
										onCloseMenu();
									}}
								>
									{item.label}
								</button>
							) : (
								<div onClick={onCloseMenu}>{item.label}</div>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	),
}));

const mockLogout = vi.fn();

const renderHeader = async () => {
	const utils = render(
		<MemoryRouter>
			<Header />
		</MemoryRouter>,
	);
	await waitFor(() => expect(getGenres).toHaveBeenCalled());
	return utils;
};

const mockGenres = [
	{ id: 1, name: 'Ação' },
	{ id: 2, name: 'Drama' },
];

describe('Header Component (Unit Tests)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		document.body.style.overflow = 'auto';
		useAuth.mockReturnValue({
			signed: false,
			user: null,
			logout: mockLogout,
		});
		getGenres.mockResolvedValue([]);
	});

	function setupAuth(signed = false) {
		useAuth.mockReturnValue({
			signed,
			user: signed ? { name: 'Pedro Avilar' } : null,
			logout: mockLogout,
		});
	}

	it('Deve renderizar os links básicos de navegação', async () => {
		await renderHeader();

		expect(screen.getByText(/página inicial/i)).toBeInTheDocument();
		expect(screen.getByText(/favoritos/i)).toBeInTheDocument();
		expect(screen.getByText(/sobre/i)).toBeInTheDocument();
	});

	it('Deve abrir e fechar o menu mobile ao clicar no toggle', async () => {
		const user = userEvent.setup();
		await renderHeader();
		const toggle = screen.getByLabelText(/abrir menu/i);

		expect(toggle).toHaveAttribute('aria-expanded', 'false');

		await user.click(toggle);

		expect(toggle).toHaveAttribute('aria-expanded', 'true');
		expect(toggle.getAttribute('aria-label')).toMatch(/fechar menu/i);

		await user.click(toggle);

		expect(toggle).toHaveAttribute('aria-expanded', 'false');
	});

	it('Deve bloquear o scroll do body quando o menu mobile está aberto', async () => {
		const user = userEvent.setup();
		await renderHeader();
		await user.click(screen.getByLabelText(/abrir menu/i));

		expect(document.body.style.overflow).toBe('hidden');

		await user.click(screen.getByLabelText(/fechar menu/i));

		expect(document.body.style.overflow).toBe('auto');
	});

	it('Deve fechar o menu mobile ao clicar no overlay', async () => {
		const user = userEvent.setup();
		await renderHeader();
		await user.click(screen.getByLabelText(/abrir menu/i));
		const overlay = document.querySelector('.menu-overlay');
		await user.click(overlay);

		expect(screen.getByLabelText(/abrir menu/i)).toHaveAttribute('aria-expanded', 'false');
	});

	it('Deve fechar dropdown ao fechar o menu', async () => {
		const user = userEvent.setup();
		getGenres.mockResolvedValue(mockGenres);
		await renderHeader();
		await user.click(screen.getByText(/categorias/i));

		expect(screen.getByText(/ação/i)).toBeInTheDocument();

		await user.click(screen.getByLabelText(/abrir menu/i));
		await user.click(screen.getByLabelText(/fechar menu/i));

		expect(screen.queryByText(/ação/i)).not.toBeInTheDocument();
	});

	it('Deve lidar com lista de categorias undefined sem quebrar', async () => {
		getGenres.mockResolvedValue(undefined);
		await renderHeader();

		expect(screen.getByText(/categorias/i)).toBeInTheDocument();
	});

	it('Deve lidar com lista de categorias vazia', async () => {
		getGenres.mockResolvedValue([]);
		const user = userEvent.setup();
		await renderHeader();
		await user.click(screen.getByText(/categorias/i));

		expect(screen.queryByTestId('dropdown-items')).toBeInTheDocument();
		expect(screen.queryByText(/ação/i)).not.toBeInTheDocument();
	});

	it('Deve fechar dropdown de categorias ao abrir dropdown do usuário', async () => {
		const user = userEvent.setup();
		setupAuth(true);
		getGenres.mockResolvedValue(mockGenres);
		await renderHeader();
		await user.click(screen.getByText(/categorias/i));

		expect(screen.getByText(/ação/i)).toBeInTheDocument();

		await user.click(screen.getByText(/olá, pedro/i));

		expect(screen.queryByText(/ação/i)).not.toBeInTheDocument();
		expect(screen.getByText(/minhas avaliações/i)).toBeInTheDocument();
	});

	it('Deve exibir botão "Entrar" quando o usuário não está autenticado', async () => {
		setupAuth(false);
		await renderHeader();

		expect(screen.getByText(/entrar/i)).toBeInTheDocument();
		expect(screen.queryByText(/olá,/i)).not.toBeInTheDocument();
	});

	it('Deve exibir o menu do usuário quando autenticado', async () => {
		setupAuth(true);
		await renderHeader();

		expect(await screen.findByText(/olá, pedro/i)).toBeInTheDocument();
		expect(screen.queryByText(/entrar/i)).not.toBeInTheDocument();
	});

	it('Deve chamar o logout ao clicar no botão Sair no menu do usuário', async () => {
		const user = userEvent.setup();
		setupAuth(true);
		await renderHeader();
		await user.click(screen.getByText(/olá, pedro/i));
		const logoutBtn = screen.getByText(/sair/i);
		await user.click(logoutBtn);

		expect(mockLogout).toHaveBeenCalledTimes(1);
	});

	it('Deve exibir fallback Usuário quando nome for inválido', async () => {
		useAuth.mockReturnValue({
			signed: true,
			user: { name: null },
			logout: mockLogout,
		});
		await renderHeader();

		expect(screen.getByText(/olá, usuário/i)).toBeInTheDocument();
	});

	it('Deve buscar e renderizar categorias corretamente no dropdown', async () => {
		getGenres.mockResolvedValue(mockGenres);
		const user = userEvent.setup();
		await renderHeader();
		const catBtn = screen.getByText(/categorias/i);
		await user.click(catBtn);

		expect(await screen.findByText(/ação/i)).toBeInTheDocument();
		expect(screen.getByText(/drama/i)).toBeInTheDocument();
	});

	it('Deve lidar com falha na busca de categorias silenciosamente (console.error)', async () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
		getGenres.mockRejectedValue(new Error('Erro de Conexão'));
		await renderHeader();

		await waitFor(() => {
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining('Erro ao carregar gêneros'),
				expect.any(Error),
			);
		});
		consoleSpy.mockRestore();
	});

	it('Deve fechar o menu mobile ao clicar em um link de navegação', async () => {
		const user = userEvent.setup();
		await renderHeader();
		const toggle = screen.getByLabelText(/abrir menu/i);
		await user.click(toggle);
		await user.click(screen.getByText(/favoritos/i));

		expect(toggle).toHaveAttribute('aria-expanded', 'false');
	});

	it('Deve resetar overflow ao desmontar o componente', async () => {
		document.body.style.overflow = 'hidden';
		const { unmount } = await renderHeader();
		unmount();

		expect(document.body.style.overflow).toBe('auto');
	});

	it('Deve aplicar classes dinâmicas ao botão de toggle', async () => {
		const user = userEvent.setup();
		await renderHeader();
		const toggle = screen.getByLabelText(/abrir menu/i);

		expect(toggle).not.toHaveClass('open');

		await user.click(toggle);

		expect(toggle).toHaveClass('open');
	});
});

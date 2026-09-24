import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getFavorites, toggleFavorite, getMe } from '../../services/apiService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FavoriteButton from './FavoriteButton';
import userEvent from '@testing-library/user-event';

vi.mock('../../services/apiService', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		getFavorites: vi.fn(),
		toggleFavorite: vi.fn(),
		getMe: vi.fn().mockResolvedValue({ user: null }),
	};
});

let mockUserState = null;

vi.mock('../../context/AuthContext', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useAuth: () => ({
			user: mockUserState,
		}),
	};
});

const showToastMock = vi.fn();

vi.mock('../../context/ToastContext', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useToast: () => ({
			showToast: showToastMock,
		}),
	};
});

const mockMovie = { id: 1, title: 'Filme A' };

const customRender = (ui, options = {}) => {
	const queryClient =
		options.queryClient ||
		new QueryClient({
			defaultOptions: {
				queries: { retry: false },
			},
		});

	return render(
		<QueryClientProvider client={queryClient}>
			{ui}
		</QueryClientProvider>
	);
};

describe('FavoriteButton Component (Unit Tests)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUserState = { id: 'user123' };
		getMe.mockResolvedValue({ user: { id: 'user123' } });
	});

	it('Deve mostrar mensagem se o usuário não estiver logado ao clicar', async () => {
		mockUserState = null;
		getMe.mockResolvedValue({ user: null });
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(showToastMock).toHaveBeenCalledWith('Faça login para favoritar filmes');
		expect(toggleFavorite).not.toHaveBeenCalled();
	});

	it('Não deve chamar getFavorites quando usuário não está logado', async () => {
		mockUserState = null;
		getMe.mockResolvedValue({ user: null });
		customRender(<FavoriteButton movie={mockMovie} />);

		await waitFor(() => {
			expect(getFavorites).not.toHaveBeenCalled();
		});
	});

	it('Deve assumir lista vazia quando favorites for null', async () => {
		getFavorites.mockResolvedValue(null);
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button');

		expect(button).not.toHaveClass('active');
	});

	it('Deve renderizar como ativo se o filme estiver na lista de favoritos', async () => {
		getFavorites.mockResolvedValue([mockMovie]);
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button', {
			name: /remover dos favoritos/i,
		});

		expect(button).toHaveClass('active');
	});

	it('Deve aplicar optimistic update ao clicar (enquanto a API está pendente)', async () => {
		getFavorites.mockResolvedValue([]);
		toggleFavorite.mockReturnValue(new Promise(() => { }));
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button', {
			name: /adicionar aos favoritos/i,
		});
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveClass('active');
			expect(button.getAttribute('aria-label')).toMatch(
				/remover dos favoritos/i,
			);
		});
	});

	it('Deve realizar rollback se a mutação falhar', async () => {
		getFavorites.mockResolvedValue([]);
		toggleFavorite.mockReturnValue(
			new Promise((_, reject) => {
				setTimeout(() => reject(new Error('Erro de API')), 50);
			}),
		);
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button', {
			name: /adicionar aos favoritos/i,
		});
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveClass('active');
		});
		await waitFor(() => {
			expect(button).not.toHaveClass('active');
			expect(button.getAttribute('aria-label')).toMatch(
				/adicionar aos favoritos/i,
			);
		});
		expect(showToastMock).toHaveBeenCalledWith(expect.any(Error));
	});

	it('Deve lidar corretamente enquanto favorites ainda está carregando', async () => {
		getFavorites.mockReturnValue(new Promise(() => { }));
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button');

		expect(button).toBeInTheDocument();
		expect(button).not.toHaveClass('active');
	});

	it('Não deve quebrar se movie for inválido', async () => {
		getFavorites.mockResolvedValue([]);

		expect(() => {
			customRender(<FavoriteButton movie={null} />);
		}).not.toThrow();
	});

	it('Deve remover dos favoritos quando já estiver favoritado (optimistic)', async () => {
		getFavorites.mockResolvedValue([mockMovie]);
		toggleFavorite.mockReturnValue(new Promise(() => { }));
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button', {
			name: /remover dos favoritos/i,
		});
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).not.toHaveClass('active');
			expect(button.getAttribute('aria-label')).toMatch(/adicionar/i);
		});
	});

	it('Não deve disparar múltiplas mutações em cliques rápidos', async () => {
		const user = userEvent.setup();
		getFavorites.mockResolvedValue([]);
		let resolveMutation;
		toggleFavorite.mockReturnValue(
			new Promise((resolve) => {
				resolveMutation = resolve;
			}),
		);
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button');

		await waitFor(() => {
			expect(button).toBeEnabled();
		});

		await user.click(button);
		await user.click(button);
		await user.click(button);

		await waitFor(() => {
			expect(toggleFavorite).toHaveBeenCalledTimes(1);
		});
	});

	it('Deve impedir a propagação do evento de clique (stopPropagation)', async () => {
		getFavorites.mockResolvedValue([]);
		const parentClick = vi.fn();
		customRender(
			<div onClick={parentClick}>
				<FavoriteButton movie={mockMovie} />
			</div>,
		);
		const button = await screen.findByRole('button');
		fireEvent.click(button);

		expect(parentClick).not.toHaveBeenCalled();
	});

	it('Deve alternar label e classe após sucesso completo (considerando refetch)', async () => {
		getFavorites.mockResolvedValueOnce([]);
		getFavorites.mockResolvedValue([mockMovie]);
		toggleFavorite.mockResolvedValue('Sucesso');
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button', { name: /adicionar/i });
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toHaveClass('active');
			expect(button.getAttribute('aria-label')).toMatch(
				/remover dos favoritos/i,
			);
		});
	});

	it('Deve ter aria-label correto quando não é favorito', async () => {
		getFavorites.mockResolvedValue([]);
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button');

		expect(button).toHaveAttribute('aria-label', 'Adicionar aos favoritos');
	});

	it('Deve aplicar a variant floating corretamente', async () => {
		customRender(
			<FavoriteButton movie={mockMovie} variant="floating" />,
		);
		const button = await screen.findByRole('button');

		expect(button).toHaveClass('floating');
	});

	it('Deve aplicar o tamanho via style', async () => {
		const customSize = 45;
		customRender(<FavoriteButton movie={mockMovie} size={customSize} />);
		const button = await screen.findByRole('button');

		expect(button.style.width).toBe(`${customSize}px`);
		expect(button.style.height).toBe(`${customSize}px`);
	});

	it('Deve desabilitar o botão enquanto a mutação está em progresso', async () => {
		getFavorites.mockResolvedValue([]);
		let resolveMutation;
		toggleFavorite.mockReturnValue(
			new Promise((resolve) => {
				resolveMutation = resolve;
			}),
		);
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			expect(button).toBeDisabled();
		});
		await act(async () => {
			resolveMutation('Ok');
		});
		await waitFor(() => {
			expect(button).not.toBeDisabled();
		});
	});

	it('Deve exibir toast de sucesso após mutação bem-sucedida', async () => {
		getFavorites.mockResolvedValue([]);
		toggleFavorite.mockResolvedValue('Filme favoritado');
		customRender(<FavoriteButton movie={mockMovie} />);
		const button = await screen.findByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			expect(showToastMock).toHaveBeenCalledWith('Filme favoritado');
		});
	});

	it('Deve invalidar o cache após a mutação', async () => {
		getFavorites.mockResolvedValue([]);
		toggleFavorite.mockResolvedValue('Ok');
		const queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries');
		customRender(<FavoriteButton movie={mockMovie} />, { queryClient });
		const button = await screen.findByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			expect(invalidateSpy).toHaveBeenCalledWith({
				queryKey: ['favorites', 'user123'],
			});
		});
	});

	it('Deve cancelar queries antes do optimistic update', async () => {
		getFavorites.mockResolvedValue([]);
		const queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		const cancelSpy = vi.spyOn(queryClient, 'cancelQueries');
		customRender(<FavoriteButton movie={mockMovie} />, { queryClient });
		const button = await screen.findByRole('button');
		fireEvent.click(button);

		await waitFor(() => {
			expect(cancelSpy).toHaveBeenCalledWith({
				queryKey: ['favorites', 'user123'],
			});
		});
	});

	it('Deve atualizar favoritos ao trocar de usuário', async () => {
		getFavorites.mockResolvedValueOnce([]);
		const queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
		const { rerender } = customRender(
			<FavoriteButton movie={mockMovie} />,
			{ queryClient },
		);
		await screen.findByRole('button');
		mockUserState = { id: 'user456' };
		getFavorites.mockResolvedValueOnce([mockMovie]);
		rerender(
			<QueryClientProvider client={queryClient}>
				<FavoriteButton movie={mockMovie} />
			</QueryClientProvider>,
		);
		const button = await screen.findByRole('button');

		await waitFor(() => {
			expect(button).toHaveClass('active');
		});
	});
});

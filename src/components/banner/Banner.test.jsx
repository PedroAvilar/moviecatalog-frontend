import { screen, fireEvent, act, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Banner from './Banner';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('./BannerSkeleton', () => ({
	default: () => <div data-testid="banner-skeleton">Mocked Skeleton</div>,
}));

vi.mock('../../utils/slugify', () => ({
	slugify: vi.fn(() => 'mocked-slug'),
}));

vi.mock('../../utils/getBackDrop', () => ({
	getBackdropUrl: vi.fn((path) => `http://mocked-url.com${path}`),
}));

describe('Banner Component (Unit Tests)', () => {
	const mockMovies = [
		{
			id: 1,
			title: 'Filme A',
			overview: 'Desc A',
			backdrop_path: '/pathA.jpg',
		},
		{
			id: 2,
			title: 'Filme B',
			overview: 'Desc B',
			backdrop_path: '/pathB.jpg',
		},
		{
			id: 3,
			title: 'Filme C',
			overview: 'Desc C',
			backdrop_path: '/pathC.jpg',
		},
	];

	const renderBanner = (movies = mockMovies) => {
		const result = render(
			<MemoryRouter initialEntries={['/']}>
				<Banner movies={movies} />
			</MemoryRouter>,
		);

		return {
			...result,
			rerenderBanner: (newMovies) =>
				result.rerender(
					<MemoryRouter initialEntries={['/']}>
						<Banner movies={newMovies} />
					</MemoryRouter>,
				),
		};
	};

	beforeEach(() => {
		vi.useFakeTimers();
		vi.clearAllMocks();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('Deve renderizar o skeleton quando não há filmes', () => {
		render(<Banner movies={[]} />);

		expect(screen.getByTestId('banner-skeleton')).toBeInTheDocument();
	});

	it('Deve renderizar skeleton quando movies for null', () => {
		render(<Banner movies={null} />);

		expect(screen.getByTestId('banner-skeleton')).toBeInTheDocument();
	});

	it('Não deve tentar mudar slide sem filmes', () => {
		const setIntervalSpy = vi.spyOn(global, 'setInterval');
		render(<Banner movies={[]} />);

		expect(setIntervalSpy).not.toHaveBeenCalled();
	});

	it('Deve resetar para index 0 se movie atual for inválido', () => {
		renderBanner([{}, null]);

		expect(screen.getByRole('region')).toBeInTheDocument();
	});

	it('Não deve entrar em loop ao receber movie inválido', () => {
		const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { });
		renderBanner([null]);

		expect(consoleSpy).not.toHaveBeenCalled();
		consoleSpy.mockRestore();
	});

	it('Deve lidar com filme incompleto sem quebrar', () => {
		renderBanner([{ id: 1 }]);

		expect(screen.getByRole('region')).toBeInTheDocument();
	});

	it('Deve remover skeleton após imagem carregar', () => {
		renderBanner();
		const img = screen.getByTestId('hidden-image');
		act(() => {
			fireEvent.load(img);
		});
		const bannerImage = screen.getByTestId('banner-background');

		expect(bannerImage).toHaveClass('show');
		expect(screen.queryByTestId('banner-skeleton')).not.toBeInTheDocument();
	});

	it('Não deve aplicar background antes da imagem carregar', () => {
		renderBanner();
		const bannerImage = screen.getByTestId('banner-background');

		expect(bannerImage.style.backgroundImage).toBe('');
	});

	it('Não deve mudar de slide com apenas 1 filme', () => {
		renderBanner([mockMovies[0]]);
		act(() => {
			vi.advanceTimersByTime(16000);
		});

		expect(screen.getByText('Filme A')).toBeInTheDocument();
	});

	it('Deve parar o autoSlide se movies se tornar vazio', () => {
		const { rerenderBanner } = renderBanner();
		rerenderBanner([]);
		act(() => {
			vi.advanceTimersByTime(8000);
		});

		expect(screen.queryByRole('region')).toBeNull();
	});

	it('Deve iniciar autoSlide quando movies passa de vazio para preenchido', () => {
		const { rerenderBanner } = renderBanner([]);
		rerenderBanner(mockMovies);
		act(() => {
			vi.advanceTimersByTime(8000);
		});

		expect(screen.getByText('Filme B')).toBeInTheDocument();
	});

	it('Deve exibir fallback de descrição quando overview não existir', () => {
		const movies = [{ id: 1, title: 'Filme D', backdrop_path: '/pathD.jpg' }];
		renderBanner(movies);

		expect(screen.getByText('Sem descrição.')).toBeInTheDocument();
	});

	it('Deve renderizar o primeiro filme da lista inicialmente', () => {
		renderBanner();

		expect(screen.getByText('Filme A')).toBeInTheDocument();
		expect(screen.getByText('Desc A')).toBeInTheDocument();
	});

	it('Deve navegar para os próximos filmes automaticamente após o intervalo', () => {
		renderBanner();

		expect(screen.getByText('Filme A')).toBeInTheDocument();

		act(() => {
			vi.advanceTimersByTime(8000);
		});

		expect(screen.getByText('Filme B')).toBeInTheDocument();
	});

	it('Deve mudar o filme ao clicar nos dots', () => {
		renderBanner();
		const dots = screen.getAllByRole('button', { name: /ir para o slide/i });
		fireEvent.click(dots[2]);

		expect(screen.getByText('Filme C')).toBeInTheDocument();
	});

	it('Não deve reiniciar autoSlide ao clicar no dot ativo', () => {
		const setSpy = vi.spyOn(global, 'setInterval');
		renderBanner();
		const dots = screen.getAllByRole('button', { name: /ir para o slide/i });
		fireEvent.click(dots[0]);

		expect(setSpy).toHaveBeenCalledTimes(1);
	});

	it('Não deve navegar para a página de detalhes ao clicar no dot', () => {
		renderBanner();
		const dots = screen.getAllByRole('button', { name: /ir para o slide/i });
		fireEvent.click(dots[1]);

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('Deve navegar para a página de detalhes ao clicar no banner com slug correto', () => {
		renderBanner();
		fireEvent.click(screen.getByText('Filme A').closest('.banner-overlay'));

		expect(mockNavigate).toHaveBeenCalledWith('/filme/1/mocked-slug');
	});

	it('Deve mudar de slide ao realizar o gesto de swipe', () => {
		renderBanner();
		const banner = screen.getByRole('region', { name: /banner de filmes/i });
		fireEvent.touchStart(banner, { touches: [{ clientX: 300 }] });
		fireEvent.touchMove(banner, { touches: [{ clientX: 100 }] });
		fireEvent.touchEnd(banner);

		expect(screen.getByText('Filme B')).toBeInTheDocument();

		fireEvent.touchStart(banner, { touches: [{ clientX: 100 }] });
		fireEvent.touchMove(banner, { touches: [{ clientX: 300 }] });
		fireEvent.touchEnd(banner);

		expect(screen.getByText('Filme A')).toBeInTheDocument();
	});

	it('Não deve mudar de slide com swipe pequeno', () => {
		renderBanner();
		const banner = screen.getByRole('region', { name: /banner de filmes/i });
		fireEvent.touchStart(banner, { touches: [{ clientX: 300 }] });
		fireEvent.touchMove(banner, { touches: [{ clientX: 260 }] });
		fireEvent.touchEnd(banner);

		expect(screen.getByText('Filme A')).toBeInTheDocument();
	});

	it('Deve mudar de slide corretamente com swipe para índice negativo', () => {
		renderBanner();
		const banner = screen.getByRole('region', { name: /banner de filmes/i });
		fireEvent.touchStart(banner, { touches: [{ clientX: 100 }] });
		fireEvent.touchMove(banner, { touches: [{ clientX: 300 }] });
		fireEvent.touchEnd(banner);

		expect(screen.getByText('Filme C')).toBeInTheDocument();
	});

	it('Não deve mudar slide se touchStart ou touchEnd não existirem', () => {
		renderBanner();
		const banner = screen.getByRole('region', { name: /banner de filmes/i });
		fireEvent.touchEnd(banner);

		expect(screen.getByText('Filme A')).toBeInTheDocument();
	});

	it('Deve resetar o autoSlide ao trocar manualmente de slide', () => {
		const setIntervalSpy = vi.spyOn(global, 'setInterval');
		renderBanner();
		const dots = screen.getAllByRole('button', { name: /ir para o slide/i });
		fireEvent.click(dots[1]);

		expect(setIntervalSpy).toHaveBeenCalledTimes(2);
	});

	it('Deve voltar para o primeiro slide após o último', () => {
		renderBanner();
		act(() => {
			vi.advanceTimersByTime(8000 * 3);
		});

		expect(screen.getByText('Filme A')).toBeInTheDocument();
	});

	it('Deve limpar o intervalo anterior antes de iniciar outro', () => {
		const clearSpy = vi.spyOn(global, 'clearInterval');
		const setSpy = vi.spyOn(global, 'setInterval');
		renderBanner();
		const dots = screen.getAllByRole('button', { name: /ir para o slide/i });
		fireEvent.click(dots[1]);

		expect(clearSpy).toHaveBeenCalled();
		expect(setSpy).toHaveBeenCalledTimes(2);
	});

	it('Deve limpar o intervalo ao desmontar', () => {
		const { unmount } = renderBanner();
		const clearSpy = vi.spyOn(global, 'clearInterval');
		unmount();

		expect(clearSpy).toHaveBeenCalled();
	});
});

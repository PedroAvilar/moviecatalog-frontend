import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { getPosterUrl } from '../../utils/getPosterUrl';
import MoviePoster from './MoviePoster';
import userEvent from '@testing-library/user-event';

const mockOnClick = vi.fn();

vi.mock('../../utils/getPosterUrl', () => ({
	getPosterUrl: vi.fn(),
}));

const renderMoviePoster = (props = {}) => {
	const defaultProps = {
		path: '/test.jpg',
		alt: 'Poster Teste',
		...props,
	};
	return render(<MoviePoster {...defaultProps} />);
};

describe('MoviePoster Component (Unit Tests)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		getPosterUrl.mockImplementation((path, size) => path ? `http://mocked-url.com/${size}${path}` : null);
	});

	it('Deve mostrar skeleton antes da imagem carregar', () => {
		renderMoviePoster();
		const container = screen.getByAltText('Poster Teste').parentElement;

		expect(container).toHaveClass('skeleton-base');
	});

	it('Deve remover skeleton após imagem carregar', () => {
		renderMoviePoster();
		const img = screen.getByAltText('Poster Teste');
		fireEvent.load(img);

		expect(img.className).toContain('show');
	});

	it('Deve repassar path e size para o utilitário getPosterUrl corretamente', () => {
		renderMoviePoster({ path: '/abc.jpg', size: 'w342' });

		expect(getPosterUrl).toHaveBeenCalledWith('/abc.jpg', 'w342');

		const img = screen.getByAltText('Poster Teste');

		expect(img.src).toBe('http://mocked-url.com/w342/abc.jpg');
	});

	it('Deve usar a imagem de fallback se o utilitário não retornar URL', () => {
		getPosterUrl.mockReturnValue(null);
		renderMoviePoster({ path: null });
		const img = screen.getByAltText('Poster Teste');

		expect(img.src).toContain('no-poster.png');
	});

	it('Deve aplicar a className passada por prop no container', () => {
		renderMoviePoster({ className: 'custom-class' });
		const container = screen.getByAltText('Poster Teste').parentElement;

		expect(container).toHaveClass('custom-class');
	});

	it('Deve chamar a função onClick quando o container for clicado', async () => {
		const user = userEvent.setup();
		renderMoviePoster({ onClick: mockOnClick });
		const container = screen.getByAltText('Poster Teste').parentElement;
		await user.click(container);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});

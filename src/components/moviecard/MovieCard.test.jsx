import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it, vi } from 'vitest';
import MovieCard from './MovieCard';

const mockNavigate = vi.fn();

vi.mock('../moviePoster/MoviePoster', () => ({
	default: ({ alt, path }) => <img alt={alt} src={path ? "mocked-poster.jpg" : "no-poster.png"} />,
}));

vi.mock('../favoriteButton/FavoriteButton', () => ({
	default: () => <button data-testid="favorite-btn" onClick={(e) => e.stopPropagation()}>Fav</button>,
}));

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

const mockMovie = {
	id: 1,
	title: 'Filme A',
	poster_path: '/pathA.jpg',
	vote_average: 8.88,
};

const renderMovieCard = () => {
	render(
		<MemoryRouter>
			<MovieCard {...mockMovie} />
		</MemoryRouter>,
	);
};

describe('MovieCard Component (Unit Tests)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('Deve renderizar o título e a nota formatada corretamente', () => {
		renderMovieCard();

		expect(screen.getByText(/filme a/i)).toBeInTheDocument();
		expect(screen.getByText(/8.9/i)).toBeInTheDocument();
	});

	it('Deve renderizar o poster e o botão de favorito', () => {
		renderMovieCard();

		expect(screen.getByRole('img')).toBeInTheDocument();
		expect(screen.getByRole('button')).toBeInTheDocument();
	});

	it('Não deve renderizar a nota se vote_average for 0', () => {
		render(
			<MemoryRouter>
				<MovieCard {...mockMovie} vote_average={0} />
			</MemoryRouter>,
		);

		expect(screen.queryByText(/0/i)).not.toBeInTheDocument();
	});

	it('Não deve renderizar nota quando vote_average for inválido', () => {
		render(
			<MemoryRouter>
				<MovieCard {...mockMovie} vote_average={null} />
			</MemoryRouter>,
		);

		expect(screen.queryByText(/0/i)).not.toBeInTheDocument();
	});

	it('Deve usar a imagem de fallback quando poster_path for nulo', () => {
		const movieWithoutPoster = { ...mockMovie, poster_path: null };
		render(
			<MemoryRouter>
				<MovieCard {...movieWithoutPoster} />
			</MemoryRouter>,
		);
		const img = screen.getByAltText('Filme A');

		expect(img.src).toContain('no-poster.png');
	});

	it('Deve gerar URL com slug corretamente', () => {
		renderMovieCard();
		const card = screen.getByText('Filme A').closest('.movie-card');
		fireEvent.click(card);

		expect(mockNavigate).toHaveBeenCalledWith('/filme/1/filme-a');
	});

	it('Não deve navegar ao clicar no botão de favorito', () => {
		renderMovieCard();
		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('Não deve propagar clique do botão de favorito para o card', () => {
		const parentClick = vi.fn();
		render(
			<MemoryRouter>
				<div onClick={parentClick}>
					<MovieCard {...mockMovie} />
				</div>
			</MemoryRouter>,
		);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(parentClick).not.toHaveBeenCalled();
	});

	it('Não deve quebrar com props incompletas', () => {
		expect(() => {
			render(
				<MemoryRouter>
					<MovieCard id={1} />
				</MemoryRouter>,
			);
		}).not.toThrow();
	});

	it('Deve navegar para a página do filme ao clicar no card', () => {
		renderMovieCard();
		const card = screen.getByText('Filme A').closest('.movie-card');
		fireEvent.click(card);

		expect(mockNavigate).toHaveBeenCalledWith(expect.stringContaining(`/filme/${mockMovie.id}/`));
	});
});

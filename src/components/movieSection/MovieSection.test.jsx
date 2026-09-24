import { render, screen } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import MovieSection from './MovieSection';

vi.mock('../moviecard/MovieCard', () => ({
	default: ({ title }) => <article data-testid="movie-card">{title}</article>,
}));

vi.mock('../moviecard/MovieCardSkeleton', () => ({
	default: () => <div data-testid="movie-skeleton" className="skeleton-base" />,
}));

const mockMovies = [
	{ id: 1, title: 'Filme A', poster_path: '/pathA.jpg', vote_average: 9 },
	{ id: 2, title: 'Filme B', poster_path: '/pathB.jpg', vote_average: 9.5 },
];

describe('MovieSection Component (Unit Tests)', () => {
	it('Deve renderizar o título da seção e a lista de filmes', () => {
		render(<MovieSection title="Populares" movies={mockMovies} loading={false} />);

		expect(screen.getByText('Populares')).toBeInTheDocument();
		expect(screen.getByText('Filme A')).toBeInTheDocument();
		expect(screen.getByText('Filme B')).toBeInTheDocument();

		const articles = screen.getAllByTestId('movie-card');

		expect(articles).toHaveLength(2);
	});

	it('Deve renderizar 15 skeletons quando estiver carregando', () => {
		render(<MovieSection title="Populares" movies={[]} loading={true} />);
		const skeletons = screen.getAllByTestId('movie-skeleton');

		expect(skeletons).toHaveLength(15);
	});

	it('Não deve renderizar skeletons quando não estiver carregando', () => {
		render(<MovieSection title="Populares" movies={mockMovies} loading={false} />);
		const skeletons = screen.queryAllByTestId('movie-skeleton');

		expect(skeletons).toHaveLength(0);
	});

	it('Deve renderizar apenas o título quando não houver filmes e não estiver carregando', () => {
		render(<MovieSection title="Populares" movies={[]} loading={false} />);

		expect(screen.getByText('Populares')).toBeInTheDocument();

		const articles = screen.queryAllByTestId('movie-card');

		expect(articles).toHaveLength(0);
	});
});

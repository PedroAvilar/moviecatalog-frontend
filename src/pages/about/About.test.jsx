import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import About from './About';

describe('About Page (Unit Tests)', () => {
	it('Deve renderizar o título "Sobre o projeto"', () => {
		render(<About />);

		expect(screen.getByRole('heading', { name: /sobre o projeto/i })).toBeInTheDocument();
	});

	it('Deve exibir as três seções de funcionalidades', () => {
		render(<About />);

		expect(screen.getByRole('heading', { name: /exploração/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /favoritos/i })).toBeInTheDocument();
		expect(screen.getByRole('heading', { name: /detalhes/i })).toBeInTheDocument();
	});

	it('Deve renderizar o logo do TMDB', () => {
		render(<About />);
		const tmdbLogo = screen.getByAltText(/logotipo tmdb/i);

		expect(tmdbLogo).toBeInTheDocument();
	});

	it('Deve exibir o texto do TMDB', () => {
		render(<About />);

		expect(screen.getByText(/este site utiliza os dados e as apis do/i)).toBeInTheDocument();
	});
});

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from './Footer';

describe('Footer Component (Unit Tests)', () => {
	it('Deve renderizar o texto completo corretamente', () => {
		const year = new Date().getFullYear();
		render(<Footer />);

		expect(screen.getByText(/moviecatalog \d{4}. todos os direitos reservados./i)).toBeInTheDocument();
	});

	it('Deve exibir o ano atual dinamicamente', () => {
		const currentYear = new Date().getFullYear();
		render(<Footer />);

		expect(screen.getByText((text) => text.includes(currentYear))).toBeInTheDocument();
	});

	it('Deve renderizar o link dentro da frase corretamente', () => {
		render(<Footer />);
		const link = screen.getByRole('link', { name: /pedro avilar/i });

		expect(link.closest('p')).toHaveTextContent(/desenvolvido por/i);
	});

	it('Deve ter o link do GitHub configurado corretamente para segurança', () => {
		render(<Footer />);
		const githubLink = screen.getByRole('link', { name: /pedro avilar/i });

		expect(githubLink).toHaveAttribute(
			'href',
			'https://github.com/PedroAvilar',
		);

		expect(githubLink).toHaveAttribute('target', '_blank');
		expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
	});

	it('Deve renderizar elemento footer semântico corretamente', () => {
		render(<Footer />);

		expect(screen.getByRole('contentinfo').tagName).toBe('FOOTER');
	});
});

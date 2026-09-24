import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CastList from './CastList';

vi.mock('../../utils/getProfileUrl', () => ({
	getProfileUrl: vi.fn((path) => `http://mocked-url.com${path}`),
}));

describe('CastList Component (Unit Tests)', () => {
	const mockCast = [
		{
			id: 1,
			name: 'Ator 1',
			character: 'Personagem 1',
			profile_path: '/path1.jpg',
		},
		...Array.from({ length: 20 }, (_, i) => ({
			id: i + 2,
			name: `Ator ${i + 2}`,
			character: `Personagem ${i + 2}`,
			profile_path: `/path${i + 2}.jpg`,
		})),
	];

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('Não deve renderizar nada quando o elenco for vazio ou nulo', () => {
		const { container: emptyContainer } = render(<CastList cast={[]} />);

		expect(emptyContainer.firstChild).toBeNull();

		const { container: nullContainer } = render(<CastList cast={null} />);

		expect(nullContainer.firstChild).toBeNull();
	});

	it('Deve renderizar o título e os dados básicos dos atores', () => {
		render(<CastList cast={[mockCast[0]]} />);

		expect(screen.getByText(/elenco principal/i)).toBeInTheDocument();
		expect(screen.getByText(/ator 1/i)).toBeInTheDocument();
		expect(screen.getByText(/personagem 1/i)).toBeInTheDocument();
	});

	it('Deve configurar os atributos HTML corretos na imagem do ator', () => {
		render(<CastList cast={[mockCast[0]]} />);
		const img = screen.getByRole('img', { name: /ator 1/i });

		expect(img).toHaveAttribute('src', 'http://mocked-url.com/path1.jpg');
		expect(img).toHaveAttribute('loading', 'lazy');
	});

	it('Deve gerenciar o estado do carregamento individual de cada imagem', () => {
		render(<CastList cast={mockCast.slice(0, 2)} />);
		const images = screen.getAllByRole('img');
		const firstImage = images[0].parentElement;
		const secondImage = images[1].parentElement;

		expect(firstImage).toHaveClass('skeleton-base');
		expect(images[0]).not.toHaveClass('show');

		fireEvent.load(images[0]);

		expect(firstImage).not.toHaveClass('skeleton-base');
		expect(images[0]).toHaveClass('show');
		expect(secondImage).toHaveClass('skeleton-base');
		expect(images[1]).not.toHaveClass('show');
	});

	it('Deve renderizar no máximo 15 atores respeitando a ordem recebida', () => {
		render(<CastList cast={mockCast} />);
		const images = screen.getAllByRole('img');

		expect(images).toHaveLength(15);

		const renderNames = images.map((img) => img.getAttribute('alt'));
		const expectedNames = mockCast.slice(0, 15).map((actor) => actor.name);

		expect(renderNames).toEqual(expectedNames);
	});

	it('Deve lidar com atores sem personagem definido', () => {
		const actorWithoutCharacter = {
			id: 99,
			name: 'Ator Sem Personagem',
			profile_path: '/path99.jpg',
		};

		render(<CastList cast={[actorWithoutCharacter]} />);

		expect(screen.getByText(/ator sem personagem/i)).toBeInTheDocument();
		expect(screen.getByText('', { selector: 'small' })).toBeInTheDocument();
	});

	it('Deve atualizar a lista e os nós do DOM dinamicamente quando as propriedades mudarem', () => {
		const { rerender } = render(<CastList cast={[mockCast[0]]} />);

		expect(screen.getByText(/ator 1/i)).toBeInTheDocument();

		rerender(<CastList cast={[mockCast[1]]} />);

		expect(screen.getByText(/ator 2/i)).toBeInTheDocument();
		expect(screen.queryByText(/ator 1/i)).not.toBeInTheDocument();
	});
});

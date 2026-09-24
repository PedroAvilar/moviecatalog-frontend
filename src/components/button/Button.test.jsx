import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button Component (Unit Tests)', () => {
	it('Deve usar valores padrão corretamente', () => {
		render(<Button>Teste</Button>);
		const button = screen.getByRole('button');

		expect(button).toHaveAttribute('type', 'button');
		expect(button).toHaveClass('btn', 'btn-primary');
		expect(button).not.toBeDisabled();
		expect(screen.getByText('Teste')).toBeInTheDocument();
	});

	it('Deve renderizar children complexos corretamente', () => {
		render(
			<Button>
				<span>Icon</span> Texto
			</Button>,
		);

		expect(screen.getByText('Texto')).toBeInTheDocument();
		expect(screen.getByText('Icon')).toBeInTheDocument();
	});

	it('Deve exibir "Aguarde..." e estar desativado quando loading for true', () => {
		render(<Button loading={true}>Enviar</Button>);
		const button = screen.getByRole('button');

		expect(screen.getByText(/aguarde/i)).toBeInTheDocument();
		expect(screen.queryByText(/enviar/i)).not.toBeInTheDocument();
		expect(button).toBeDisabled();
	});

	it('Deve atualizar o conteúdo ao mudar loading dinamicamente', () => {
		const { rerender } = render(<Button loading={false}>Enviar</Button>);

		expect(screen.getByText(/enviar/i)).toBeInTheDocument();

		rerender(<Button loading={true}>Enviar</Button>);

		expect(screen.getByText(/aguarde/i)).toBeInTheDocument();
	});

	it('Deve permanecer desativado quando disabled e loading forem true', () => {
		render(
			<Button disabled={true} loading={true}>
				Teste
			</Button>,
		);
		const button = screen.getByRole('button');

		expect(screen.getByText(/aguarde/i)).toBeInTheDocument();
		expect(button).toBeDisabled();
	});

	it('Deve chamar a função onClick ao ser clicado', () => {
		const mockOnClick = vi.fn();
		render(<Button onClick={mockOnClick}>Clique aqui</Button>);
		fireEvent.click(screen.getByRole('button'));

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});

	it('Não deve disparar onClick quando disabled for true', () => {
		const mockOnClick = vi.fn();
		render(
			<Button onClick={mockOnClick} disabled={true}>
				Enviar
			</Button>,
		);
		const button = screen.getByRole('button');
		fireEvent.click(button);

		expect(mockOnClick).not.toHaveBeenCalled();
		expect(button).toBeDisabled();
	});

	it('Não deve disparar onClick quando estiver em estado de loading', () => {
		const mockOnClick = vi.fn();
		render(
			<Button onClick={mockOnClick} loading={true}>
				Enviar
			</Button>,
		);
		fireEvent.click(screen.getByRole('button'));

		expect(mockOnClick).not.toHaveBeenCalled();
	});

	it('Não deve quebrar se onClick não for fornecido', () => {
		render(<Button>Sem ação</Button>);
		const button = screen.getByRole('button');

		expect(() => fireEvent.click(button)).not.toThrow();
	});

	it('Deve aplicar a classe de variante correta', () => {
		const { rerender } = render(<Button variant="primary">Botão</Button>);
		const button = screen.getByRole('button');

		expect(button).toHaveClass('btn-primary');

		rerender(<Button variant="secondary">Botão</Button>);

		expect(button).toHaveClass('btn-secondary');
	});

	it('Deve respeitar o atributo type correto', () => {
		const { rerender } = render(<Button type="button">Botão</Button>);
		['button', 'submit', 'reset'].forEach((type) => {
			rerender(<Button type={type}>Botão</Button>);

			expect(screen.getByRole('button')).toHaveAttribute('type', type);
		});
	});
});

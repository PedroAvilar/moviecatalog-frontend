import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ErrorMessage from './ErrorMessage';

describe('ErrorMessage Component (Unit Tests)', () => {
	it('Deve renderizar o título e a mensagem de erro padrão', () => {
		render(<ErrorMessage />);

		expect(screen.getByRole('heading', { name: /algo deu errado/i })).toBeInTheDocument();
		expect(screen.getByText(/não foi possível acessar os dados/i)).toBeInTheDocument();
	});

	it('Deve usar mensagem padrão quando message for string vazia', () => {
		render(<ErrorMessage message="" />);

		expect(screen.getByText(/não foi possível acessar os dados/i)).toBeInTheDocument();
	});

	it('Deve usar mensagem padrão quando message for null', () => {
		render(<ErrorMessage message={null} />);

		expect(screen.getByText(/não foi possível acessar os dados/i)).toBeInTheDocument();
	});

	it('Deve exibir uma mensagem personalizada quando fornecida', () => {
		const customMessage = 'Erro de conexão com o servidor';
		render(<ErrorMessage message={customMessage} />);

		expect(screen.getByText(customMessage)).toBeInTheDocument();
	});

	it('Deve chamar a função onRetry ao clicar no botão', () => {
		const mockOnRetry = vi.fn();
		render(<ErrorMessage onRetry={mockOnRetry} />);
		const button = screen.getByRole('button', { name: /tentar de novo/i });
		fireEvent.click(button);

		expect(mockOnRetry).toHaveBeenCalledTimes(1);
	});

	it('Não deve quebrar se onRetry não for função válida', () => {
		expect(() => {
			render(<ErrorMessage onRetry="invalido" />);
		}).not.toThrow();
	});

	it('Não deve exibir o botão se onRetry não for fornecido', () => {
		render(<ErrorMessage />);

		expect(screen.queryByRole('button')).not.toBeInTheDocument();
	});

	it('Deve aplicar a classe compact quando a variante for compact', () => {
		const { container } = render(<ErrorMessage variant="compact" />);
		const wrapper = container.querySelector('.error-wrapper');

		expect(wrapper.classList.contains('compact')).toBe(true);
	});

	it('Deve renderizar a variante full por padrão (sem a classe compact)', () => {
		const { container } = render(<ErrorMessage />);
		const wrapper = container.querySelector('.error-wrapper');

		expect(wrapper.classList.contains('compact')).toBe(false);
	});
});

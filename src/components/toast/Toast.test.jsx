import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Toast from './Toast';

describe('Toast Component (Unit Tests)', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('Deve exibir a mensagem e o ícone de sucesso corretamente', () => {
		render(<Toast message="Sucesso!" type="success" onClose={() => { }} />);

		expect(screen.getByText(/sucesso/i)).toBeInTheDocument();
	});

	it('Deve exibir o ícone de erro corretamente', () => {
		render(<Toast message="Erro!" type="error" onClose={() => { }} />);

		expect(screen.getByText(/erro/i)).toBeInTheDocument();
	});

	it('Deve chamar onClose após a duração total', () => {
		const mockOnClose = vi.fn();
		render(<Toast message="Timer" onClose={mockOnClose} duration={1000} />);
		act(() => {
			vi.advanceTimersByTime(1300);
		});

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('Deve fechar imediatamente ao clicar no toast', () => {
		const mockOnClose = vi.fn();
		render(<Toast message="Click me" onClose={mockOnClose} />);
		const toast = screen.getByText('Click me').closest('.toast-container');
		act(() => {
			fireEvent.click(toast);
		});
		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});
});

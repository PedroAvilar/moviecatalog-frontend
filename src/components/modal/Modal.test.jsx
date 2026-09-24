import { screen } from '@testing-library/react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

const mockOnClose = vi.fn();

describe('Modal Component (Unit Tests)', () => {
	beforeEach(() => {
		mockOnClose.mockClear();
	});

	it('Deve renderizar a estrutura do modal corretamente', () => {
		render(<Modal isOpen={true} onClose={mockOnClose} title="Teste" />);

		expect(document.querySelector('.modal-overlay')).toBeInTheDocument();
		expect(document.querySelector('.modal-content')).toBeInTheDocument();
		expect(document.querySelector('.modal-header')).toBeInTheDocument();
		expect(document.querySelector('.modal-body')).toBeInTheDocument();
	});

	it('Não deve quebrar se não houver children', () => {
		expect(() => {
			render(<Modal isOpen={true} onClose={mockOnClose} title="Teste" />);
		}).not.toThrow();
	});

	it('Não deve renderizar nada quando isOpen for false', () => {
		const { container } = render(
			<Modal isOpen={false} onClose={mockOnClose} title="Teste">
				<p>Conteúdo</p>
			</Modal>,
		);

		expect(container.firstChild).toBeNull();
		expect(screen.queryByText(/teste/i)).not.toBeInTheDocument();
	});

	it('Deve renderizar corretamente o título e o conteúdo quando aberto', () => {
		render(
			<Modal isOpen={true} onClose={mockOnClose} title="Teste">
				<p>Conteúdo</p>
			</Modal>,
		);

		expect(screen.getByRole('heading', { name: /teste/i })).toBeInTheDocument();
		expect(screen.getByText(/conteúdo/i)).toBeInTheDocument();
	});

	it('Deve chamar onClose ao clicar no botão de fechar', async () => {
		const user = userEvent.setup();
		render(<Modal isOpen={true} onClose={mockOnClose} title="Teste" />);
		const closeBtn = screen.getByRole('button');
		await user.click(closeBtn);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('Deve chamar onClose ao clicar no overlay', async () => {
		const user = userEvent.setup();
		render(<Modal isOpen={true} onClose={mockOnClose} title="Teste" />);
		const overlay = screen
			.getByRole('heading', { name: /teste/i })
			.closest('.modal-overlay');
		await user.click(overlay);

		expect(mockOnClose).toHaveBeenCalledTimes(1);
	});

	it('Não deve fechar se clicar em filho do overlay que não seja o próprio overlay', async () => {
		const user = userEvent.setup();
		render(
			<Modal isOpen={true} onClose={mockOnClose} title="Teste">
				<div data-testid="inner-div">Conteúdo</div>
			</Modal>,
		);
		const innerDiv = screen.getByTestId('inner-div');
		await user.click(innerDiv);

		expect(mockOnClose).not.toHaveBeenCalled();
	});

	it('Não deve chamar onClose ao clicar dentro do conteúdo do modal', async () => {
		const user = userEvent.setup();
		render(
			<Modal isOpen={true} onClose={mockOnClose} title="Teste">
				<button>Clique</button>
			</Modal>,
		);
		const internalBtn = screen.getByText('Clique');
		await user.click(internalBtn);

		expect(mockOnClose).not.toHaveBeenCalled();
	});
});

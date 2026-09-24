import { screen, fireEvent, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from './EmptyState';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
	const actual = await importOriginal();
	return { ...actual, useNavigate: () => mockNavigate };
});

const mockOnAction = vi.fn();

describe('EmptyState Component (Unit Tests)', () => {
	const renderMemoryRouterEmptyState = () =>
		render(
			<MemoryRouter>
				<EmptyState />
			</MemoryRouter>,
		);

	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('Deve renderizar os valores padrão corretamente', () => {
		renderMemoryRouterEmptyState();

		expect(screen.getByRole('img'));
		expect(screen.getByText(/nada por aqui/i)).toBeInTheDocument();
		expect(screen.getByText(/lista está vazia/i)).toBeInTheDocument();
	});

	it('Não deve renderizar o botão se actionText não for enviado', () => {
		renderMemoryRouterEmptyState();
		const button = screen.queryByRole('button');

		expect(button).not.toBeInTheDocument();
	});

	it('Não deve disparar navegação sem botão', () => {
		renderMemoryRouterEmptyState();

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('Deve renderizar conteúdo personalizado via props', () => {
		render(
			<MemoryRouter>
				<EmptyState
					icon="🎬"
					title="Sem filmes"
					description="Tente outro termo"
				/>
			</MemoryRouter>,
		);

		expect(screen.getByText(/sem filmes/i)).toBeInTheDocument();
		expect(screen.getByText(/tente outro termo/i)).toBeInTheDocument();
	});

	it('Deve chamar onAction quando a prop for fornecida e o botão clicado', () => {
		render(
			<MemoryRouter>
				<EmptyState actionText="Recarregar" onAction={mockOnAction} />
			</MemoryRouter>,
		);
		const button = screen.getByRole('button', { name: /recarregar/i });
		fireEvent.click(button);

		expect(mockOnAction).toHaveBeenCalledTimes(1);
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('Deve navegar para a rota especificada se onAction não for fornecido', () => {
		render(
			<MemoryRouter>
				<EmptyState actionText="Ir para Home" to="/home" />
			</MemoryRouter>,
		);
		const button = screen.getByRole('button', { name: /ir para home/i });
		fireEvent.click(button);

		expect(mockNavigate).toHaveBeenCalledWith('/home');
	});

	it('Deve navegar para "/" por padrão quando to não for informado', () => {
		render(
			<MemoryRouter>
				<EmptyState actionText="Ir" />
			</MemoryRouter>,
		);
		fireEvent.click(screen.getByRole('button'));

		expect(mockNavigate).toHaveBeenCalledWith('/');
	});

	it('Deve navegar quando onAction for undefined explicitamente', () => {
		render(
			<MemoryRouter>
				<EmptyState actionText="Ir" onAction={undefined} to="/home" />
			</MemoryRouter>,
		);
		fireEvent.click(screen.getByRole('button'));

		expect(mockNavigate).toHaveBeenCalledWith('/home');
	});

	it('Não deve navegar nem executar ação se onAction e to forem inválidos', () => {
		render(
			<MemoryRouter>
				<EmptyState actionText="Ação" to={null} />
			</MemoryRouter>,
		);
		fireEvent.click(screen.getByRole('button'));

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('Não deve navegar quando to for string vazia', () => {
		render(
			<MemoryRouter>
				<EmptyState actionText="Ir" to="" />
			</MemoryRouter>,
		);
		fireEvent.click(screen.getByRole('button'));

		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('Deve priorizar onAction mesmo quando to estiver presente', () => {
		render(
			<MemoryRouter>
				<EmptyState actionText="Executar" onAction={mockOnAction} to="/home" />
			</MemoryRouter>,
		);
		fireEvent.click(screen.getByRole('button'));

		expect(mockOnAction).toHaveBeenCalledTimes(1);
		expect(mockNavigate).not.toHaveBeenCalled();
	});

	it('Deve renderizar o ícone com acessibilidade correta', () => {
		renderMemoryRouterEmptyState();
		const icon = screen.getByRole('img');

		expect(icon).toHaveAttribute('aria-label', 'icon');
	});
});

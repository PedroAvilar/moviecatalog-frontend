import { screen, renderHook, act, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastContext';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../components/toast/Toast', () => ({
	default: ({ message, type, onClose }) => (
		<div data-testid="mock-toast">
			<span>{message}</span>
			<span>{type}</span>
			<button data-testid="close-toast" onClick={onClose}>Close</button>
		</div>
	),
}));

describe('ToastContext (Unit Tests)', () => {
	it('Deve adicionar um toast à tela com os dados corretos', () => {
		const { result } = renderHook(() => useToast(), {
			wrapper: ToastProvider,
		});
		act(() => {
			result.current.showToast({ message: 'Nova Mensagem', type: 'success' });
		});

		expect(screen.getByText('Nova Mensagem')).toBeInTheDocument();
		expect(screen.getByText('success')).toBeInTheDocument();
	});

	it('Deve tratar mensagens enviadas como string (com fallback para info)', () => {
		const { result } = renderHook(() => useToast(), {
			wrapper: ToastProvider,
		});
		act(() => {
			result.current.showToast('Mensagem Simples');
		});

		expect(screen.getByText('Mensagem Simples')).toBeInTheDocument();
		expect(screen.getByText('info')).toBeInTheDocument();
	});

	it('Deve remover um toast ao chamar onClose do filho', () => {
		const { result } = renderHook(() => useToast(), {
			wrapper: ToastProvider,
		});
		act(() => {
			result.current.showToast('Msg para fechar');
		});

		expect(screen.getByText('Msg para fechar')).toBeInTheDocument();

		const closeBtn = screen.getByTestId('close-toast');
		act(() => {
			fireEvent.click(closeBtn);
		});

		expect(screen.queryByText('Msg para fechar')).not.toBeInTheDocument();
	});

	it('Não deve permitir mais de 3 toasts simultâneos (remove o mais antigo)', () => {
		const { result } = renderHook(() => useToast(), {
			wrapper: ToastProvider,
		});
		act(() => {
			result.current.showToast('Msg 1');
			result.current.showToast('Msg 2');
			result.current.showToast('Msg 3');
			result.current.showToast('Msg 4');
		});
		const toasts = screen.getAllByTestId('mock-toast');

		expect(toasts).toHaveLength(3);
		expect(screen.queryByText('Msg 1')).not.toBeInTheDocument();
		expect(screen.getByText('Msg 4')).toBeInTheDocument();
	});

	it('Não deve repetir a última mensagem se for idêntica e consecutiva', () => {
		const { result } = renderHook(() => useToast(), {
			wrapper: ToastProvider,
		});
		act(() => {
			result.current.showToast('Mensagem Igual');
			result.current.showToast('Mensagem Igual');
		});
		const toasts = screen.getAllByTestId('mock-toast');

		expect(toasts).toHaveLength(1);
	});
});

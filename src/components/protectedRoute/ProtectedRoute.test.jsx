import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from './ProtectedRoute';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { beforeEach, expect, vi, describe, it } from 'vitest';
import { useAuth } from '../../context/AuthContext';

const showToastMock = vi.fn();

vi.mock('../../context/AuthContext', () => ({
	useAuth: vi.fn(),
}));

vi.mock('../../context/ToastContext', () => ({
	useToast: () => ({ showToast: showToastMock }),
}));

describe('ProtectedRoute Component (Unit Tests)', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		useAuth.mockReturnValue({ signed: false, loading: false });
	});

	it('Deve renderizar o conteúdo (children) se o usuário estiver logado', () => {
		useAuth.mockReturnValue({ signed: true, loading: false });
		render(
			<MemoryRouter initialEntries={['/favoritos']}>
				<Routes>
					<Route
						path="/favoritos"
						element={
							<ProtectedRoute>
								<div data-testid="protected-content">Conteúdo Privado</div>
							</ProtectedRoute>
						}
					/>
				</Routes>
			</MemoryRouter>
		);

		expect(screen.getByTestId('protected-content')).toBeInTheDocument();
		expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
	});

	it('Deve redirecionar para login e mostrar toast se o usuário não estiver logado', () => {
		useAuth.mockReturnValue({ signed: false, loading: false });
		render(
			<MemoryRouter initialEntries={['/favoritos']}>
				<Routes>
					<Route
						path="/favoritos"
						element={
							<ProtectedRoute>
								<div>Conteúdo Privado</div>
							</ProtectedRoute>
						}
					/>
					<Route path="/login" element={<div>Página de Login</div>} />
				</Routes>
			</MemoryRouter>
		);

		expect(showToastMock).toHaveBeenCalledWith({ message: 'Faça login para acessar a página' });
		expect(screen.getByText(/página de Login/i)).toBeInTheDocument();
		expect(screen.queryByText(/conteúdo privado/i)).not.toBeInTheDocument();
	});

	it('Não deve renderizar nada enquanto estiver carregando', () => {
		useAuth.mockReturnValue({ signed: false, loading: true });
		render(
			<MemoryRouter>
				<ProtectedRoute>
					<div data-testid="content">Conteúdo</div>
				</ProtectedRoute>
			</MemoryRouter>
		);

		expect(screen.queryByTestId('content')).not.toBeInTheDocument();
		expect(showToastMock).not.toHaveBeenCalled();
		expect(screen.queryByText(/login/i)).not.toBeInTheDocument();
	});
});

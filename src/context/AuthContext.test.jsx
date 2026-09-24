import { renderHook, act, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './AuthContext';
import * as apiService from '../services/apiService';

const mockShowToast = vi.fn();

vi.mock('../services/apiService', () => ({
	getMe: vi.fn(),
	login: vi.fn(),
	logout: vi.fn(),
}));

vi.mock('./ToastContext', () => ({
	useToast: () => ({ showToast: mockShowToast }),
}));

describe('AuthContext (Unit Tests)', () => {
	let queryClient;

	const wrapper = ({ children }) => (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>{children}</AuthProvider>
		</QueryClientProvider>
	);

	beforeEach(() => {
		vi.clearAllMocks();
		queryClient = new QueryClient({
			defaultOptions: { queries: { retry: false } },
		});
	});

	it('Deve inicializar deslogado se getMe retornar nulo/erro', async () => {
		apiService.getMe.mockRejectedValue(new Error('Não logado'));
		const { result } = renderHook(() => useAuth(), { wrapper });

		expect(result.current.loading).toBe(true);
		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.user).toBeNull();
		expect(result.current.signed).toBe(false);
	});

	it('Deve inicializar logado se getMe retornar um usuário', async () => {
		const mockUser = { id: 'user123', name: 'Pedro' };
		apiService.getMe.mockResolvedValue({ user: mockUser });
		const { result } = renderHook(() => useAuth(), { wrapper });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});
		expect(result.current.user).toEqual(mockUser);
		expect(result.current.signed).toBe(true);
	});

	it('Deve realizar login e atualizar os dados do usuário no contexto', async () => {
		apiService.getMe.mockRejectedValue(new Error('Não logado'));
		const mockResponse = { user: { id: 'user456', name: 'Wilson' }, token: 'abc' };
		apiService.login.mockResolvedValue(mockResponse);
		const { result } = renderHook(() => useAuth(), { wrapper });

		await waitFor(() => {
			expect(result.current.loading).toBe(false);
		});

		let loginResponse;
		await act(async () => {
			loginResponse = await result.current.login('teste@teste.com', '123456');
		});

		expect(apiService.login).toHaveBeenCalledWith('teste@teste.com', '123456');
		expect(loginResponse).toEqual(mockResponse);
		await waitFor(() => {
			expect(result.current.user).toEqual(mockResponse.user);
			expect(result.current.signed).toBe(true);
		});
	});

	it('Deve atualizar os dados do usuário via updateUser', async () => {
		const mockUser = { id: 'user123', name: 'Pedro' };
		apiService.getMe.mockResolvedValue({ user: mockUser });
		const { result } = renderHook(() => useAuth(), { wrapper });

		await waitFor(() => {
			expect(result.current.user).toEqual(mockUser);
		});

		act(() => {
			result.current.updateUser({ name: 'Pedro Editado' });
		});

		await waitFor(() => {
			expect(result.current.user).toEqual({
				id: 'user123',
				name: 'Pedro Editado'
			});
		});
	});

	it('Deve realizar logout, chamar api, exibir toast e limpar contexto', async () => {
		const mockUser = { id: 'user123', name: 'Pedro' };
		apiService.getMe.mockResolvedValue({ user: mockUser });
		apiService.logout.mockResolvedValue('Deslogado com sucesso');
		const { result } = renderHook(() => useAuth(), { wrapper });

		await waitFor(() => {
			expect(result.current.user).toEqual(mockUser);
		});

		apiService.getMe.mockRejectedValue(new Error('Não logado mais'));
		await act(async () => {
			await result.current.logout();
		});

		expect(apiService.logout).toHaveBeenCalledTimes(1);
		expect(mockShowToast).toHaveBeenCalledWith('Deslogado com sucesso');
		await waitFor(() => {
			expect(result.current.user).toBeNull();
			expect(result.current.signed).toBe(false);
		});
	});
});

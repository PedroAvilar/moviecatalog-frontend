import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema, updateProfileSchema, updatePasswordSchema } from './authSchema';

describe('Auth Schema (Unit Tests)', () => {

	describe('registerSchema', () => {
		it('Deve validar um cadastro correto', () => {
			const validData = {
				name: 'Pedro Avilar',
				email: 'pedro@exemplo.com',
				password: 'senha123',
			};
			const result = registerSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it('Deve invalidar nome vazio ou só com espaços', () => {
			const emptyData = { name: '', email: 'p@p.com', password: 'senha123' };
			const spacesData = { name: '   ', email: 'p@p.com', password: 'senha123' };

			expect(registerSchema.safeParse(emptyData).error.issues[0].message).toBe('Nome é obrigatório');
			expect(registerSchema.safeParse(spacesData).error.issues[0].message).toBe('Nome é obrigatório');
		});

		it('Deve invalidar email com formato incorreto', () => {
			const invalidEmailData = { name: 'Pedro', email: 'emailinvalido', password: 'senha123' };
			const result = registerSchema.safeParse(invalidEmailData);

			expect(result.error.issues[0].message).toBe('E-mail inválido');
		});

		it('Deve invalidar senha com menos de 6 caracteres', () => {
			const shortPasswordData = { name: 'Pedro', email: 'p@p.com', password: '12345' };
			const result = registerSchema.safeParse(shortPasswordData);

			expect(result.error.issues[0].message).toBe('Senha deve ter no mínimo 6 caracteres');
		});
	});

	describe('loginSchema', () => {
		it('Deve validar login correto', () => {
			const validData = { email: 'pedro@exemplo.com', password: 'senha123' };
			const result = loginSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it('Deve exigir email e senha', () => {
			const invalidData = { email: '', password: '' };
			const result = loginSchema.safeParse(invalidData);
			const errorMessages = result.error.issues.map(i => i.message);

			expect(errorMessages).toContain('E-mail inválido');
			expect(errorMessages).toContain('Senha é obrigatória');
		});
	});

	describe('updateProfileSchema', () => {
		it('Deve validar atualização de perfil correta', () => {
			const validData = { name: 'Pedro', email: 'novo@exemplo.com' };
			const result = updateProfileSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it('Deve invalidar nome com mais de 50 caracteres', () => {
			const longName = 'a'.repeat(51);
			const data = { name: longName, email: 'novo@exemplo.com' };
			const result = updateProfileSchema.safeParse(data);

			expect(result.error.issues[0].message).toBe('Nome deve ter no máximo 50 caracteres');
		});
	});

	describe('updatePasswordSchema', () => {
		it('Deve validar senhas que conferem', () => {
			const validData = {
				currentPassword: 'senha123',
				newPassword: 'novaSenha123',
				confirmPassword: 'novaSenha123',
			};
			const result = updatePasswordSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it('Deve invalidar se a confirmação de senha for diferente', () => {
			const invalidData = {
				currentPassword: 'senha123',
				newPassword: 'novaSenha123',
				confirmPassword: 'senhaDiferente123',
			};
			const result = updatePasswordSchema.safeParse(invalidData);

			expect(result.success).toBe(false);
			expect(result.error.issues[0].message).toBe('As senhas não correspondem');
		});
	});
});

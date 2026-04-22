import { z } from 'zod';

const nameSchema = z
	.string()
	.trim()
	.min(1, 'Nome é obrigatório')
	.max(50, 'Nome deve ter no máximo 50 caracteres')
	.refine((val) => val.replace(/\s/g, '').length > 0, 'Nome inválido');
const emailSchema = z.string().trim().toLowerCase().email('E-mail inválido');
const passwordSchema = z
	.string()
	.min(6, 'Senha deve ter no mínimo 6 caracteres')
	.max(50, 'Senha deve ter no máximo 50 caracteres');
const requiredPasswordSchema = z.string().min(1, 'Senha é obrigatória');

export const registerSchema = z.object({
	name: nameSchema,
	email: emailSchema,
	password: passwordSchema,
});

export const loginSchema = z.object({
	email: emailSchema,
	password: requiredPasswordSchema,
});

export const updateProfileSchema = z.object({
	name: nameSchema,
	email: emailSchema,
});

export const updatePasswordSchema = z
	.object({
		currentPassword: requiredPasswordSchema,
		newPassword: passwordSchema,
		confirmPassword: z.string().min(1, 'Confirmação é obrigatória'),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: 'As senhas não correspondem',
		path: ['confirmPassword'],
	});

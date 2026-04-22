import { z } from 'zod';

const movieIdSchema = z.coerce.number().min(1, 'ID do filme é obrigatório');
const ratingSchema = z
	.any()
	.superRefine((val, ctx) => {
		const num = typeof val === 'number' ? val : Number(val);
		const isEmpty =
			val === undefined || val === null || val === '' || isNaN(num);

		if (isEmpty) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Nota é obrigatória',
			});
			return;
		}
		if (num < 0) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Nota mínima é 0' });
		}
		if (num > 10) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Nota máxima é 10',
			});
		}
	})
	.transform((val) => (typeof val === 'number' ? val : Number(val)));
const commentSchema = z
	.string()
	.trim()
	.min(3, 'Comentário deve ter no mínimo 3 caracteres')
	.max(500, 'Comentário deve ter no máximo 500 caracteres');

export const createReviewSchema = z.object({
	movieId: movieIdSchema,
	rating: ratingSchema,
	comment: commentSchema,
});

export const updateReviewSchema = z.object({
	rating: ratingSchema,
	comment: commentSchema,
});

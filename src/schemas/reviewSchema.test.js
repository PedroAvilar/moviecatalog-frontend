import { describe, it, expect } from 'vitest';
import { createReviewSchema, updateReviewSchema } from './reviewSchema';

describe('Review Schemas (Unit Tests)', () => {

	describe('createReviewSchema', () => {
		it('Deve validar uma avaliação correta', () => {
			const review = {
				movieId: 1,
				rating: 8.5,
				comment: 'Um filme excelente, muito bom!',
			};
			const result = createReviewSchema.safeParse(review);

			expect(result.success).toBe(true);
		});

		it('Deve exigir o ID do filme', () => {
			const review = { rating: 8, comment: 'Bom filme' };
			const result = createReviewSchema.safeParse(review);

			expect(result.success).toBe(false);
		});

		it('Deve invalidar ID de filme zero ou negativo', () => {
			const review = { movieId: 0, rating: 8, comment: 'Bom filme' };
			const result = createReviewSchema.safeParse(review);

			expect(result.success).toBe(false);
			expect(result.error.issues[0].message).toBe('ID do filme é obrigatório');
		});

		it('Deve validar nota como número inteiro ou float válido', () => {
			const review = { movieId: 1, rating: '8', comment: 'Bom filme' };
			const result = createReviewSchema.safeParse(review);

			expect(result.success).toBe(true);
			expect(result.data.rating).toBe(8);
		});

		it('Deve invalidar notas ausentes ou vazias', () => {
			const noteEmpty = { movieId: 1, rating: '', comment: 'Bom filme' };
			const noteNull = { movieId: 1, rating: null, comment: 'Bom filme' };

			expect(createReviewSchema.safeParse(noteEmpty).error.issues[0].message).toBe('Nota é obrigatória');
			expect(createReviewSchema.safeParse(noteNull).error.issues[0].message).toBe('Nota é obrigatória');
		});

		it('Deve invalidar notas menores que 0 ou maiores que 10', () => {
			const noteNegative = { movieId: 1, rating: -1, comment: 'Bom filme' };
			const noteMaximum = { movieId: 1, rating: 11, comment: 'Bom filme' };

			expect(createReviewSchema.safeParse(noteNegative).error.issues[0].message).toBe('Nota mínima é 0');
			expect(createReviewSchema.safeParse(noteMaximum).error.issues[0].message).toBe('Nota máxima é 10');
		});

		it('Deve invalidar comentários muito curtos ou muito longos', () => {
			const commentShort = { movieId: 1, rating: 8, comment: 'a' };
			const commentLong = { movieId: 1, rating: 8, comment: 'a'.repeat(501) };

			expect(createReviewSchema.safeParse(commentShort).error.issues[0].message).toBe('Comentário deve ter no mínimo 3 caracteres');
			expect(createReviewSchema.safeParse(commentLong).error.issues[0].message).toBe('Comentário deve ter no máximo 500 caracteres');
		});
	});

	describe('updateReviewSchema', () => {
		it('Deve validar uma atualização correta', () => {
			const validData = {
				rating: 9,
				comment: 'Atualizei meu comentário, filme nota 9!',
			};
			const result = updateReviewSchema.safeParse(validData);

			expect(result.success).toBe(true);
		});

		it('Não deve exigir movieId', () => {
			const data = { rating: 9, comment: 'Atualizei meu comentário, filme nota 9!' };
			const result = updateReviewSchema.safeParse(data);

			expect(result.success).toBe(true);
		});

		it('Deve aplicar as mesmas regras de validação de nota e comentário', () => {
			const reviewInvalid = { rating: 15, comment: 'Ok' };
			const result = updateReviewSchema.safeParse(reviewInvalid);
			const errorMessages = result.error.issues.map((i) => i.message);

			expect(errorMessages).toContain('Nota máxima é 10');
			expect(errorMessages).toContain('Comentário deve ter no mínimo 3 caracteres');
		});
	});
});

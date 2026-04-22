import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { createReview } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createReviewSchema } from '../../schemas/reviewSchema';
import Button from '../button/Button';
import './movieReviews.css';

function MovieReviews({ movieId, reviews }) {
	const { signed, user } = useAuth();
	const { showToast } = useToast();
	const queryClient = useQueryClient();

	const userAlreadyReviewed = reviews.some((r) => r.userId?.id === user?.id);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(createReviewSchema),
		mode: 'onChange',
		defaultValues: {
			rating: 10,
			comment: '',
		},
	});

	const mutation = useMutation({
		mutationFn: (newReview) => createReview(newReview),
		onSuccess: (response) => {
			reset();
			showToast(response);
			queryClient.invalidateQueries({ queryKey: ['movie', movieId] });
			queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
		},
		onError: (err) => {
			showToast(err);
		},
	});

	const onSubmit = (data) => {
		mutation.mutate({ ...data, movieId });
	};

	return (
		<section>
			<h2>Avaliações</h2>

			{signed ? (
				!userAlreadyReviewed ? (
					<form onSubmit={handleSubmit(onSubmit)}>
						<h3>Deixe sua avaliação</h3>

						<div className="review-inputs">
							<div className="review-rating">
								<p>Sua nota de 0 a 10</p>
								<div className="review-input-rating">
									<span>⭐</span>
									<input
										type="number"
										id="rating"
										min="0"
										max="10"
										step="1"
										{...register('rating', { valueAsNumber: true })}
										disabled={mutation.isPending}
									/>
									<span>/ 10</span>
									{errors.rating && (
										<span className="error">{errors.rating.message}</span>
									)}
								</div>
							</div>
							<textarea
								id="comment"
								maxLength={500}
								placeholder="O que você achou do filme?"
								{...register('comment')}
								disabled={mutation.isPending}
							/>
							{errors.comment && (
								<span className="error">{errors.comment.message}</span>
							)}
						</div>

						<Button
							type="submit"
							variant="primary"
							loading={mutation.isPending}
						>
							Publicar
						</Button>
					</form>
				) : (
					<p className="review-info">
						Você já avaliou esse filme. Gerencie suas notas em "Minhas
						avaliações".
					</p>
				)
			) : (
				<p className="review-info">Faça login para avaliar esse filme.</p>
			)}

			<div className="review-list">
				{reviews.length > 0 ? (
					reviews.map((review) => (
						<div key={review.id} className="review-item">
							<div className="review-header">
								<p>{review.userId?.name || 'Usuário'}</p>
								<p>⭐ {review.rating}</p>
							</div>
							<p>"{review.comment}"</p>
							<p>{new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
						</div>
					))
				) : (
					<p>Nenhuma avaliação ainda. Seja o primeiro!</p>
				)}
			</div>
		</section>
	);
}

export default MovieReviews;

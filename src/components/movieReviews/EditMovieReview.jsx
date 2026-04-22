import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateReview } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateReviewSchema } from '../../schemas/reviewSchema';
import Button from '../button/Button';
import Modal from '../modal/Modal';

function EditMovieReview({ isOpen, onClose, review }) {
	const { showToast } = useToast();
	const queryClient = useQueryClient();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(updateReviewSchema),
		mode: 'onChange',
		defaultValues: {
			rating: review?.rating ?? 10,
			comment: review?.comment ?? '',
		},
	});

	useEffect(() => {
		if (review && isOpen) {
			reset({ rating: review.rating, comment: review.comment });
		}
	}, [review, isOpen]);

	const mutation = useMutation({
		mutationFn: (updatedData) => updateReview(review.id, updatedData),
		onSuccess: (response) => {
			showToast(response);
			queryClient.invalidateQueries({ queryKey: ['my-reviews'] });

			if (review?.movie?.id || review?.movieId) {
				const mid = review.movie?.id || review.movieId;
				queryClient.invalidateQueries({ queryKey: ['movie', mid] });
			}

			onClose();
		},
		onError: (err) => {
			showToast(err);
		},
	});

	const onSubmit = (data) => {
		mutation.mutate(data);
	};

	return (
		<Modal
			isOpen={isOpen}
			onClose={onClose}
			title={`Editar avaliação de ${review?.movie?.title || 'Filme'}`}
		>
			<form onSubmit={handleSubmit(onSubmit)}>
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
						placeholder="Edite seu comentário..."
						{...register('comment')}
						disabled={mutation.isPending}
					/>
					{errors.comment && (
						<span className="error">{errors.comment.message}</span>
					)}
				</div>
				<div className="modal-action">
					<Button
						type="button"
						variant="secondary"
						onClick={onClose}
						loading={mutation.isPending}
					>
						Cancelar
					</Button>
					<Button type="submit" variant="primary" loading={mutation.isPending}>
						Salvar
					</Button>
				</div>
			</form>
		</Modal>
	);
}

export default EditMovieReview;

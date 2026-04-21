import { useEffect, useState } from 'react';
import { deleteReview, getMyReviews } from '../../services/apiService';
import { useToast } from '../../context/ToastContext';
import { slugify } from '../../utils/slugify';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import Button from '../../components/button/Button';
import EmptyState from '../../components/emptyState/EmptyState';
import EditMovieReview from '../../components/movieReviews/EditMovieReview';
import Modal from '../../components/modal/Modal';
import MoviePoster from '../../components/moviePoster/MoviePoster';
import MyReviewsSkeleton from './MyReviewsSkeleton';
import './myReviews.css';

function MyReviews() {
	const { showToast } = useToast();
	const [editingReview, setEditingReview] = useState(null);
	const [reviewToDelete, setReviewToDelete] = useState(null);
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const {
		data: reviews = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['my-reviews'],
		queryFn: getMyReviews,
		staleTime: 1000 * 60 * 5,
		networkMode: 'always',
	});

	const deleteMutation = useMutation({
		mutationFn: (id) => deleteReview(id),
		onSuccess: (response) => {
			showToast(response);
			queryClient.invalidateQueries({ queryKey: ['my-reviews'] });

			if (reviewToDelete?.movie?.id) {
				queryClient.invalidateQueries({
					queryKey: ['movie', String(reviewToDelete.movie.id)],
				});
			}

			setReviewToDelete(null);
		},
		onError: (err) => {
			showToast(err);
		},
	});

	const handleNavigate = (movie) => {
		if (!movie?.id) return;

		const titleSlug = slugify(movie.title);
		navigate(`/filme/${movie.id}/${encodeURIComponent(titleSlug)}`);
	};

	if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

	if (isLoading) return <MyReviewsSkeleton />;

	if (!isLoading && reviews.length === 0) {
		return (
			<EmptyState
				icon="📝"
				title="Você ainda não avaliou nenhum filme"
				description="Suas críticas e notas aparecerão aqui para você gerenciar."
				actionText="Explorar filmes"
			/>
		);
	}

	return (
		<main>
			<h2>Minhas avaliações</h2>

			<div className="reviews-grid">
				{reviews.map((review) => {
					const movie = review.movie;

					return (
						<article key={review.id} className="review-card">
							<MoviePoster
								path={movie?.poster_path}
								alt={movie?.title}
								size="w342"
								className="poster-md clickable"
								onClick={() => handleNavigate(movie)}
							/>

							<div className="review-card-content">
								<div className="review-card-header">
									<div
										className="review-title-clickable"
										onClick={() => handleNavigate(movie)}
									>
										<h3>{movie?.title}</h3>
									</div>
									<span className="review-year">
										{movie?.release_date?.slice(0, 4)}
									</span>
								</div>

								<p>"{review.comment}"</p>

								<div className="review-card-date-rating">
									<span>⭐ {review.rating}/10</span>
									<span>
										{new Date(review.createdAt).toLocaleDateString('pt-BR')}
									</span>
								</div>

								<div className="review-card-actions">
									<Button
										variant="secondary"
										onClick={() => setEditingReview(review)}
									>
										Editar
									</Button>
									<Button
										variant="danger"
										onClick={() => setReviewToDelete(review)}
									>
										Excluir
									</Button>
								</div>
							</div>
						</article>
					);
				})}
			</div>

			{editingReview && (
				<EditMovieReview
					isOpen={!!editingReview}
					review={editingReview}
					onClose={() => setEditingReview(null)}
					onUpdate={() =>
						queryClient.invalidateQueries({ queryKey: ['my-reviews'] })
					}
				/>
			)}

			<Modal
				isOpen={!!reviewToDelete}
				onClose={() => setReviewToDelete(null)}
				title="Confirmar exclusão"
			>
				<p>
					Tem certeza que deseja excluir sua avaliação de{' '}
					<strong>{reviewToDelete?.movie?.title}</strong>?
				</p>
				<p>Essa ação não poderá ser desfeita.</p>

				<div className="modal-action">
					<Button
						variant="secondary"
						onClick={() => setReviewToDelete(null)}
						loading={deleteMutation.isPending}
					>
						Cancelar
					</Button>
					<Button
						variant="danger"
						onClick={() => deleteMutation.mutate(reviewToDelete.id)}
						loading={deleteMutation.isPending}
					>
						Excluir
					</Button>
				</div>
			</Modal>
		</main>
	);
}

export default MyReviews;

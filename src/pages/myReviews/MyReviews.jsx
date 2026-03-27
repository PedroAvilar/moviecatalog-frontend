import { useEffect, useState } from "react";
import { deleteReview, getMyReviews } from "../../services/apiService";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import Button from "../../components/button/Button";
import EmptyState from "../../components/emptyState/EmptyState";
import { getPosterUrl } from "../../utils/getPosterUrl";
import { useToast } from "../../context/ToastContext";
import './myReviews.css';
import EditMovieReview from "../../components/movieReviews/EditMovieReview";
import Modal from "../../components/modal/Modal";

function MyReviews() {
    const { showToast } = useToast();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [editingReview, setEditingReview] = useState(null);
    const [reviewToDelete, setReviewToDelete] = useState(null);

    async function fetchReviews() {
        try {
            setLoading(true);
            const data = await getMyReviews();
            setReviews(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchReviews();
    }, []);

    const confirmDelete = async () => {
        if (!reviewToDelete) return;

        try {
            setLoading(true);
            const response = await deleteReview(reviewToDelete.id);
            setReviews(prev => prev.filter(r => r.id !== reviewToDelete.id));
            setReviewToDelete(null);
            showToast(response);
        } catch (err) {
            showToast(err);
        } finally {
            setLoading(false);
        }
    }

    if (error) return <ErrorMessage message={error} onRetry={fetchReviews} />

    if (loading) return null;

    if (reviews.length === 0) {
        return (
            <EmptyState 
                icon="📝"
                title="Você ainda não avaliou nenhum filme"
                description="Suas críticas e notas aparecerão aqui para você gerenciar."
                actionText='Explorar filmes'
            />
        );
    }

    return (
        <main className="my-reviews-container">
            <h2>Minhas avaliações</h2>

            <div className="reviews-grid">
                {reviews.map(review => (
                    <article key={review.id} className="review-card">
                        <div className="review-card-poster">
                            <img 
                                src={getPosterUrl(review.movieId?.poster_path)}
                                alt={review.movieId?.title}
                            />
                        </div>

                        <div className="review-card-content">
                            <div className="review-card-header">
                                <h3>{review.movieId?.title}</h3>
                                <span className="review-year">
                                    {review.movieId?.release_date?.slice(0,4)}
                                </span>
                            </div>

                            <p className="review-card-comment">
                                "{review.comment}"
                            </p>

                            <div className="review-card-date-rating">
                                <span>⭐ {review.rating}/10</span>
                                <span>{new Date(review.createdAt).toLocaleDateString('pt-BR')}</span>
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
                ))}
            </div>

            {editingReview && (
                <EditMovieReview 
                    isOpen={!!editingReview}
                    review={editingReview}
                    onClose={() => setEditingReview(null)}
                    onUpdate={fetchReviews}
                />
            )}

            <Modal
                isOpen={!!reviewToDelete}
                onClose={() => setReviewToDelete(null)}
                title='Confirmar exclusão'
            >
                <p>Tem certeza que deseja excluir sua avaliação de <strong>{reviewToDelete?.movieId?.title}</strong>?</p>
                <p>Essa ação não poderá ser desfeita.</p>

                <div className="modal-action">
                    <Button
                        variant="secondary"
                        onClick={() => setReviewToDelete(null)}
                        disabled={loading}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="danger"
                        onClick={confirmDelete}
                        loading={loading}
                    >
                        Excluir
                    </Button>
                        
                </div>
            </Modal>
        </main>
    );
}

export default MyReviews;
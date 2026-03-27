import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createReview } from "../../services/apiService";
import { useToast } from "../../context/ToastContext";
import Button from "../button/Button";
import "./movieReviews.css";

function MovieReviews({ movieId, reviews, onReviewAdded }) {
    const { signed, user } = useAuth();
    const { showToast } = useToast();
    const [rating, setRating] = useState(10);
    const [comment, setComment] = useState('');

    const userAlreadyReviewed = reviews.some(r => r.userId?.id === user?.id);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const response = await createReview({ movieId, rating, comment });
            setComment('');
            setRating(10);
            onReviewAdded();
            showToast(response);
        } catch (err) {
            showToast(err);
        }
    }

    return (
        <section className="movie-reviews-section">
            <h2>Avaliações</h2>
            
            {signed ? (
                !userAlreadyReviewed ? (
                    <form className="review-form" onSubmit={handleSubmit}>
                        <h3>Deixe sua avaliação</h3>

                        <div className="review-inputs">
                            <div className="review-stars">
                                {[1,2,3,4,5,6,7,8,9,10].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        className={`star ${star <= rating ? 'active' : ''}`}
                                        onClick={() => setRating(star)}
                                    >
                                        ★
                                    </button>
                                ))}
                                <p>{rating}/10</p>
                            </div>
                            <textarea
                                placeholder="O que você achou do filme?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                        >
                            Publicar
                        </Button>
                    </form>
                ) : (
                    <p className="review-info">Você já avaliou esse filme. Gerencie suas notas em "Minhas avaliações".</p>
                )
            ) : (
                <p className="review-info">Faça login para avaliar esse filme.</p>
            )}

            <div className="review-list">
                {reviews.length > 0 ? (
                    reviews.map(review => (
                        <div key={review.id} className="review-item">
                            <div className="review-header">
                                <p>{review.userId?.name || 'Usuário'}</p>
                                <p>⭐ {review.rating}</p>
                            </div>
                            <p className="review-comment">{review.comment}</p>
                            <p className="review-date">{new Date(review.createdAt).toLocaleDateString('pt-BR')}</p>
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
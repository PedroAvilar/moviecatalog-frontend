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

    const handleRatingChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setRating('');
            return;
        }
        const numVale = Number(val);
        if (numVale <= 10) {
            setRating(numVale);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (rating === '') {
            showToast({ message: 'Insira uma nota na avaliação', type: 'error' });
            return;
        }

        if (rating < 0 || rating > 10) {
            showToast({ message: "A nota deve ser entre 0 e 10", type: 'error' });
            return;
        }

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
        <section>
            <h2>Avaliações</h2>
            
            {signed ? (
                !userAlreadyReviewed ? (
                    <form onSubmit={handleSubmit}>
                        <h3>Deixe sua avaliação</h3>

                        <div className="review-inputs">
                            <div className="review-rating">
                                <p>Sua nota de 0 a 10</p>
                                <div className="review-input-rating">
                                    <span>⭐</span>
                                    <input 
                                        type="number"
                                        min='0'
                                        max='10'
                                        step='1'
                                        value={rating}
                                        onChange={handleRatingChange}
                                        required
                                    />
                                    <span>/ 10</span>
                                </div>
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
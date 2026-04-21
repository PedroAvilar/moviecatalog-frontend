import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createReview } from "../../services/apiService";
import { useToast } from "../../context/ToastContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "../button/Button";
import "./movieReviews.css";

function MovieReviews({ movieId, reviews }) {
    const { signed, user } = useAuth();
    const { showToast } = useToast();
    const [rating, setRating] = useState(10);
    const [comment, setComment] = useState('');
    const queryClient = useQueryClient();

    const userAlreadyReviewed = reviews.some(r => r.userId?.id === user?.id);

    const mutation = useMutation({
        mutationFn: (newReview) => createReview(newReview),
        onSuccess: (response) => {
            setComment('');
            setRating(10);
            showToast(response);
            queryClient.invalidateQueries({ queryKey: ['movie', movieId]});
            queryClient.invalidateQueries({ queryKey: ['my-reviews'] });
        },
        onError: (err) => {
            showToast(err);
        }
    });

    const handleRatingChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setRating('');
            return;
        }
        const numVale = Number(val);
        if (numVale >= 0 && numVale <= 10) {
            setRating(numVale);
        }
    }

    function handleSubmit(e) {
        e.preventDefault();

        if (rating === '') {
            showToast({ message: 'Insira uma nota na avaliação', type: 'error' });
            return;
        }

        if (rating < 0 || rating > 10) {
            showToast({ message: "A nota deve ser entre 0 e 10", type: 'error' });
            return;
        }

        mutation.mutate({ movieId, rating, comment });
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
                                        disabled={mutation.isPending}
                                        required
                                    />
                                    <span>/ 10</span>
                                </div>
                            </div>
                            <textarea
                                placeholder="O que você achou do filme?"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                disabled={mutation.isPending}
                                required
                            />
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
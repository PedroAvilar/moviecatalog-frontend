import { useState } from "react";
import { updateReview } from "../../services/apiService";
import Button from "../button/Button";
import Modal from "../modal/Modal";
import ErrorMessage from "../errorMessage/ErrorMessage";

function EditMovieReview({ isOpen, onClose, review, onUpdate }) {
    const [rating, setRating] = useState(review?.rating || 10);
    const [comment, setComment] = useState(review?.comment || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true);
            await updateReview(review.id, { rating, comment });
            onUpdate();
            onClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    if (error) return <ErrorMessage message={error} />

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Editar avaliação de ${review?.movieId?.title}`}>
            <form onSubmit={handleSubmit} className="review-form">
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
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        placeholder="Edite seu comentário..."
                    />
                </div>
                <div className="modal-action">
                    <Button type="button" variant="secondary" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" loading={loading}>
                        Salvar
                    </Button>
                </div>
            </form>
        </Modal>
    );
}

export default EditMovieReview;
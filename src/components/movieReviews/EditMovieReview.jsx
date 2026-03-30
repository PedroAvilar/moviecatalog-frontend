import { useEffect, useState } from "react";
import { updateReview } from "../../services/apiService";
import { useToast } from "../../context/ToastContext";
import Button from "../button/Button";
import Modal from "../modal/Modal";

function EditMovieReview({ isOpen, onClose, review, onUpdate }) {
    const { showToast } = useToast();
    const [rating, setRating] = useState(review?.rating ?? 10);
    const [comment, setComment] = useState(review?.comment || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (review) {
            setRating(review.rating);
            setComment(review.comment);
        }
    }, [review, isOpen]);

    const handleRatingChange = (e) => {
        const val = e.target.value;
        if (val === '') {
            setRating('');
            return;
        }
        const numValue = Number(val);
        if (numValue <= 10) {
            setRating(numValue);
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
            setLoading(true);
            const response = await updateReview(review.id, { rating, comment });
            onUpdate();
            onClose();
            showToast(response);
        } catch (err) {
            showToast(err);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Editar avaliação de ${review?.movieId?.title}`}>
            <form onSubmit={handleSubmit}>
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
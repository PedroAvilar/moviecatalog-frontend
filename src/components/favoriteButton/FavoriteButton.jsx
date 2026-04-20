import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFavorites, toggleFavorite } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { HEART_PATH } from "../../utils/Icons";
import './favoriteButton.css';

function FavoriteButton({ movie, size = 30, variant }) {
    const { user } = useAuth();
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data: favorites = [] } = useQuery({
        queryKey: ['favorites', user?.id],
        queryFn: getFavorites,
        enabled: !!user,
    });

    const isFavorite = favorites.some(fav => fav.id === movie.id);

    const mutation = useMutation({
        mutationFn: () => toggleFavorite(movie),
        onSuccess: (response) => {
            showToast(response);
            queryClient.invalidateQueries({ queryKey: ['favorites', user?.id] });
        },
        onError: (err) => {
            showToast(err);
        }
    });

    async function handleClick(e) {
        e.stopPropagation();
        if (!user) {
            showToast('Faça login para favoritar filmes');
            return;
        }
        mutation.mutate();
    }

    return (
        <button
            className={`favorite-btn ${variant === 'floating' ? 'floating' : ''} ${isFavorite ? 'active' : ''} ${mutation.isPending ? 'loading' : ''}`}
            onClick={handleClick}
            disabled={mutation.isPending}
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            style={{ width: size, height: size, minWidth: size, minHeight: size }}
        >
            <svg
                viewBox="0 0 24 24"
                className="heart-svg"
            >
                <path
                    className="heart-outline"
                    d={HEART_PATH}
                />
                <path 
                    className="heart-fill"
                    d={HEART_PATH}
                />
            </svg>
        </button>
    );
}

export default FavoriteButton;
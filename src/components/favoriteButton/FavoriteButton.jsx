import { useFavorites } from "../../context/FavoritesContext";
import { HEART_PATH } from "../../utils/Icons";
import './favoriteButton.css';

function FavoriteButton({ movie, size = 30, variant }) {
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();
    const favorite = isFavorite(movie.id);

    function handleClick(e) {
        e.stopPropagation();
        favorite ? removeFavorite(movie.id) : addFavorite(movie);
    }

    return (
        <button
            className={`favorite-btn ${variant === 'floating' ? 'floating' : ''} ${favorite ? 'active' : ''}`}
            onClick={handleClick}
            aria-pressed={favorite}
            aria-label={favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
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
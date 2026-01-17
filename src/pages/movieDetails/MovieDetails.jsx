import { useParams } from "react-router-dom";
import { moviesMock } from "../../data/moviesMock";
import './movieDetails.css';
import { useState } from "react";
import { isFavorite, removeFavorite, saveFavorite } from "../../services/favoritesService";

function MovieDetails() {
    const {id} = useParams();

    const movie = moviesMock.find(m => m.id === Number(id));

    const [favorite, setFavorite] = useState(isFavorite(movie?.id));

    if (!movie) {
        return <p>Ops! Filme não encontrado.</p>
    }

    // Função para alternar o estado de favorito
    function handleFavorite() {
        if (favorite) {
            removeFavorite(movie.id);
        } else {
            saveFavorite(movie);
        }
        setFavorite(!favorite);
    }

    return (
        <section className="movie-details">
            <img src={movie.poster} alt={movie.title} />

            <div className="movie-info">
                <h1>{movie.title}</h1>
                <p><strong>Nota: </strong>{movie.rating}</p>
                <p><strong>Descrição: </strong></p>
                <p><strong>Favorito: </strong>
                    <button 
                        onClick={handleFavorite}
                        className="favorite-btn"
                    >
                        {favorite ? '💔 Remover' : '❤️ Adicionar'}
                    </button>
                </p>
            </div>
        </section>
    );
}

export default MovieDetails;
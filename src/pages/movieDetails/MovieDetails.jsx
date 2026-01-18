import { useParams } from "react-router-dom";
import './movieDetails.css';
import { useEffect, useState } from "react";
import { isFavorite, removeFavorite, saveFavorite } from "../../services/favoritesService";
import { getMovieDetails } from "../../services/tmdbService";

function MovieDetails() {
    // Obtém ID da URL
    const {id} = useParams();

    // Estados para armazenar os dados do filme e status de favorito
    const [movie, setMovie] = useState(null)
    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        // Buscar detalhes e verificar se é favorito
        async function fetchMovie() {
            const data = await getMovieDetails(id);
            setMovie(data);
            setFavorite(isFavorite(data.id));
        }

        fetchMovie();
    }, [id]); // Reexecuta se o ID na URL mudar

    if (!movie) {
        return <p>Carregando filme...</p>
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
            <img 
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title} 
            />

            <div className="movie-info">

                <h1>{movie.title}</h1>

                <p><strong>Nota: ⭐</strong>
                    {movie.vote_average > 0 
                        ? movie.vote_average.toFixed(1)
                        : 'Sem avaliação.'}
                </p>

                <p><strong>Descrição: </strong>
                    {movie.overview && movie.overview.trim() !== ''
                        ? movie.overview
                        : 'Sem descrição disponível.'}
                </p>

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
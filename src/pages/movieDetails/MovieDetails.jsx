import { useParams } from "react-router-dom";
import './movieDetails.css';
import { useEffect, useState } from "react";
import { isFavorite, removeFavorite, saveFavorite } from "../../services/favoritesService";
import { getMovieCredits, getMovieDetails } from "../../services/tmdbService";
import { getPosterUrl } from "../../utils/getPosterUrl";
import CastList from "../../components/castList/CastList";

function MovieDetails() {
    // Obtém ID da URL
    const {id} = useParams();

    // Estados para armazenar os dados do filme e status de favorito
    const [movie, setMovie] = useState(null);
    const [favorite, setFavorite] = useState(false);
    const [cast, setCast] = useState([]);

    useEffect(() => {
        // Buscar detalhes e verificar se é favorito
        async function fetchMovie() {
            const data = await getMovieDetails(id);
            setMovie(data);
            setFavorite(isFavorite(data.id));

            const creditsData = await getMovieCredits(id);
            setCast(creditsData.cast);
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
        <div className="movie-details-wrapper">
            <section className="movie-details">
                <img 
                    src={getPosterUrl(movie.poster_path)}
                    alt={movie.title} 
                />

                <div className="movie-info">

                    <h1>{movie.title} ({movie.release_date?.slice(0,4)})</h1>
                    
                    <div className="movie-rating-runtime-genres">
                        <p>⭐ 
                            {movie.vote_average > 0 
                                ? movie.vote_average.toFixed(1)
                                : '--'}
                        </p>

                        {movie.runtime && (
                            <p>{movie.runtime} min</p>
                        )}

                        {movie.genres && (
                            <p>{movie.genres.map(g => g.name).join(' / ')}</p>
                        )}
                    </div>

                    <h2>Descrição</h2>
                    <p>
                        {movie.overview && movie.overview.trim() !== ''
                            ? movie.overview
                            : 'Sem descrição disponível.'}
                    </p>

                    <div className="movie-favorite-btn">
                        <h2>Favorito</h2>
                        <p>
                            <button 
                                onClick={handleFavorite}
                                className={`favorite-btn ${favorite ? 'remove' : 'add'}`}
                            >
                                {favorite ? 'Remover' : 'Adicionar'}
                            </button>
                        </p>
                    </div>
                </div>
            </section>

            <CastList cast={cast} />
        </div>
    );
}

export default MovieDetails;
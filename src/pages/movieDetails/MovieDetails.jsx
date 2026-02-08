import { useParams } from "react-router-dom";
import './movieDetails.css';
import '../../styles/skeleton.css';
import '../../styles/transitions.css'
import { useEffect, useState } from "react";
import { isFavorite, removeFavorite, saveFavorite } from "../../services/favoritesService";
import { getMovieCredits, getMovieDetails } from "../../services/tmdbService";
import { getPosterUrl } from "../../utils/getPosterUrl";
import CastList from "../../components/castList/CastList";
import MovieDetailsSkeleton from "./MovieDetailsSkeleton";
import CastListSkeleton from "../../components/castList/CastListSkeleton";

function MovieDetails() {
    // Obtém ID da URL
    const {id} = useParams();

    // Estados para armazenar os dados e status
    const [movie, setMovie] = useState(null);
    const [favorite, setFavorite] = useState(false);
    const [cast, setCast] = useState([]);
    const [loading, setloading] = useState(true);
    const [posterLoading, setPosterLoading] = useState(false);

    useEffect(() => {
        // Buscar detalhes e verificar se é favorito
        async function fetchMovie() {
            setloading(true);

            const data = await getMovieDetails(id);
            setMovie(data);
            setFavorite(isFavorite(data.id));

            const creditsData = await getMovieCredits(id);
            setCast(creditsData.cast);

            setloading(false);
        }

        fetchMovie();
    }, [id]); // Reexecuta se o ID na URL mudar

    if (loading) {
        return (
            <div className="movie-details-wrapper">
                <MovieDetailsSkeleton />
                <CastListSkeleton />
            </div>
        )
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

                {/* Wrapper com skeleton */}
                <div className={`movie-details-poster-wrapper ${!posterLoading ? 'skeleton-base' : ''}`}>
                    <img 
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title}
                        className={`movie-details-poster fade fade-slow ${posterLoading ? 'show' : ''}`}
                        onLoad={() => setPosterLoading(true)}
                    />
                </div>

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
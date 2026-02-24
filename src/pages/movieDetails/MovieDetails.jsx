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
import Button from "../../components/button/Button";

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
        <main className="movie-details-wrapper">
            <article className="movie-details">

                {/* Wrapper com skeleton */}
                <div className={`movie-details-poster-wrapper ${!posterLoading ? 'skeleton-base' : ''}`}>
                    <img 
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title}
                        className={`movie-details-poster fade fade-slow ${posterLoading ? 'show' : ''}`}
                        onLoad={() => setPosterLoading(true)}
                    />
                </div>

                <section className="movie-info">

                    <div className="movie-header">
                        <h1>{movie.title} ({movie.release_date?.slice(0,4)})</h1>
                        
                        <div className="movie-meta">
                            <span>
                                ⭐ {movie.vote_average > 0 
                                    ? movie.vote_average.toFixed(1)
                                    : '--'}
                            </span>

                            {movie.runtime && (
                                <span>{movie.runtime} min</span>
                            )}

                            {movie.genres && (
                                <span>
                                    {movie.genres.map(g => g.name).join(' / ')}
                                </span>
                            )}
                        </div>
                    </div>

                    <section className="movie-description">
                        <h2>Descrição</h2>
                        <p>
                            {movie.overview && movie.overview.trim() !== ''
                                ? movie.overview
                                : 'Sem descrição disponível.'}
                        </p>
                    </section>

                    <div className="movie-favorite-action">
                        <span className="movie-favorite-label">
                            Favorito
                        </span>

                        <Button
                            onClick={handleFavorite}
                            variant={favorite? 'danger' : 'secondary'}
                            aria-pressed={favorite}
                        >
                            {favorite ? 'Remover' : 'Adicionar'}
                        </Button>
                    </div>
                </section>
            </article>

            <CastList cast={cast} />
        </main>
    );
}

export default MovieDetails;
import { useParams } from "react-router-dom";
import './movieDetails.css';
import '../../styles/skeleton.css';
import '../../styles/transitions.css'
import { useEffect, useState } from "react";
import { getMovieCredits, getMovieDetails } from "../../services/tmdbService";
import { getPosterUrl } from "../../utils/getPosterUrl";
import CastList from "../../components/castList/CastList";
import MovieDetailsSkeleton from "./MovieDetailsSkeleton";
import CastListSkeleton from "../../components/castList/CastListSkeleton";
import Button from "../../components/button/Button";
import { useFavorites } from '../../context/FavoritesContext';

function MovieDetails() {
    // Obtém ID da URL
    const {id} = useParams();

    // Contexto de favoritos
    const { isFavorite, addFavorite, removeFavorite } = useFavorites();

    // Estados para armazenar os dados e status
    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setloading] = useState(true);
    const [posterLoading, setPosterLoading] = useState(false);

    // Verifica se o filme é favorito
    const favorite = movie ? isFavorite(movie.id) : false;

    useEffect(() => {
        // Buscar detalhes do filme e elenco
        async function fetchMovie() {
            setloading(true);

            const data = await getMovieDetails(id);
            setMovie(data);

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

    // Manipulador para adicionar ou remover dos favoritos
    function handleFavorite() {
        if (favorite) {
            removeFavorite(movie.id);
        } else {
            addFavorite(movie);
        }
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
                            aria-label={favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
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
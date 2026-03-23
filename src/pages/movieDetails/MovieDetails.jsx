import { useParams } from "react-router-dom";
import './movieDetails.css';
import '../../styles/skeleton.css';
import '../../styles/transitions.css'
import { useEffect, useState } from "react";
import { getMovieDetails } from "../../services/apiService";
import { getPosterUrl } from "../../utils/getPosterUrl";
import CastList from "../../components/castList/CastList";
import MovieDetailsSkeleton from "./MovieDetailsSkeleton";
import CastListSkeleton from "../../components/castList/CastListSkeleton";
import FavoriteButton from "../../components/favoriteButton/FavoriteButton";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";

function MovieDetails() {
    const {id} = useParams();

    const [movie, setMovie] = useState(null);
    const [loading, setloading] = useState(true);
    const [posterLoading, setPosterLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchMovie() {
        try {
            setloading(true);
            setError(null);

            const data = await getMovieDetails(id);
            setMovie(data);
        } catch (e) {
            setError(e.message);
        } finally {
            setloading(false);
        }
    }

    useEffect(() => {
        fetchMovie();
    }, [id]);

    if (error) return <ErrorMessage message={error} onRetry={fetchMovie} />

    if (loading) {
        return (
            <div className="movie-details-wrapper">
                <MovieDetailsSkeleton />
                <CastListSkeleton />
            </div>
        )
    }

    return (
        <main className="movie-details-wrapper">
            <article className="movie-details">

                <div className={`movie-details-poster-wrapper ${!posterLoading ? 'skeleton-base' : ''}`}>
                    <img 
                        src={getPosterUrl(movie.poster_path)}
                        alt={movie.title}
                        className={`movie-details-poster fade fade-slow ${posterLoading ? 'show' : ''}`}
                        onLoad={() => setPosterLoading(true)}
                    />
                </div>

                <section className="movie-info">

                    <div className="movie-title-icon">
                        <h1>{movie.title} ({movie.release_date?.slice(0,4)})</h1>

                        <FavoriteButton 
                            movie={movie}
                            size={55}
                        />
                    </div>
                        
                    <div className="movie-meta">
                        <span>
                            ⭐ {movie.vote_average > 0 
                                ? movie.vote_average.toFixed(1) + ' / 10'
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

                    <section className="movie-text">
                        <h2>Descrição</h2>
                        <p>
                            {movie.overview && movie.overview.trim() !== ''
                                ? movie.overview
                                : 'Sem descrição disponível.'}
                        </p>
                    </section>

                    {movie.directors?.length > 0 && (
                        <section className="movie-text">
                            <h2>Direção</h2>
                            <p>
                                {movie.directors.join(' / ')}
                            </p>
                        </section>
                    )}
                    
                    {movie.production_companies?.length > 0 && (
                        <section className="movie-text">
                            <h2>Produção</h2>
                            <p>
                                {movie.production_companies.join(' / ')}
                            </p>
                        </section>
                    )}
                </section>
            </article>

            <CastList cast={movie.cast} />
        </main>
    );
}

export default MovieDetails;
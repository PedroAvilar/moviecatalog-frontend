import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../../services/apiService";
import CastList from "../../components/castList/CastList";
import MovieDetailsSkeleton from "./MovieDetailsSkeleton";
import CastListSkeleton from "../../components/castList/CastListSkeleton";
import FavoriteButton from "../../components/favoriteButton/FavoriteButton";
import ErrorMessage from "../../components/errorMessage/ErrorMessage";
import MovieReviews from "../../components/movieReviews/MovieReviews";
import MoviePoster from "../../components/moviePoster/MoviePoster";
import './movieDetails.css';

function MovieDetails() {
    const {id} = useParams();

    const { data: movie, isLoading, error, refetch } = useQuery({
        queryKey: ['movie', id],
        queryFn: () => getMovieDetails(id),
        staleTime: 1000 * 60 * 10,
        networkMode: 'always',
    });

    if (isLoading) {
        return (
            <div>
                <MovieDetailsSkeleton />
                <CastListSkeleton />
            </div>
        );
    }

    if (error || !movie) return <ErrorMessage message={error?.message} onRetry={refetch} />;
    
    return (
        <main>
            <article className="movie-details">

                <MoviePoster 
                    path={movie.poster_path}
                    alt={movie.title}
                    className="poster-lg"
                />

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

            <MovieReviews 
                movieId={id}
                reviews={movie.reviews}
            />
        </main>
    );
}

export default MovieDetails;
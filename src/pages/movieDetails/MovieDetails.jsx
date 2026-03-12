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
import FavoriteButton from "../../components/favoriteButton/FavoriteButton";

function MovieDetails() {
    const {id} = useParams();

    const [movie, setMovie] = useState(null);
    const [cast, setCast] = useState([]);
    const [loading, setloading] = useState(true);
    const [posterLoading, setPosterLoading] = useState(false);
    const [directors, setDirectors] = useState([]);

    useEffect(() => {
        async function fetchMovie() {
            setloading(true);

            const data = await getMovieDetails(id);
            setMovie(data);

            const creditsData = await getMovieCredits(id);
            setCast(creditsData.cast);

            const directorsList = creditsData.crew.filter(member => member.job === 'Director') || [];
            setDirectors(directorsList);

            setloading(false);
        }

        fetchMovie();
    }, [id]);

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

                    {directors.length > 0 && (
                        <section className="movie-text">
                            <h2>Direção</h2>
                            <p>
                                {directors.map(d => d.name).join(' / ')}
                            </p>
                        </section>
                    )}
                    
                    {movie.production_companies?.length > 0 && (
                        <section className="movie-text">
                            <h2>Produção</h2>
                            <p>
                                {movie.production_companies.map(c => c.name).join(' / ')}
                            </p>
                        </section>
                    )}
                </section>
            </article>

            <CastList cast={cast} />
        </main>
    );
}

export default MovieDetails;
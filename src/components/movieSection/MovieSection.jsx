import { getPosterUrl } from '../../utils/getPosterUrl';
import MovieCard from '../moviecard/MovieCard';
import MovieCardSkeleton from '../moviecard/MovieCardSkeleton';
import './movieSection.css';

function MovieSection({ title, movies, loading }) {
    return (
        <section className='movie-section'>
            <h2 className='section-title'>{title}</h2>

            <div className='movie-grid'>
                {movies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        id={movie.id}
                        title={movie.title}
                        poster={getPosterUrl(movie.poster_path)}
                        rating={movie.vote_average?.toFixed(1)}
                    />
                ))}

                {loading && 
                    Array.from({ length: 15 }).map((_, index) => (
                        <MovieCardSkeleton key={`skeleton-${index}`} />
                    ))
                }
            </div>
        </section>
    );
}

export default MovieSection;
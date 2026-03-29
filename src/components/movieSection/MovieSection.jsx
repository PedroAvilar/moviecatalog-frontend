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
                        poster_path={movie.poster_path}
                        vote_average={movie.vote_average}
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
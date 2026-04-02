import MovieCard from '../moviecard/MovieCard';
import MovieCardSkeleton from '../moviecard/MovieCardSkeleton';
import './movieSection.css';

function MovieSection({ title, movies, loading }) {
    return (
        <section>
            <h2>{title}</h2>

            <div className='movie-grid'>
                {movies.map(movie => (
                    <MovieCard key={movie.id} {...movie}/>
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
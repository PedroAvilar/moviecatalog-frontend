import MovieCard from '../moviecard/MovieCard';
import './movieSection.css';

function MovieSection({ title, movies }) {
    return (
        <section className='movie-section'>
            <h2 className='section-title'>{title}</h2>

            <div className='movie-grid'>
                {movies.map(movie => (
                    <MovieCard
                        key={movie.id}
                        title={movie.title}
                        poster={movie.poster}
                        rating={movie.rating}
                    />
                ))}
            </div>
        </section>
    );
}

export default MovieSection;
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
                        id={movie.id}
                        title={movie.title}
                        poster={
                            movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                : 'https://via.placeholder.com/300x450?text=Sem+Imagem'
                        }
                        rating={movie.vote_average?.toFixed(1)}
                    />
                ))}
            </div>
        </section>
    );
}

export default MovieSection;
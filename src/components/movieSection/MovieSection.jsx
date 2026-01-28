import { getPosterUrl } from '../../utils/getPosterUrl';
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
                        poster={getPosterUrl(movie.poster_path)}
                        rating={movie.vote_average?.toFixed(1)}
                    />
                ))}
            </div>
        </section>
    );
}

export default MovieSection;
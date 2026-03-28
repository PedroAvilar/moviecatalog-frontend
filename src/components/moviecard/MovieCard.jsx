import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';
import FavoriteButton from '../favoriteButton/FavoriteButton';
import MoviePoster from '../moviePoster/MoviePoster';
import './movieCard.css';

function MovieCard ({ id, title, poster_path, rating }) {
    const navigate = useNavigate();
    const titleSlug = slugify(title);

    return (
        <article 
            className='movie-card'
            onClick={() => navigate(`/filme/${id}/${encodeURIComponent(titleSlug)}`)}
        >
            <div className='movie-card-poster-favorite'>
                <MoviePoster 
                    path={poster_path}
                    alt={title}
                    size='w342'
                    className='poster-sm'
                />
                <FavoriteButton
                    movie={{ id, title, poster_path}}
                    size={35}
                    variant='floating'
                />
            </div>
            <h3 className='movie-card-title'>{title}</h3>
            {rating && <p className='movie-card-rating'>⭐ {rating}</p>}
        </article>
    );
}

export default MovieCard;
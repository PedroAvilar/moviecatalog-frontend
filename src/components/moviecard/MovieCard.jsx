import { useNavigate } from 'react-router-dom';
import './movieCard.css';
import '../../styles/skeleton.css';
import '../../styles/transitions.css';
import { slugify } from '../../utils/slugify';
import { useState } from 'react';
import FavoriteButton from '../favoriteButton/FavoriteButton';

function MovieCard ({ id, title, poster, rating }) {
    const navigate = useNavigate();
    const [isLoaded, setIsLoaded] = useState(false);
    
    const titleSlug = slugify(title);

    return (
        <article 
            className='movie-card'
            onClick={() => navigate(`/filme/${id}/${encodeURIComponent(titleSlug)}`)}
        >
            <div className={`movie-card-poster-wrapper ${!isLoaded ? 'skeleton-base' : ''}`}> 
                <img 
                    src={poster} 
                    alt={`Poster do filme ${title}`}
                    className={`movie-card-poster fade ${isLoaded ? 'show' : ''}`}
                    onLoad={() => setIsLoaded(true)}
                    loading='lazy'
                />
                <FavoriteButton
                    movie={{ id, title, poster_path: poster }}
                    size={35}
                    variant='floating'
                />
            </div>
            <h3 className='movie-title'>{title}</h3>
            {rating && <p className='movie-rating'>⭐ {rating}</p>}
        </article>
    );
}

export default MovieCard;
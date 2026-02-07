import { useNavigate } from 'react-router-dom';
import './movieCard.css';
import '../../styles/skeleton.css';
import '../../styles/transitions.css';
import { slugify } from '../../utils/slugify';
import { useState } from 'react';

function MovieCard ({ id, title, poster, rating }) {
    const navigate = useNavigate(); /* Hook para navegação programática */
    const [isLoaded, setIsLoaded] = useState(false); /* Estado para fade-in em transitions */
    
    const titleSlug = slugify(title); /* Gera slug do título do filme */

    return (
        <article 
            className='movie-card'
            onClick={() => navigate(`/filme/${id}/${titleSlug}`)} /* Navega para detalhes do filme */
        >
            {/* Wrapper com skeleton */}
            <div className={`movie-card-poster-wrapper ${!isLoaded ? 'skeleton-base' : ''}`}> 
                <img 
                    src={poster} 
                    alt={`Poster do filme ${title}`}
                    className={`movie-card-poster fade ${isLoaded ? 'show' : ''}`}
                    onLoad={() => setIsLoaded(true)}
                    loading='lazy'
                />
            </div>
            <h3 className='movie-title'>{title}</h3>
            {rating && <p className='movie-rating'>⭐ {rating}</p>}
        </article>
    );
}

export default MovieCard;
import { useNavigate } from 'react-router-dom';
import './movieCard.css';
import { slugify } from '../../utils/slugify';

function MovieCard ({ id, title, poster, rating }) {
    const navigate = useNavigate(); /* Hook para navegação programática */
    
    const titleSlug = slugify(title); /* Gera slug do título do filme */

    return (
        <article 
            className='movie-card'
            onClick={() => navigate(`/filme/${id}/${titleSlug}`)} /* Navega para detalhes do filme */
        >
            <img 
                src={poster} 
                alt={`Poster do filme ${title}`}
                className='movie-poster'
            />
            <h3 className='movie-title'>{title}</h3>
            {rating && <p className='movie-rating'>⭐ {rating}</p>}
        </article>
    );
}

export default MovieCard;
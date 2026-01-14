import './movieCard.css';

function MovieCard ({ title, poster, rating }) {
    return (
        <article className='movie-card'>
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
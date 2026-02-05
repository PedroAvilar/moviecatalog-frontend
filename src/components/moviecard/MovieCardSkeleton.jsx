import './movieCardSkeleton.css';
import '../../styles/skeleton.css';

function MovieCardSkeleton() {
    return (
        <article className='movie-card skeleton-card'>
            <div className='skeleton-card-poster skeleton-base'/>
            <div className='skeleton-card-title skeleton-base' />
            <div className='skeleton-card-rating skeleton-base'/>
        </article>
    );
}

export default MovieCardSkeleton;
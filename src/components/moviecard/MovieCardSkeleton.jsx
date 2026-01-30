import './movieCardSkeleton.css';
import '../../styles/skeleton.css';

function MovieCardSkeleton() {
    return (
        <article className='movie-card skeleton'>
            <div className='skeleton-poster skeleton-base'/>
            <div className='skeleton-title skeleton-base' />
            <div className='skeleton-rating skeleton-base'/>
        </article>
    );
}

export default MovieCardSkeleton;
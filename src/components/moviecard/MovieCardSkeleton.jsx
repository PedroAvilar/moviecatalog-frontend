import './movieCardSkeleton.css';

function MovieCardSkeleton() {
    return (
        <article className='movie-card skeleton'>
            <div className='skeleton-poster'/>
            <div className='skeleton-title'/>
            <div className='skeleton-rating'/>
        </article>
    );
}

export default MovieCardSkeleton;
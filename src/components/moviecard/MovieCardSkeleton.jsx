import '../../styles/skeleton.css';

function MovieCardSkeleton() {
    return (
        <article className='movie-card' style={{ pointerEvents: 'none' }}>
            <div className='skeleton-poster skeleton-poster-sm skeleton-base' />
            <div className='skeleton-text skeleton-p skeleton-w-80 skeleton-base' style={{ marginTop: '0.5rem' }} />
            <div className='skeleton-text skeleton-p skeleton-w-40 skeleton-base' style={{ marginTop: '0.5rem' }} />
        </article>
    );
}

export default MovieCardSkeleton;
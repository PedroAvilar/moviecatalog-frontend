import './movieDetails.css';
import '../../styles/skeleton.css';

function MovieDetailsSkeleton() {
    return (
        <article style={{ pointerEvents: 'none' }}>
            <section className='movie-details'>

                <div className='skeleton-poster skeleton-poster-lg skeleton-base' />

                <div className='movie-info skeleton-mobile-center' style={{ width: '100%', margin: '0 auto' }}>

                    <div className='movie-title-icon'>
                        <div className='skeleton-text skeleton-h1 skeleton-base' />
                        <div className='skeleton-avatar skeleton-base' style={{ width: '50px', height: '50px' }} />
                    </div>

                    <div className='movie-meta' style={{ width: '100%' }}>
                        <div className='skeleton-text skeleton-h3 skeleton-w-10 skeleton-base' />
                        <div className='skeleton-text skeleton-h3 skeleton-w-10 skeleton-base' />
                        <div className='skeleton-text skeleton-h3 skeleton-w-40 skeleton-base' />
                    </div>

                    <div className='skeleton-text skeleton-h2 skeleton-base' />

                    <div className='skeleton-text skeleton-p skeleton-w-100 skeleton-base' />
                    <div className='skeleton-text skeleton-p skeleton-w-100 skeleton-base' />
                    <div className='skeleton-text skeleton-p skeleton-w-100 skeleton-base' />
                    <div className='skeleton-text skeleton-p skeleton-w-100 skeleton-base' />

                    <div className='skeleton-text skeleton-h2 skeleton-base' />

                    <div className='skeleton-text skeleton-p skeleton-w-60 skeleton-base'/>

                    <div className='skeleton-text skeleton-h2 skeleton-base' />

                    <div className='skeleton-text skeleton-p skeleton-w-100 skeleton-base' />
                    <div className='skeleton-text skeleton-p skeleton-w-100 skeleton-base' />

                </div>
            </section>
        </article>
    );
}

export default MovieDetailsSkeleton;
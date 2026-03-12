import './movieDetailsSkeleton.css';
import '../../styles/skeleton.css';

function MovieDetailsSkeleton() {
    return (
        <article className='skeleton-details-wrapper'>
            <section className='skeleton-details'>

                <div className='skeleton-details-poster skeleton-base'/>

                <div className='skeleton-details-info'>

                    <div className='skeleton-details-title skeleton-base'/>

                    <div className='skeleton-details-group'>
                        <div className='skeleton-details-line small skeleton-base'/>
                        <div className='skeleton-details-line small skeleton-base'/>
                        <div className='skeleton-details-line medium skeleton-base'/>
                    </div>

                    <div className='skeleton-details-subtitle skeleton-base'/>

                    <div className='skeleton-details-line full skeleton-base'/>
                    <div className='skeleton-details-line full skeleton-base'/>
                    <div className='skeleton-details-line full skeleton-base'/>

                    <div className='skeleton-details-favorite-btn'>
                        <div className='skeleton-details-subtitle skeleton-base'/>
                        <div className='skeleton-details-btn skeleton-base'/>
                    </div>

                </div>
            </section>
        </article>
    );
}

export default MovieDetailsSkeleton;
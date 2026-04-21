import './castList.css'
import '../../styles/skeleton.css'

function CastListSkeleton() {
    return (
        <div className='cast-container skeleton-mobile-center' style={{ pointerEvents: 'none', margin: '2rem 0' }}>

            <div className='skeleton-text skeleton-h2 skeleton-base' />

            <div className='cast-scroll' style={{ overflowX: 'hidden' }}>

                {Array.from({ length: 10 }).map((_, index) => (
                    <div key={index} className='cast-card'>

                        <div className='cast-image-wrapper skeleton-avatar skeleton-base' />

                        <div className='cast-info' style={{ alignItems: 'center' }}>
                            <div className='skeleton-text skeleton-p skeleton-w-80 skeleton-base' style={{ marginBottom: '0.5rem' }} />
                            <div className='skeleton-text skeleton-p skeleton-w-60 skeleton-base' />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CastListSkeleton;
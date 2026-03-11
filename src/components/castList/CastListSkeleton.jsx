import './castListSkeleton.css'
import '../../styles/skeleton.css'

function CastListSkeleton() {
    return (
        <div className='skeleton-cast-container'>
            
            <div className='skeleton-cast-title skeleton-base'/>

            <div className='skeleton-cast-scroll'>

                {Array.from({ length: 10 }).map((_,index) => (
                    <div key={index} className='skeleton-cast-card'>

                        <div className='skeleton-cast-image skeleton-base'/>

                        <div className='skeleton-cast-info'>
                            <div className='skeleton-cast-name skeleton-base'/>
                            <div className='skeleton-cast-character skeleton-base'/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CastListSkeleton;
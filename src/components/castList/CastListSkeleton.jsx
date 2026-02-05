import './castListSkeleton.css'
import '../../styles/skeleton.css'

function CastListSkeleton() {
    return (
        <div className='skeleton-cast-container'>
            {/* Título h2 */}
            <div className='skeleton-cast-title skeleton-base'/>

            <div className='skeleton-cast-scroll'>

                {/* Cards */}
                {Array.from({ length: 10 }).map((_,index) => (
                    <div key={index} className='skeleton-cast-card'>

                        {/* Imagem */}
                        <div className='skeleton-cast-image skeleton-base'/>

                        {/* Info com name e character */}
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
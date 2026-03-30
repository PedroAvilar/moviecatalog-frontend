import { useState } from "react";
import { getProfileUrl } from "../../utils/getProfileUrl";
import './castList.css';
import '../../styles/skeleton.css';

function CastList({ cast }) {
    if (!cast?.length) return null;

    return (
        <div className="cast-container">
            <h2>Elenco principal</h2>
            <div className="cast-scroll">
                {cast.slice(0, 15).map(actor => (
                    <CastCard key={actor.id} actor={actor} />
                ))}
            </div>
        </div>
    );
}

function CastCard({ actor}) {
    const [loaded, setLoaded] = useState(false);

    return (
        <div className="cast-card">
            <div className={`cast-image-wrapper ${!loaded ? 'skeleton-base' : ''}`}>
                <img 
                    src={getProfileUrl(actor.profile_path)}
                    alt={actor.name} 
                    className={`cast-image fade fade-fast ${loaded ? 'show' : ''}`}
                    onLoad={() => setLoaded(true)}
                    loading="lazy"
                />
            </div>
            <div className="cast-info">
                <p className="cast-name">{actor.name}</p>
                <small className="cast-character">{actor.character}</small>
            </div>
        </div>
    );
}

export default CastList;
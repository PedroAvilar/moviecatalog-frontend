import { useState } from "react";
import { getProfileUrl } from "../../utils/getProfileUrl";
import './castList.css';
import '../../styles/skeleton.css';

// Componente principal para lista de atores
function CastList({ cast }) {
    if (!cast || cast.length === 0) return null;

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

// Componente para exibir cada ator
function CastCard({ actor}) {
    const [loaded, setLoaded] = useState(false); // Estado para transitions

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
                <p className="cast-character">{actor.character}</p>
            </div>
        </div>
    );
}

export default CastList;
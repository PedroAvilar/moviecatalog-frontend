import { getProfileUrl } from "../../utils/getProfileUrl";
import './castList.css';

function CastList({ cast }) {
    if (!cast || cast.length === 0) return null;

    return (
        <div className="cast-container">
            <h2>Elenco principal</h2>
            <div className="cast-scroll">
                {cast.slice(0, 15).map(actor => (
                    <div key={actor.id} className="cast-card">
                        <img
                            src={getProfileUrl(actor.profile_path)}
                            alt={actor.name}
                            className="cast-image"
                            loading="lazy"
                        />
                        <div className="cast-info">
                            <p className="cast-name">{actor.name}</p>
                            <p className="cast-character">{actor.character}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CastList;
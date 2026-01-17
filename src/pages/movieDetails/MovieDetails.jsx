import { useParams } from "react-router-dom";
import { moviesMock } from "../../data/moviesMock";
import './movieDetails.css';

function MovieDetails() {
    const {id} = useParams();

    const movie = moviesMock.find(m => m.id === Number(id));

    if (!movie) {
        return <p>Ops! Filme não encontrado.</p>
    }
    return (
        <section className="movie-details">
            <img src={movie.poster} alt={movie.title} />

            <div className="movie-info">
                <h1>{movie.title}</h1>
                <p><strong>Nota: </strong>{movie.rating}</p>
                <p><strong>Descrição: </strong></p>
            </div>
        </section>
    );
}

export default MovieDetails;
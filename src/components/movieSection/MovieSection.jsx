import './movieSection.css';

function MovieSection({ title, movies }) {
    return (
        <section className='movie-section'>
            <h2 className='section-title'>{title}</h2>

            <div className='movie-grid'>
                {movies.map(movie => (
                    <div key={movie.id}>
                        {movie.component}
                    </div>
                ))}
            </div>
        </section>
    );
}

export default MovieSection;
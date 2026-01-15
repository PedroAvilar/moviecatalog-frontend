// Página inicial do catálogo de filmes
import Banner from '../components/banner/Banner';
import MovieCard from '../components/moviecard/MovieCard';
import { moviesMock } from '../data/moviesMock';

function Home() {
    return (
        <div>
            <Banner />

            <section className='movie-section'>
                <h2>Melhores avaliados</h2>

                {/* Renderização dos cartões de filmes */}
                {moviesMock.map((movie => (
                    <MovieCard 
                        key={movie.id}
                        title={movie.title}
                        poster={movie.poster}
                        rating={movie.rating}
                    />
                )))}
            </section>
        </div>
    )
}

export default Home;
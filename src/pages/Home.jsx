// Página inicial do catálogo de filmes
import Banner from '../components/banner/Banner';
import MovieCard from '../components/moviecard/MovieCard';
import MovieSection from '../components/movieSection/MovieSection';
import { moviesMock } from '../data/moviesMock';

function Home() {
    const moviesWithComponent = moviesMock.map(movie => ({
        id: movie.id,
        component: (
            <MovieCard 
                title={movie.title}
                poster={movie.poster}
                rating={movie.rating}
            />
        )
    }));

    return (
        <div>
            <Banner />

            <MovieSection 
                title={'Melhores avaliados'}
                movies={moviesWithComponent}
            />
        </div>
    )
}

export default Home;
// Página inicial do catálogo de filmes
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import { moviesMock } from '../data/moviesMock';

function Home() {
    return (
        <div>
            <Banner />

            <MovieSection 
                title={'Melhores avaliados'}
                movies={moviesMock}
            />
        </div>
    )
}

export default Home;
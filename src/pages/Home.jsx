// Página inicial do catálogo de filmes
import Banner from '../components/banner/Banner';
import MovieCard from '../components/moviecard/MovieCard';

function Home() {
    return (
        <div>
            <Banner />

            <section className='movie-section'>
                <h2>Melhores</h2>
                <MovieCard 
                    title='Exemplo de filme'
                    poster='https://placehold.co/150'
                    rating='8.5'
                />
            </section>
        </div>
    )
}

export default Home;
// Página inicial do catálogo de filmes
import { useEffect, useState } from 'react';
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import { getPopularMovies, getTopRatedMovies } from '../services/tmdbService';

function Home() {
    // Estados para armazenar as listas de filmes
    const [popular, setPopular] = useState([]); // (inicia arrays vazios)
    const [topRated, setTopRated] = useState([]);
    const [bannerMovie, setBannerMovie] = useState(null);

    // Hook para executar a busca de dados assim que o componente iniciar
    useEffect(() => {
        // Busca e atualiza o estado de "Populares" e do banner
        getPopularMovies().then(data => {
            setPopular(data.results);
            setBannerMovie(data.results[0]);
        });

        // Busca e atualiza o estado de "Melhores availados"
        getTopRatedMovies().then(data => {
            setTopRated(data.results);
        })
    }, []); // Indica que o efeito roda apenas uma vez

    return (
        <div>
            <Banner movie={bannerMovie} />

            <MovieSection 
                title={'Populares'}
                movies={popular}
            />

            <MovieSection 
                title={'Melhores avaliados'}
                movies={topRated}
            />
        </div>
    )
}

export default Home;
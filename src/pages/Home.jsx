// Página inicial do catálogo de filmes
import { useEffect, useState } from 'react';
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import { getPopularMovies, getTopRatedMovies } from '../services/tmdbService';

function Home() {
    // Estados para armazenar as listas de filmes (inicia arrays vazios)
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);

    // Hook para executar a busca de dados assim que o componente iniciar
    useEffect(() => {
        // Busca e atualiza o estado de "Populares"
        getPopularMovies().then(data => {
            setPopular(data.results);
        });

        // Busca e atualiza o estado de "Melhores availados"
        getTopRatedMovies().then(data => {
            setTopRated(data.results);
        })
    }, []); // Indica que o efeito roda apenas uma vez

    return (
        <div>
            <Banner />

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
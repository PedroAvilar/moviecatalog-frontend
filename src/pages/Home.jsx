// Página inicial do catálogo de filmes
import { useEffect, useState } from 'react';
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import { getPopularMovies, getTopRatedMovies } from '../services/tmdbService';

function Home() {
    // Estados para armazenar as listas de filmes e carregamento
    const [popular, setPopular] = useState([]); // (inicia arrays vazios)
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);

    // Hook para executar a busca de dados assim que o componente iniciar
    useEffect(() => {
        async function loadData() {
            setLoading(true);

            const popularData = await getPopularMovies();
            const topRatedData = await getTopRatedMovies();

            setPopular(popularData.results);
            setTopRated(topRatedData.results);

            setLoading(false);
        }
        loadData();
    }, []);

    return (
        <div>
            <Banner movies={popular.slice(0, 5)} />

            <MovieSection 
                title={'Populares'}
                movies={popular}
                loading={loading}
            />

            <MovieSection 
                title={'Melhores avaliados'}
                movies={topRated}
                loading={loading}
            />
        </div>
    )
}

export default Home;
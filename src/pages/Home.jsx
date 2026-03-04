// Página inicial do catálogo de filmes
import { useEffect, useState } from 'react';
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import { getPopularMovies, getTopRatedMovies } from '../services/tmdbService';
import ErrorMessage from '../components/errorMessage/ErrorMessage';

function Home() {
    // Estados para armazenar as listas de filmes e status
    const [popular, setPopular] = useState([]); // (inicia arrays vazios)
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para carregar os dados
    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const popularData = await getPopularMovies();
            const topRatedData = await getTopRatedMovies();

            setPopular(popularData.results);
            setTopRated(topRatedData.results);
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false);
        }
    }

    // Hook para executar a busca de dados assim que o componente iniciar
    useEffect(() => {
        loadData();
    }, []);

    if (error) return <ErrorMessage message={error} onRetry={loadData} />

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
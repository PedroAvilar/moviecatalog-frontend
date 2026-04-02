import { useEffect, useState } from 'react';
import { getPopularMovies, getTopRatedMovies } from '../services/apiService';
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import ErrorMessage from '../components/errorMessage/ErrorMessage';

function Home() {
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    async function loadData() {
        try {
            setLoading(true);
            setError(null);

            const [popularData, topRatedData] = await Promise.all([
                getPopularMovies(),
                getTopRatedMovies()
            ]);

            setPopular(popularData);
            setTopRated(topRatedData);
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false);
        }
    }

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
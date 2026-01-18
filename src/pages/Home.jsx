// Página inicial do catálogo de filmes
import { useEffect, useState } from 'react';
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import { getPopularMovies } from '../services/tmdbService';

function Home() {
    const [popular, setPopular] = useState([]);

    useEffect(() => {
        getPopularMovies().then(data => {
            setPopular(data.results);
        });
    }, []);

    return (
        <div>
            <Banner />

            <MovieSection 
                title={'Populares'}
                movies={popular}
            />
        </div>
    )
}

export default Home;
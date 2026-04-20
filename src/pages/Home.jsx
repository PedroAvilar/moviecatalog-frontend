import { useQuery } from '@tanstack/react-query';
import { getPopularMovies, getTopRatedMovies } from '../services/apiService';
import Banner from '../components/banner/Banner';
import MovieSection from '../components/movieSection/MovieSection';
import ErrorMessage from '../components/errorMessage/ErrorMessage';

function Home() {
    const { data: popular = [], isLoading: loadingPopular, error: errorPopular, refetch: refetchPopular } = useQuery({
        queryKey: ['movies', 'popular'],
        queryFn: getPopularMovies,
        staleTime: 1000 * 60 * 30,
        networkMode: 'always',
    });

    const { data: topRated = [], isLoading: loadingTopRated, error: errorTopRated, refetch: refetchTopRated } = useQuery({
        queryKey: ['movies', 'top-rated'],
        queryFn: getTopRatedMovies,
        staleTime: 1000 * 60 * 60,
        networkMode: 'always',
    });

    const isLoading = loadingPopular || loadingTopRated;
    const error = errorPopular || errorTopRated;
    const handleRetry = () => {
        refetchPopular();
        refetchTopRated();
    };

    if (error) return <ErrorMessage message={error} onRetry={handleRetry} />;

    const bannerMovies = Array.isArray(popular) ? popular.slice(0, 5) : [];

    return (
        <div>
            <Banner movies={bannerMovies} />

            <MovieSection 
                title={'Populares'}
                movies={popular}
                loading={isLoading}
            />

            <MovieSection 
                title={'Melhores avaliados'}
                movies={topRated}
                loading={isLoading}
            />
        </div>
    )
}

export default Home;
import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getMoviesByGenre } from '../services/apiService';
import MovieSection from "../components/movieSection/MovieSection";
import ErrorMessage from "../components/errorMessage/ErrorMessage";

function Categories() {
    const { genreId, genreName } = useParams();

    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const observerRef = useRef(null);

    const location = useLocation();
    const displayTitle = location.state?.genreRealName ||
        genreName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    async function fetchMovies() {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getMoviesByGenre(genreId, page);

            if (!data.results || data.results.length === 0 || data.page >= data.total_pages) {
                setHasMore(false);
            } else {
                setMovies(prev => {
                    const ids = new Set(prev.map(m => m.id));
                    const newMovies = data.results.filter(m => !ids.has(m.id));
                    return [...prev, ...newMovies];
                });
            }
        } catch (e) {
            setError(e.message)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [genreId]);

    useEffect(() => {
        fetchMovies();
    }, [page, genreId]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading && !error) {
                setPage(prev => prev + 1);
            }
        });
        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading, error]);

    if (error && page === 1) return <ErrorMessage message={error} onRetry={fetchMovies} />

    return (
        <section>
            <MovieSection 
                title={displayTitle}
                movies={movies}
                loading={loading}
            />

            {error && page > 1 && (
                <ErrorMessage
                    message={error}
                    onRetry={fetchMovies}
                    variant="compact"
                />
            )}

            {!error && hasMore && (
                <div ref={observerRef} style={{ height: '1px' }}/>
            )}
        </section>
    )
}

export default Categories;
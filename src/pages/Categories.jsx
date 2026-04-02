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
    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const errorRef = useRef(null);

    const updateLoading = (val) => { setLoading(val); loadingRef.current = val; };
    const updateHasMore = (val) => { setHasMore(val); hasMoreRef.current = val; };
    const updateError = (val) => { setError(val); errorRef.current = val; };

    const location = useLocation();
    const displayTitle = location.state?.genreRealName ||
        genreName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    async function fetchMovies() {
        if (loadingRef.current || !hasMoreRef.current) return;

        try {
            updateLoading(true);
            updateError(null);
            
            const data = await getMoviesByGenre(genreId, page);

            if (!data?.length || data.page >= data.total_pages) {
                updateHasMore(false);
            } else {
                setMovies(prev => {
                    const ids = new Set(prev.map(m => m.id));
                    const newMovies = data.filter(m => !ids.has(m.id));
                    return [...prev, ...newMovies];
                });
            }
        } catch (e) {
            updateError(e.message)
        } finally {
            updateLoading(false);
        }
    }

    useEffect(() => {
        setMovies([]);
        setPage(1);
        updateHasMore(true);
        updateError(null);
    }, [genreId]);

    useEffect(() => {
        fetchMovies();
    }, [page, genreId]);

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMoreRef.current && !loadingRef.current && !errorRef.current) {
                setPage(prev => prev + 1);
            }
        }, { threshold: 0.1 });

        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, []);

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
                <div ref={observerRef} style={{ height: '20px', margin: '20px 0' }}/>
            )}
        </section>
    )
}

export default Categories;
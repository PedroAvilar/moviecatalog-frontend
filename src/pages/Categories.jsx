import { useEffect, useRef, useState, useCallback } from "react";
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
    const [isIntersection, setIsIntersecting] = useState(false);

    const loadingRef = useRef(false);
    const hasMoreRef = useRef(true);
    const errorRef = useRef(null);
    const activeRequestRef = useRef(Date.now());

    const updateLoading = (val) => { setLoading(val); loadingRef.current = val; };
    const updateHasMore = (val) => { setHasMore(val); hasMoreRef.current = val; };
    const updateError = (val) => { setError(val); errorRef.current = val; };

    const location = useLocation();
    const displayTitle = location.state?.genreRealName ||
        genreName.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    async function fetchMovies() {
        if (loadingRef.current || !hasMoreRef.current) return;

        const currentReqId = Date.now();
        activeRequestRef.current = currentReqId;

        try {
            updateLoading(true);
            updateError(null);

            const data = await getMoviesByGenre(genreId, page);

            if (activeRequestRef.current !== currentReqId) return;

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
            if (activeRequestRef.current !== currentReqId) return;
            updateError(e.message)
        } finally {
            if (activeRequestRef.current === currentReqId) {
                updateLoading(false);
            }
        }
    }

    useEffect(() => {
        setMovies([]);
        setPage(1);
        updateHasMore(true);
        updateError(null);
        updateLoading(false);
        activeRequestRef.current = Date.now();
    }, [genreId]);

    useEffect(() => {
        fetchMovies();
    }, [page, genreId]);

    const observerInstanceRef = useRef(null);
    const observerCallbackRef = useCallback((node) => {
        if (!observerInstanceRef.current) {
            observerInstanceRef.current = new IntersectionObserver(([entry]) => {
                setIsIntersecting(entry.isIntersecting);
            }, { threshold: 0.1 });
        }

        observerInstanceRef.current.disconnect();

        if (node) {
            observerInstanceRef.current.observe(node);
        }
    }, []);

    useEffect(() => {
        return () => {
            if (observerInstanceRef.current) observerInstanceRef.current.disconnect();
        }
    }, []);

    useEffect(() => {
        if (isIntersection && hasMore && !loading && !error) {
            setPage(prev => prev + 1);
        }
    }, [isIntersection, loading, hasMore, error]);

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
                <div ref={observerCallbackRef} style={{ height: '20px', margin: '20px 0' }} />
            )}
        </section>
    )
}

export default Categories;
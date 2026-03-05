// Página de categorias do catálogo de filmes
import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getMoviesByGenre } from '../services/tmdbService'
import MovieSection from "../components/movieSection/MovieSection";
import ErrorMessage from "../components/errorMessage/ErrorMessage";

function Categories() {
    const { genreId, genreName } = useParams(); // Obtém o ID e nome da categoria da URL
    const location = useLocation(); // Hook para acesso ao state enviado

    // Definir o título, tentando pegar o enviado pelo Header, se não tiver, formata o slug da URL
    const displayTitle = location.state?.genreRealName ||
        genreName.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

    // Estados para dados, controle de página e carregamento
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    const observerRef = useRef(null); // Referência para o elemento no final da página

    // Função para carregar os dados
    async function fetchMovies() {
        if (loading || !hasMore) return;

        try {
            setLoading(true);
            setError(null);
            const data = await getMoviesByGenre(genreId, page);

            if (data.results.length === 0) {
                setHasMore(false);
            } else {
                // Evita duplicatas ao adicionar novos filmes ao estado
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

    // Efeito para resetar quando mudar de categoria
    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
        setError(null);
    }, [genreId]);

    // Efeito para buscar filmes sempre que a página ou categoria mudar
    useEffect(() => {
        fetchMovies();
    }, [page, genreId]);

    // Efeito para configurar o IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading && !error) {
                setPage(prev => prev + 1);
            }
        });
        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading, error]);

    // Componente de erro caso não tenha filmes carregados
    if (error && page === 1) return <ErrorMessage message={error} onRetry={fetchMovies} />

    return (
        <div>
            <MovieSection 
                title={displayTitle}
                movies={movies}
                loading={loading}
            />

            {/* Componente de erro caso já tenha filmes carregados */}
            {error && page > 1 && (
                <ErrorMessage
                    message='Não foi possível carregar mais filmes.'
                    onRetry={fetchMovies}
                />
            )}

            {/* Renderiza apenas se não ocorrer erro e com hasMore */}
            {!error && hasMore && (
                // Quando visível, o observer detecta e carrega mais
                <div ref={observerRef} style={{ height: '1px' }}/>
            )}
        </div>
    )
}

export default Categories;
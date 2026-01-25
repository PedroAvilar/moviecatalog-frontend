// Página de categorias do catálogo de filmes
import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getMoviesByGenre } from '../services/tmdbService'
import MovieSection from "../components/movieSection/MovieSection";

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

    const observerRef = useRef(null); // Referência para o elemento no final da página

    // Efeito para resetar quando mudar de categoria
    useEffect(() => {
        setMovies([]);
        setPage(1);
        setHasMore(true);
    }, [genreId]);

    // Efeito para buscar filmes sempre que a página ou categoria mudar
    useEffect(() => {
        async function fetchMovies() {
            if (loading || !hasMore) return;

            setLoading(true);
            const data = await getMoviesByGenre(genreId, page);

            if (data.results.length === 0) {
                setHasMore(false);
            } else {
                setMovies(prev => [...prev, ...data.results]); // Concatena os filmes
            }
            setLoading(false);
        }
        fetchMovies();
    }, [page, genreId]);

    // Efeito para configurar o IntersectionObserver
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore && !loading) {
                setPage(prev => prev + 1);
            }
        });
        if (observerRef.current) observer.observe(observerRef.current);

        return () => observer.disconnect();
    }, [hasMore, loading]);

    return (
        <div>
            <MovieSection 
                title={displayTitle}
                movies={movies}
            />

            {loading && <p>Carregando mais filmes...</p>}

            {/* Quando visível, o observer detecta e carrega mais */}
            <div ref={observerRef} style={{ height: '1px' }}/>
        </div>
    )
}

export default Categories;
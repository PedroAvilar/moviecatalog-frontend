import './banner.css';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { slugify } from '../../utils/slugify';

function Banner({ movies }) {
    const navigate = useNavigate(); // Hook para navegação programática
    const [currentIndex, setCurrentIndex] = useState(0); // Estado que controla qual filme está sendo exibido

    useEffect(() => {
        if (!movies || movies.length === 0) return; // Caso sem filmes, sem temporizador

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % movies.length);
        }, 8000); // Troca o índice a cada 8 segundos

        return () => clearInterval(interval); // Função de limpeza
    }, [movies, currentIndex]); // Reinicia caso a lista ou índice mude

    if (!movies || movies.length === 0) return null; // Caso vazia ou nula, não renderiza
    
    const movie = movies[currentIndex]; // Seleciona o filme com base no índice do estado
    const titleSlug = slugify(movie.title); // Gera slug do título do filme

    return (
        <section 
            className='banner'
            // Define a imagem de fundo dinamicamente usando o backdrop (imagem horizontal) da API
            style={{backgroundImage: `url(https://image.tmdb.org/t/p/w1280${movie.backdrop_path})`}}
        >
            <div 
                className='banner-overlay'
                onClick={() => navigate(`/filme/${movie.id}/${titleSlug}`)} // Navega para detalhes do filme
            
            >
                <div className='banner-content'>
                    <h2>{movie.title}</h2>
                    <p>
                        {movie.overview
                            // Limita o conteúdo da descrição exibida
                            ? movie.overview.length > 160
                                ? movie.overview.slice(0, 160) + '...'
                                : movie.overview
                            : 'Sem descrição disponível.'}
                    </p>
                </div>

                {/* Dots para navegação do usuário */}
                <div className='banner-dots'>
                    {movies.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setCurrentIndex(index);
                            }}
                        />
                    ))}

                </div>
            </div>
        </section>
    );
}

export default Banner;
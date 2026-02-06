import './banner.css';
import '../../styles/transitions.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { slugify } from '../../utils/slugify';
import { getBackdropUrl } from '../../utils/getBackDrop';
import BannerSkeleton from './BannerSkeleton';

function Banner({ movies }) {
    const navigate = useNavigate(); // Hook para navegação programática
    // Estados para controles
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const intervalRef = useRef(null);

    // Função central que troca o banner
    function changeBanner(index) {
        if (!movies || movies.length === 0) return;

        setImageLoaded(false);

        const newIndex = (index + movies.length) % movies.length;
        setCurrentIndex(newIndex);
        startAutoSlide();
    }

    // Função para autoplay
    function startAutoSlide() {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            changeBanner(currentIndex + 1);
        }, 8000)
    }

    // Handlers para suporte a touch (mobile)
    function handleTouchStart(e) {setTouchStartX(e.touches[0].clientX);}
    function handleTouchMove(e) {setTouchEndX(e.touches[0].clientX);}

    function handleTouchEnd() {
        if (!touchStartX || !touchEndX) return;

        const distance = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            changeBanner(currentIndex + 1); // Próximo
        } else if (distance < -minSwipeDistance) {
            changeBanner(currentIndex - 1); //Anterior
        }

        setTouchStartX(null);
        setTouchEndX(null);
    }

    useEffect(() => {
        if (!movies || movies.length === 0) return; // Caso sem filmes

        startAutoSlide();

        return () => clearInterval(intervalRef.current); // Função de limpeza
    }, [movies, currentIndex]); // Reinicia caso a lista ou índice mude

    if (!movies || movies.length === 0) return <BannerSkeleton />; // Caso vazia ou nula chama o BannerSkeleton
    
    const movie = movies[currentIndex]; // Seleciona o filme com base no índice do estado
    const titleSlug = slugify(movie.title); // Gera slug do título do filme

    return (
        <section 
            className='banner'
            key={movie.id}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className={`banner-image fade fade-slow ${imageLoaded ? 'show' : ''}`}
                // Define a imagem de fundo dinamicamente com função em utils
                style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`}}
            />
            {/* Garante que a imagem baixou para então liberar o fade */}
            <img
                src={getBackdropUrl(movie.backdrop_path)}
                alt=""
                style={{ display: 'none' }}
                onLoad={() => setImageLoaded(true)}
            />
        
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
                                changeBanner(index);
                            }}
                        />
                    ))}

                </div>
            </div>
        </section>
    );
}

export default Banner;
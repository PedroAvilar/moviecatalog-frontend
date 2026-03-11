import './banner.css';
import '../../styles/transitions.css'
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { slugify } from '../../utils/slugify';
import { getBackdropUrl } from '../../utils/getBackDrop';
import BannerSkeleton from './BannerSkeleton';

function Banner({ movies }) {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const intervalRef = useRef(null);

    function changeBanner(index) {
        if (!movies || movies.length === 0) return;

        setImageLoaded(false);

        const newIndex = (index + movies.length) % movies.length;
        setCurrentIndex(newIndex);
        startAutoSlide();
    }

    function startAutoSlide() {
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            changeBanner(currentIndex + 1);
        }, 8000)
    }

    function handleTouchStart(e) {setTouchStartX(e.touches[0].clientX);}
    function handleTouchMove(e) {setTouchEndX(e.touches[0].clientX);}

    function handleTouchEnd() {
        if (!touchStartX || !touchEndX) return;

        const distance = touchStartX - touchEndX;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            changeBanner(currentIndex + 1);
        } else if (distance < -minSwipeDistance) {
            changeBanner(currentIndex - 1);
        }

        setTouchStartX(null);
        setTouchEndX(null);
    }

    useEffect(() => {
        if (!movies || movies.length === 0) return;

        startAutoSlide();

        return () => clearInterval(intervalRef.current);
    }, [movies, currentIndex]);

    if (!movies || movies.length === 0) return <BannerSkeleton />;
    
    const movie = movies[currentIndex];
    const titleSlug = slugify(movie.title);

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
                style={{ backgroundImage: `url(${getBackdropUrl(movie.backdrop_path)})`}}
            />
            <img
                src={getBackdropUrl(movie.backdrop_path)}
                alt=""
                style={{ display: 'none' }}
                onLoad={() => setImageLoaded(true)}
            />
        
            <div 
                className='banner-overlay'
                onClick={() => navigate(`/filme/${movie.id}/${titleSlug}`)}
            
            >
                <div className='banner-content'>
                    <h2>{movie.title}</h2>
                    <p>
                        {movie.overview
                            ? movie.overview.length > 160
                                ? movie.overview.slice(0, 160) + '...'
                                : movie.overview
                            : 'Sem descrição disponível.'}
                    </p>
                </div>

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
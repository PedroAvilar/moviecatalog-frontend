import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { slugify } from '../../utils/slugify';
import { getBackdropUrl } from '../../utils/getBackDrop';
import BannerSkeleton from './BannerSkeleton';
import './banner.css';
import '../../styles/transitions.css';
import '../../styles/skeleton.css';

function Banner({ movies }) {
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState(null);
    const [touchEndX, setTouchEndX] = useState(null);
    const [imageLoaded, setImageLoaded] = useState(false);

    const intervalRef = useRef(null);

    function changeBanner(index) {
        if (!movies?.length) return;

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
        if (!movies?.length) return;

        startAutoSlide();

        return () => clearInterval(intervalRef.current);
    }, [movies, currentIndex]);

    if (!movies?.length) return <BannerSkeleton />;
    
    const movie = movies[currentIndex];
    const backdropUrl = getBackdropUrl(movie.backdrop_path, 'original');

    return (
        <section 
            className='banner'
            key={movie.id}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className={`banner-image fade fade-slow ${imageLoaded ? 'show' : 'skeleton-base'}`}
                style={imageLoaded ? { backgroundImage: `url(${backdropUrl})`} : {}}
            />
            <img
                src={backdropUrl}
                alt=""
                style={{ display: 'none' }}
                onLoad={() => setImageLoaded(true)}
            />
        
            <div 
                className='banner-overlay'
                onClick={() => navigate(`/filme/${movie.id}/${slugify(movie.title)}`)}
            >
                <div className='banner-content'>
                    <h2>{movie.title}</h2>
                    <p>
                        {movie.overview?.length > 160 ? movie.overview.slice(0, 160) + '...' : movie.overview || 'Sem descrição.'}
                    </p>
                </div>

                <div className='banner-dots'>
                    {movies.map((_, index) => (
                        <span
                            key={index}
                            className={`dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (index !== currentIndex) {
                                    changeBanner(index);
                                }
                            }}
                        />
                    ))}

                </div>
            </div>
        </section>
    );
}

export default Banner;
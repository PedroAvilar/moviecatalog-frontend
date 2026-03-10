import { useState } from 'react';
import MovieSection from '../../components/movieSection/MovieSection';
import './favorites.css';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import { useFavorites } from '../../context/FavoritesContext';

function Favorites() {
    const { favorites } = useFavorites();
    const [visibleCount, setVisibleCount] = useState(18);
    const navigate = useNavigate();

    const displayFavorites = [...favorites].reverse();

    if (favorites.length == 0) {
        return (
            <div className='no-favorites'>
                <div className='no-favorites-content'>
                    <span className='no-favorites-icon'>💔</span>
                    <h2>Nenhum filme adicionado</h2>
                    <p>Adicione filmes aos favoritos para aparecerem aqui.</p>

                    <Button
                        onClick={() => navigate('/')}
                        variant='primary'
                    >
                        Explorar filmes
                    </Button>
                </div>
            </div>
        )
    }

    const visibleFavorites = displayFavorites.slice(0, visibleCount);

    return(
        <>
            <MovieSection
                title={'Favoritos'}
                movies={visibleFavorites}
            />

            {visibleCount < favorites.length && (
                <div className='favorite-more'>
                    <Button
                        onClick={() => setVisibleCount(prev => prev + 18)}
                        variant='secondary'
                    >
                        Ver mais
                    </Button>
                </div>
            )}
        </>
    )
}

export default Favorites;
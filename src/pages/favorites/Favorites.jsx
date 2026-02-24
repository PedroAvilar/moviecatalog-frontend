// Página de favoritos do catálogo de filmes
import { useEffect, useState } from 'react';
import { getFavorites } from '../../services/favoritesService';
import MovieSection from '../../components/movieSection/MovieSection';
import './favorites.css';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [visibleCount, setVisibleCount] = useState(25);
    const navigate = useNavigate();

    useEffect(() => {
        setFavorites(getFavorites().reverse());
    }, []);

    // Sem filmes favoritados
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

    const visibleFavorites = favorites.slice(0, visibleCount);

    return(
        <>
            <MovieSection
                title={'Filmes favoritos'}
                movies={visibleFavorites}
            />

            {visibleCount < favorites.length && (
                <div className='favorite-more'>
                    <Button
                        onClick={() => setVisibleCount(prev => prev + 10)}
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
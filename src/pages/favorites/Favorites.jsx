// Página de favoritos do catálogo de filmes
import { useEffect, useState } from 'react';
import MovieSection from '../../components/movieSection/MovieSection';
import './favorites.css';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import { useFavorites } from '../../context/FavoritesContext';

// Componente para exibir a lista de filmes favoritos
function Favorites() {
    const { favorites } = useFavorites(); //Obtém lista do contexto
    const [visibleCount, setVisibleCount] = useState(25); // Quantidade exibida
    const navigate = useNavigate();

    const displayFavorites = [...favorites].reverse(); // Exibe os mais recentes primeiro

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

    const visibleFavorites = displayFavorites.slice(0, visibleCount);

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
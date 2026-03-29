import { useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext';
import MovieSection from '../../components/movieSection/MovieSection';
import Button from '../../components/button/Button';
import EmptyState from '../../components/emptyState/EmptyState';
import './favorites.css';

function Favorites() {
    const { favorites } = useFavorites();
    const [visibleCount, setVisibleCount] = useState(18);

    const displayFavorites = [...favorites].reverse();

    if (favorites.length == 0) {
        return (
            <EmptyState 
                icon='💔'
                title='Nenhum filme adicionado'
                description='Adicione filmes aos favoritos para aparecerem aqui.'
                actionText='Explorar filmes'
            />
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
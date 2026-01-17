// Página de favoritos do catálogo de filmes
import { useEffect, useState } from 'react';
import { getFavorites } from '../../services/favoritesService';
import MovieSection from '../../components/movieSection/MovieSection';
import './favorites.css'

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    // Verifica se possui filmes favoritados
    if (favorites.length == 0) {
        return (
            <div className='no-favorites'>
                <p>Você não adicionou filmes aos favoritos.</p>
            </div>
        )
    } else {
        return (
            <MovieSection 
                title={'Filmes favoritos'}
                movies={favorites}
            />
        )
    }
}

export default Favorites;
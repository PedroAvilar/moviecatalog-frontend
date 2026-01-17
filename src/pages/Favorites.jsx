// Página de favoritos do catálogo de filmes
import { useEffect, useState } from 'react';
import { getFavorites, removeFavorite } from '../services/favoritesService';
import MovieSection from '../components/movieSection/MovieSection';

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    if (favorites.length == 0) {
        return <p>Você não adicionou filmes aos favoritos.</p>
    }

    return (
        <MovieSection 
            title={'Filmes favoritos'}
            movies={favorites}
        />
    )
}

export default Favorites;
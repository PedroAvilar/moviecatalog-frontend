// Página de favoritos do catálogo de filmes
import { useEffect, useState } from 'react';
import { getFavorites } from '../../services/favoritesService';
import MovieSection from '../../components/movieSection/MovieSection';
import './favorites.css'
import { useNavigate } from 'react-router-dom';

function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        setFavorites(getFavorites());
    }, []);

    // Verifica se possui filmes favoritados
    if (favorites.length == 0) {
        return (
            <div className='no-favorites'>
                <div className='no-favorites-content'>
                    <span className='no-favorites-icon'>💔</span>
                    <h2>Nenhum filme adicionado</h2>
                    <p>Adicione filmes aos favoritos para aparecerem aqui.</p>
                    <button onClick={() => navigate('/')}>
                        Explorar filmes
                    </button>
                </div>
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
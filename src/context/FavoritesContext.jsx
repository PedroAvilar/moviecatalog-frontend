import { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, toggleFavorite } from "../services/apiService";
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const { user } = useAuth();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadFavorites() {
            if (!user) {
                setFavorites([]);
                return;
            }
            try {
                const data = await getFavorites();
                setFavorites(data);
            } catch (err) {
                console.error("Erro ao carregar favoritos:", err);
            }
        }
        loadFavorites();
    }, [user]);

    async function handleToggleFavorite(movie) {
        if (!user) return { message: 'Faça login para favoritar' };

        try {
            const response = await toggleFavorite(movie);
            if (response.data.isFavorite) {
                setFavorites(prev => [{ ...movie, movieId: movie.id }, ...prev]);
            } else {
                setFavorites(prev => prev.filter(fav => (fav.movieId || fav.id) !== movie.id));
            }
            return response;
        } catch (err) {
            return err;
        }
    }

    function isFavorite(id) {
        return favorites.some(fav => (fav.movieId === id || fav.id === id));
    }

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                toggleFavorite: handleToggleFavorite,
                isFavorite,
                loading
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
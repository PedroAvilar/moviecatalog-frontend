import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
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

    const handleToggleFavorite = useCallback(async (movie) => {
        if (!user) return { message: 'Faça login para favoritar' };

        try {
            const response = await toggleFavorite(movie);
            if (response.data.isFavorite) {
                setFavorites(prev => [movie, ...prev]);
            } else {
                setFavorites(prev => prev.filter(fav => fav.id !== movie.id));
            }
            return response;
        } catch (err) {
            return err;
        }
    }, [user]);

    const isFavorite = useCallback((id) => {
        return favorites.some(fav => fav.id === id);
    }, [favorites]);

    const contextValue = useMemo(() => ({
        favorites,
        toggleFavorite: handleToggleFavorite,
        isFavorite,
        loading
    }), [favorites, handleToggleFavorite, isFavorite, loading]);

    return (
        <FavoritesContext.Provider value={contextValue}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
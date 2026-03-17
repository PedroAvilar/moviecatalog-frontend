import { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, setFavorites } from "../services/favoritesService";

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
    const [favorites, setFavoritesState] = useState([]);

    useEffect(() => {
        setFavoritesState(getFavorites());
    }, []);

    function addFavorite(movie) {
        const exists = favorites.some(fav => fav.id === movie.id);
        if (exists) return;

        const update = [...favorites, movie];
        setFavoritesState(update);
        setFavorites(update);
    }

    function removeFavorite(id) {
        const update = favorites.filter(movie => movie.id !== id);
        setFavoritesState(update);
        setFavorites(update);
    }

    function isFavorite(id) {
        return favorites.some(movie => movie.id === id);
    }

    return (
        <FavoritesContext.Provider
            value={{
                favorites,
                addFavorite,
                removeFavorite,
                isFavorite
            }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    return useContext(FavoritesContext);
}
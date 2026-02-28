import { createContext, useContext, useEffect, useState } from "react";
import { getFavorites, setFavorites } from "../services/favoritesService";

const FavoritesContext = createContext();

// Provedor para gerenciar a lista de filmes favoritos e disponibilizar para os componentes filhos
export function FavoritesProvider({ children }) {
    const [favorites, setFavoritesState] = useState([]);

    // Carrega a lista de favoritos ao montar o componente
    useEffect(() => {
        setFavoritesState(getFavorites());
    }, []);

    // Adiciona um filme à lista de favoritos
    function addFavorite(movie) {
        const exists = favorites.some(fav => fav.id === movie.id);
        if (exists) return; // Evita duplicatas

        const update = [...favorites, movie];
        setFavoritesState(update);
        setFavorites(update);
    }

    // Remove um filme da lista de favoritos
    function removeFavorite(id) {
        const update = favorites.filter(movie => movie.id !== id);
        setFavoritesState(update);
        setFavorites(update);
    }

    // Verifica se um filme está na lista de favoritos
    function isFavorite(id) {
        return favorites.some(movie => movie.id === id);
    }

    return (
        // Fornece a lista de favoritos e as funções de manipulação
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
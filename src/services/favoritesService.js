const STORAGE_KEY = 'moviecatalog:favorites';

// Retorna a lista de filmes favoritos armazenados no localStorage
export function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Adiciona um filme à lista de favoritos, caso não esteja
export function saveFavorite(movie) {
    const favorites = getFavorites();
    const exists = favorites.some(f => f.id === movie.id);

    if (!exists) {
        favorites.push(movie);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
}

// Remove um filme da lista de favoritos pelo seu ID
export function removeFavorite(id) {
    const favorites = getFavorites().filter(movie => movie.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}

// Verifica se um filme está na lista de favoritos pelo seu ID
export function isFavorite(id) {
    return getFavorites().some(movie => movie.id === id);
}
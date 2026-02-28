// Serviço para salvar e ler a lista de filmes favoritos

const STORAGE_KEY = 'moviecatalog:favorites';

// Retorna a lista de filmes favoritos armazenados no localStorage
export function getFavorites() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Armazena a lista de filmes favoritos no localStorage
export function setFavorites(favorites) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
}
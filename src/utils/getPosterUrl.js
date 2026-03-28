const TMDB_IMAGE_BASE = 'http://image.tmdb.org/t/p/';

export function getPosterUrl(path, size = 'w500') {
    if (!path) return null;

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;
    return `${TMDB_IMAGE_BASE}${size}/${cleanPath}`;
}
import noPoster from '../assets/no-poster.png';

export function getPosterUrl(posterPath, size = 'w500') {
    if (!posterPath) {
        return noPoster;
    }
    return `https://image.tmdb.org/t/p/${size}${posterPath}`;
}
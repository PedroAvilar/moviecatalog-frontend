import noBackdrop from '../assets/no-backdrop.png';

export function getBackdropUrl(backdropPath, size = 'w1280') {
	if (!backdropPath) {
		return noBackdrop;
	}

	return `https://image.tmdb.org/t/p/${size}${backdropPath}`;
}

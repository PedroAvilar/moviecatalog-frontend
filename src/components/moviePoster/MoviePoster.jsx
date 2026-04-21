import { useState } from 'react';
import { getPosterUrl } from '../../utils/getPosterUrl';
import noPoster from '../../assets/no-poster.png';
import './moviePoster.css';
import '../../styles/skeleton.css';
import '../../styles/transitions.css';

function MoviePoster({ path, alt, size = 'w500', className = '', onClick }) {
	const [isLoaded, setIsLoaded] = useState(false);
	const imageUrl = getPosterUrl(path, size);

	return (
		<div
			className={`movie-poster-container ${!isLoaded ? 'skeleton-base' : ''} ${className}`}
			onClick={onClick}
		>
			<img
				src={imageUrl || noPoster}
				alt={alt}
				className={`movie-poster-img fade ${isLoaded ? 'show' : ''}`}
				onLoad={() => setIsLoaded(true)}
				loading="lazy"
			/>
		</div>
	);
}

export default MoviePoster;

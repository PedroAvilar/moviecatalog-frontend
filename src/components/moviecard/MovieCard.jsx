import { useNavigate } from 'react-router-dom';
import { slugify } from '../../utils/slugify';
import FavoriteButton from '../favoriteButton/FavoriteButton';
import MoviePoster from '../moviePoster/MoviePoster';
import './movieCard.css';

function MovieCard({ id, title, poster_path, vote_average }) {
	const navigate = useNavigate();
	const titleSlug = slugify(title);

	return (
		<article
			className="movie-card"
			onClick={() => navigate(`/filme/${id}/${encodeURIComponent(titleSlug)}`)}
		>
			<div className="movie-card-poster-favorite">
				<MoviePoster
					path={poster_path}
					alt={title}
					size="w342"
					className="poster-sm"
				/>
				<FavoriteButton
					movie={{ id, title, poster_path, vote_average }}
					size={35}
					variant="floating"
				/>
			</div>
			<h4>{title}</h4>
			{vote_average > 0 && <span>⭐ {Number(vote_average).toFixed(1)}</span>}
		</article>
	);
}

export default MovieCard;

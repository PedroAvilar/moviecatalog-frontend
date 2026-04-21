import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getMoviesByGenre } from '../../services/apiService';
import { useInView } from 'react-intersection-observer';
import { useInfiniteQuery } from '@tanstack/react-query';
import MovieSection from '../../components/movieSection/MovieSection';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';

function Categories() {
	const { genreId, genreName } = useParams();
	const location = useLocation();

	const displayTitle =
		location.state?.genreRealName ||
		genreName
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');

	const { ref: loadMoreRef, inView } = useInView({ threshold: 0.1 });

	const {
		data,
		error,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isFetchNextPageError,
		status,
		refetch,
	} = useInfiniteQuery({
		queryKey: ['movies', genreId],
		queryFn: ({ pageParam = 1 }) => getMoviesByGenre(genreId, pageParam),
		getNextPageParam: (lastPage) => {
			return lastPage.page < lastPage.total_pages
				? lastPage.page + 1
				: undefined;
		},
		staleTime: 1000 * 60 * 5,
		networkMode: 'always',
	});

	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage && !isFetchNextPageError) {
			fetchNextPage();
		}
	}, [
		inView,
		hasNextPage,
		isFetchingNextPage,
		isFetchNextPageError,
		fetchNextPage,
	]);

	const rawMovies = data?.pages.flatMap((page) => page.results) || [];

	const allMovies = rawMovies.filter(
		(movie, index, self) => index === self.findIndex((m) => m.id === movie.id),
	);

	if (status === 'error' && !allMovies.length)
		return <ErrorMessage message={error.message} onRetry={refetch} />;

	return (
		<section>
			<MovieSection
				title={displayTitle}
				movies={allMovies}
				loading={status === 'pending' || isFetchingNextPage}
			/>

			{isFetchNextPageError && allMovies.length > 0 && (
				<ErrorMessage
					message={error.message}
					onRetry={fetchNextPage}
					variant="compact"
				/>
			)}

			{hasNextPage && !isFetchNextPageError && (
				<div ref={loadMoreRef} style={{ height: '20px', margin: '20px 0' }} />
			)}
		</section>
	);
}

export default Categories;

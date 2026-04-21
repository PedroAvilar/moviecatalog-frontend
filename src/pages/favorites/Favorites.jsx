import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getFavorites } from '../../services/apiService';
import ErrorMessage from '../../components/errorMessage/ErrorMessage';
import MovieSection from '../../components/movieSection/MovieSection';
import Button from '../../components/button/Button';
import EmptyState from '../../components/emptyState/EmptyState';

function Favorites() {
	const { user } = useAuth();
	const [visibleCount, setVisibleCount] = useState(18);

	const {
		data: favorites = [],
		isLoading,
		error,
		refetch,
	} = useQuery({
		queryKey: ['favorites', user?.id],
		queryFn: getFavorites,
		enabled: !!user,
		staleTime: 1000 * 60 * 5,
		networkMode: 'always',
	});

	if (error) return <ErrorMessage message={error.message} onRetry={refetch} />;

	if (!isLoading && favorites.length === 0) {
		return (
			<EmptyState
				icon="💔"
				title="Nenhum filme adicionado"
				description="Adicione filmes aos favoritos para aparecerem aqui."
				actionText="Explorar filmes"
			/>
		);
	}

	const displayFavorites = [...favorites].reverse();

	const visibleFavorites = displayFavorites.slice(0, visibleCount);

	return (
		<main>
			<MovieSection
				title={'Favoritos'}
				movies={visibleFavorites}
				loading={isLoading}
			/>

			{visibleCount < favorites.length && (
				<div
					style={{
						display: 'flex',
						justifyContent: 'center',
						margin: '2rem 0',
					}}
				>
					<Button
						onClick={() => setVisibleCount((prev) => prev + 18)}
						variant="secondary"
					>
						Ver mais
					</Button>
				</div>
			)}
		</main>
	);
}

export default Favorites;

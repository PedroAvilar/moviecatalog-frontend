import './myReviews.css';
import '../../styles/skeleton.css';

function MyReviewsSkeleton() {
	return (
		<main>
			<h2>Minhas avaliações</h2>
			<div className="reviews-grid" style={{ pointerEvents: 'none' }}>
				{Array.from({ length: 3 }).map((_, index) => (
					<article key={index} className="review-card">
						<div className="skeleton-poster skeleton-poster-md skeleton-base" />

						<div
							className="review-card-content"
							style={{ width: '100%', margin: '0 auto' }}
						>
							<div className="review-card-header">
								<div className="skeleton-text skeleton-h3 skeleton-base" />
								<div className="skeleton-text skeleton-h3 skeleton-base" />
							</div>

							<div className="skeleton-text skeleton-p skeleton-w-100 skeleton-base" />
							<div className="skeleton-text skeleton-p skeleton-w-80 skeleton-base" />

							<div
								className="review-card-date-rating skeleton-mobile-row"
								style={{ width: '100%', margin: '0 auto' }}
							>
								<div className="skeleton-text skeleton-p skeleton-w-10 skeleton-base" />
								<div className="skeleton-text skeleton-p skeleton-w-20 skeleton-base" />
							</div>

							<div className="review-card-actions">
								<div className="skeleton-btn skeleton-base" />
								<div className="skeleton-btn skeleton-base" />
							</div>
						</div>
					</article>
				))}
			</div>
		</main>
	);
}

export default MyReviewsSkeleton;

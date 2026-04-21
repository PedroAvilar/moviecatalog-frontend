import { useNavigate } from 'react-router-dom';
import Button from '../button/Button';
import './emptyState.css';

function EmptyState({
	icon = '🔍',
	title = 'Nada por aqui',
	description = 'Parece que essa lista está vazia.',
	actionText,
	onAction,
	to = '/',
}) {
	const navigate = useNavigate();

	const handleAction = () => {
		if (onAction) {
			onAction();
		} else if (to) {
			navigate(to);
		}
	};

	return (
		<main className="empty-state">
			<span className="empty-state-icon" role="img" aria-label="icon">
				{icon}
			</span>
			<h2>{title}</h2>
			<p>{description}</p>

			{actionText && (
				<Button onClick={handleAction} variant="primary">
					{actionText}
				</Button>
			)}
		</main>
	);
}

export default EmptyState;

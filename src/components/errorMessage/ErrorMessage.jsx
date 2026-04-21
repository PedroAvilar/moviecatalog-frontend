import Button from '../button/Button';
import './errorMessage.css';

function ErrorMessage({ message, onRetry, variant = 'full' }) {
	return (
		<div className={`error-wrapper ${variant === 'compact' ? 'compact' : ''}`}>
			<h2>Algo deu errado!</h2>

			<p>{message || 'Não foi possível acessar os dados.'}</p>

			{onRetry && (
				<Button onClick={onRetry} variant="primary">
					Tentar de novo
				</Button>
			)}
		</div>
	);
}

export default ErrorMessage;

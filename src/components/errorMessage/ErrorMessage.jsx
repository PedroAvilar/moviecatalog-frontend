import './errorMessage.css';
import Button from '../button/Button';

function ErrorMessage({ message, onRetry }) {
    return (
        <div className='error-wrapper'>

            <h2>Algo deu errado!</h2>

            <p>{message || 'Não foi possível acessar os dados.'}</p>

            {onRetry && (
                <Button 
                    onClick={onRetry}
                    variant='primary'
                >
                    Tentar de novo
                </Button>
            )}
        </div>
    );
}

export default ErrorMessage;
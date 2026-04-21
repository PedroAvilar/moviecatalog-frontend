import './button.css';

export default function Button({
	children,
	variant = 'primary',
	onClick,
	type = 'button',
	disabled = false,
	loading = false,
}) {
	return (
		<button
			type={type}
			onClick={onClick}
			className={`btn btn-${variant}`}
			disabled={disabled || loading}
		>
			{loading ? 'Aguarde...' : children}
		</button>
	);
}

import './button.css';

export default function Button({
    children,
    variant = 'primary',
    onClick,
    type = 'button',
    disabled = false,
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`btn btn-${variant}`}
            disabled={disabled}
        >
            {children}
        </button>
    )
}
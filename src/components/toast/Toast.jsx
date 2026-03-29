import { useEffect, useState } from "react";
import './toast.css';

function Toast({ message, type, onClose, duration = 3500 }) {
    const [isHiding, setIsHiding] = useState(false);

    useEffect(() => {
        const hideTimer = setTimeout(() => {
            setIsHiding(true);
        }, duration);

        const removeTimer = setTimeout(onClose, duration + 300);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(removeTimer);
        }
    }, [onClose, duration]);

    return (
        <div className={`toast-container ${type} ${isHiding ? 'hide' : ''}`}
            onClick={() => {
                setIsHiding(true);
                setTimeout(onClose, 300);
            }}
        >
            <div className="toast-content">
                <span className="toast-icon">
                    {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <p>{message}</p>
                <button className="toast-close-btn">&times;</button>
            </div>
            {!isHiding && (
                <div className="toast-progress" style={{ animationDuration: `${duration}ms`}}></div>
            )}
        </div>
    );
}

export default Toast;
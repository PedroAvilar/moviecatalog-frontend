import { useEffect } from "react";
import './toast.css';

function Toast({ message, type, onClose, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    return (
        <div className={`toast-container ${type}`} onClick={onClose}>
            <div className="toast-content">
                <span className="toast-icon">
                    {type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
                </span>
                <p>{message}</p>
                <button className="toast-close-btn">&times;</button>
            </div>
            <div className="toast-progress" style={{ animationDuration: `${duration}ms`}}></div>
        </div>
    );
}

export default Toast;
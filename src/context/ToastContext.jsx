import { createContext, useState, useCallback, useContext } from 'react';
import Toast from "../components/toast/Toast";

const ToastContext = createContext({});

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((data, fallbackType = 'info') => {
        const id = Date.now();

        const message = typeof data === 'string' ? data : data.message

        const type = typeof data === 'string' ? fallbackType : data.type || fallbackType;

        setToasts((prev) => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="toast-wrapper">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
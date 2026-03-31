import { createContext, useState, useCallback, useContext, useMemo } from 'react';
import Toast from "../components/toast/Toast";

const ToastContext = createContext({});

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((data, fallbackType = 'info') => {
        const message = typeof data === 'string' ? data : data.message;
        const type = typeof data === 'string' ? fallbackType : data.type || fallbackType;

        setToasts((prev) => {
            if (prev.length > 0 && prev[prev.length -1].message === message) {
                return prev;
            }

            const newToast = [...prev, { id: Date.now(), message, type }];
            if (newToast.length > 3) {
                return newToast.slice(1);
            }
            return newToast;
        });
    }, []);

    const removeToast = useCallback((id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const contextValue = useMemo(() => ({ showToast }), [showToast]);

    return (
        <ToastContext.Provider value={contextValue}>
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
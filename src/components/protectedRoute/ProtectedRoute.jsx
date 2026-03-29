import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useEffect } from "react";

export function ProtectedRoute({ children }) {
    const { signed, loading } = useAuth();
    const { showToast } = useToast();

    useEffect(() => {
        if (!loading && !signed) {
            showToast({ message: 'Faça login para acessar a página'})
        }
    }, [loading, signed, showToast]);

    if (loading) return null;

    if (!signed) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
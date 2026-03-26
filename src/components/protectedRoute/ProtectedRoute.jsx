import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function ProtectedRoute({ children }) {
    const { signed, loading } = useAuth();

    if (loading) return null;

    if (!signed) {
        return <Navigate to="/login" replace />;
    }

    return children;
}
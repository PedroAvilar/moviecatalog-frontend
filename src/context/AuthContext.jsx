import { createContext, useState, useEffect, useContext, useMemo, useCallback } from "react";
import { getMe, login as loginApi, logout as logoutApi } from '../services/apiService';
import { useToast } from "./ToastContext";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const { showToast } = useToast();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const response = await getMe();
                setUser(response.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const login = useCallback(async (email, password) => {
        const response = await loginApi(email, password);
        setUser(response.user);
        return response;
    }, []);

    const updateUser = useCallback((userData) => {
        setUser(prev => ({
            ...prev,
            ...userData
        }));
    }, []);

    const logout = useCallback(async () => {
        try {
            const response = await logoutApi();
            showToast(response);
        } finally {
            setUser(null);
        }
    }, [showToast]);

    const signed = useMemo(() => Boolean(user), [user]);

    const contextValue = useMemo(() => ({
        user,
        signed,
        loading,
        login,
        updateUser,
        logout
    }), [user, signed, loading, login, updateUser, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
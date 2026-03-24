import { createContext, useState, useEffect, useContext } from "react";
import { getMe, login as loginApi, logout as logoutApi } from '../services/apiService';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUser() {
            try {
                const data = await getMe();
                setUser(data);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const login = async (email, password) => {
        const data = await loginApi(email, password);
        setUser(data.user);
        return data;
    };

    const logout = async () => {
        try {
            await logoutApi();
        } finally {
            setUser(null);
        }
    };

    const signed = Boolean(user);

    return (
        <AuthContext.Provider value={{
            user,
            signed,
            loading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
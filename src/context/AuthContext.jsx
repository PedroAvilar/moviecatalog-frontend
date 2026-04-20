import { createContext, useContext, useMemo, useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, login as loginApi, logout as logoutApi } from '../services/apiService';
import { useToast } from "./ToastContext";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const { showToast } = useToast();
    const queryClient = useQueryClient();

    const { data, isLoading } = useQuery({
        queryKey: ['me'],
        queryFn: getMe,
        retry: false,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 60,
    });

    const user = data?.user || null;

    const login = useCallback(async (email, password) => {
        const response = await loginApi(email, password);
        queryClient.setQueryData(['me'], response);
        queryClient.invalidateQueries();
        return response;
    }, [queryClient]);

    const updateUser = useCallback((userData) => {
        queryClient.setQueryData(['me'], (old) => ({
            ...old,
            user: {
                ...(old?.user || {}),
                ...userData
            }
        }));
    }, [queryClient]);

    const logout = useCallback(async () => {
        try {
            const response = await logoutApi();
            showToast(response);
        } finally {
            queryClient.setQueryData(['me'], null);
            queryClient.clear();
        }
    }, [showToast, queryClient]);

    const signed = useMemo(() => Boolean(user), [user]);

    const contextValue = useMemo(() => ({
        user,
        signed,
        loading: isLoading,
        login,
        updateUser,
        logout
    }), [user, signed, isLoading, login, updateUser, logout]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
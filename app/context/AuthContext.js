"use client";

import React from 'react';
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";



export function AuthProvider({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}

export function useAuth() {
    const { data: session, status, update } = useSession();

    // Memoize user object to prevent infinite loops
    const user = React.useMemo(() => {
        return session?.user ? {
            ...session.user,
            name: session.user.name || session.user.email
        } : null;
    }, [session]);

    const updateUserData = React.useCallback(async (data) => {
        try {
            const res = await fetch('/api/user/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!res.ok) throw new Error('Falha ao atualizar dados');

            // Force session update
            await update(data);
            return true;
        } catch (error) {
            console.error("Update Error:", error);
            return false;
        }
    }, [update]);

    const contextValue = React.useMemo(() => ({
        user,
        loading: status === "loading",
        login: async (credentials) => {
            const result = await signIn('credentials', {
                redirect: false,
                ...credentials
            });
            if (result?.error) {
                throw new Error(result.error);
            }
            return result;
        },
        logout: () => signOut({ callbackUrl: '/' }),
        isAuthenticated: status === "authenticated",
        updateUserData
    }), [user, status, update]);

    return contextValue;
}



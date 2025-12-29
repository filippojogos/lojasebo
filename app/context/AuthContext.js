"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user from localStorage on mount (client-side only) to avoid hydration mismatch
        const storedUser = localStorage.getItem('sebo_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from local storage", e);
                localStorage.removeItem('sebo_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Merge with default structure if missing
        const fullProfile = {
            addresses: [],
            cards: [],
            ...userData
        };
        setUser(fullProfile);
        localStorage.setItem('sebo_user', JSON.stringify(fullProfile));
    };

    const updateUserData = (updatedFields) => {
        setUser(prev => {
            const newUser = { ...prev, ...updatedFields };
            localStorage.setItem('sebo_user', JSON.stringify(newUser));
            return newUser;
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('sebo_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, updateUserData }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

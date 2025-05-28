// app/contexts/AuthContext.js
'use client'; // This context will be used by client components, so mark it as a client component

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null); // Initialize with null or a default value

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null); // Or fetch user from a global state/session/API
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_BE_URL + "/auth/user-info", {
                withCredentials: true
            })
            const user_data = response.data.user;
            setUser(user_data);
            setLoading(false)
            return true
        } catch (error) {
            setUser(null)
            setLoading(false)
            console.log("USER FAILED: ", error.message)
            return false
        }
    };

    useEffect(() => {


        fetchUser();
    }, []);


    const Logout = () => {
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{
            loading,
            Logout,
            user,
            fetchUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
    user: User | null; // Real Supabase user or Mock user
    session: Session | null;
    loading: boolean;
    signIn: (email?: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    isMock: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock User for visual testing when no backend is connected
const MOCK_USER = {
    id: 'mock-user-123',
    email: 'mohith@compro.co',
    user_metadata: {
        full_name: 'Mohith H',
        avatar_url: null,
    },
    app_metadata: {},
    aud: 'authenticated',
    created_at: new Date().toISOString(),
} as User;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If Supabase is configured, check for session
        if (supabase) {
            supabase.auth.getSession().then(({ data: { session } }) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            });

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            });

            return () => subscription.unsubscribe();
        } else {
            console.warn("Supabase credentials missing. Running in Mock Mode (Guest).");
            queueMicrotask(() => {
                setUser(null);
                setLoading(false);
            });
        }
    }, []);

    const signIn = async (email?: string, password?: string) => {
        if (supabase) {
            if (email && password) {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) {
                    alert(error.message);
                    throw error;
                }
            } else {
                alert("Google Auth requires configuration in Supabase Dashboard.");
            }
        } else {
            // Mock Login
            setUser(MOCK_USER);
        }
    };

    const signOut = async () => {
        if (supabase) {
            await supabase.auth.signOut();
        } else {
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            loading,
            signIn,
            signOut,
            isMock: !supabase
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

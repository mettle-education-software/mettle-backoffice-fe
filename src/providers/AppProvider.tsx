'use client';

import { User } from '@firebase/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { auth } from 'config/firebase';
import React, { useContext, createContext, useState, useEffect } from 'react';

interface ProviderProps {
    children: React.ReactNode;
}

interface IUser {
    email: string;
    roles: string[];
    uid: string;
    businessUuid: string;
    name: string;
    profileImageSrc: string | null;
}

interface IProviderContext {
    theme: 'light' | 'dark';
    user?: IUser;
    isAppLoading: boolean;
}

const queryClient = new QueryClient();

const AppProviderContext = createContext<IProviderContext>({} as IProviderContext);

export const AppProvider: React.FC<ProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [user, setUser] = useState<any>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(false);

    const handleUserTokenChange = async (user: User | null, isCurrent: () => boolean) => {
        if (user) {
            const token = await user.getIdTokenResult(true);
            if (!isCurrent()) return;
            const { claims } = token;

            const nameParts = String(claims?.name ?? '')
                .trim()
                .split(/\s+/)
                .filter(Boolean);

            setUser({
                email: claims.email,
                name: nameParts.slice(0, 2).join(' ') || String(claims.email ?? ''),
                roles: Array.isArray(claims.roles) ? claims.roles : [],
                uid: claims.user_id,
                businessUuid: claims.businessUuid,
                profileImageSrc: user.photoURL || null,
            });
        } else {
            setUser(null);
        }
        setIsAppLoading(false);
    };

    useEffect(() => {
        // Resultado de token de um evento antigo (logout/troca de usuário) é ignorado:
        // a geração muda já no início da transição e o uid tem de continuar o mesmo.
        let generation = 0;
        const unsubscribeBefore = auth.beforeAuthStateChanged(() => {
            generation++;
            setIsAppLoading(true);
        });
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            const current = ++generation;
            const isCurrent = () => current === generation && auth.currentUser?.uid === authUser?.uid;
            handleUserTokenChange(authUser, isCurrent).catch(() => {
                if (!isCurrent()) return;
                setUser(null);
                setIsAppLoading(false);
            });
        });
        return () => {
            generation++;
            unsubscribeBefore();
            unsubscribe();
        };
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AppProviderContext.Provider value={{ theme, user, isAppLoading }}>{children}</AppProviderContext.Provider>
        </QueryClientProvider>
    );
};

export const useAppContext = () => useContext(AppProviderContext);

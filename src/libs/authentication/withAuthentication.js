'use client';

import { auth } from 'config/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export const isMettleAdmin = (claims) => Array.isArray(claims?.roles) && claims.roles.includes('METTLE_ADMIN');

// Só renderiza a página depois de confirmar o papel METTLE_ADMIN no token.
// eslint-disable-next-line react/display-name
export const withAuthentication = (Component) => (props) => {
    const [access, setAccess] = useState({ status: 'checking', user: null });
    const router = useRouter();

    useEffect(() => {
        let active = true;
        const deny = () => {
            if (!active) return;
            setAccess({ status: 'denied', user: null });
            signOut(auth).catch(() => {});
            router.push('/');
        };

        const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
            if (!authUser) return deny();
            setAccess({ status: 'checking', user: null });
            try {
                const { claims } = await authUser.getIdTokenResult();
                if (!isMettleAdmin(claims)) return deny();
                if (active) setAccess({ status: 'authorized', user: authUser });
            } catch (error) {
                deny();
            }
        });

        return () => {
            active = false;
            unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (access.status !== 'authorized') return null;
    return <Component {...props} userUid={access.user.uid} />;
};

// eslint-disable-next-line react/display-name
export const withoutAuthentication = (Component) => (props) => {
    const [nextOrObserver, setNextOrObserver] = useState({});
    const router = useRouter();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            setNextOrObserver(authUser);
            if (authUser) {
                router.push('/home');
            }
        });
        return unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!nextOrObserver) {
        return <Component {...props} />;
    }
};

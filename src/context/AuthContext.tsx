import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { User } from '../types';
import type { AuthStatus, LoginPayload } from '../services/auth';
import { fetchProfile, getStoredToken, getStoredUser, loginRequest, logoutRequest, persistAuth } from '../services/auth';

export type AuthContextValue = {
    user: (User & { username?: string; role?: string }) | null;
    token: string | null;
    status: AuthStatus;
    error: string | null;
    login: (payload: LoginPayload) => Promise<User>;
    logout: () => void;
    refreshProfile: () => Promise<void>;
    clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface Props {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
    const [user, setUser] = useState<(User & { username?: string; role?: string }) | null>(() => getStoredUser());
    const [token, setToken] = useState<string | null>(() => getStoredToken());
    const [status, setStatus] = useState<AuthStatus>(() => (getStoredToken() ? 'authenticated' : 'idle'));
    const [error, setError] = useState<string | null>(null);

    const login = useCallback(async (payload: LoginPayload) => {
        setStatus('loading');
        setError(null);
        try {
            const authRes = await loginRequest(payload);
            setUser(authRes.user);
            setToken(authRes.token);
            setStatus('authenticated');
            return authRes.user;
        } catch (err: any) {
            setStatus('error');
            setError(err?.message || 'Đăng nhập thất bại');
            throw err;
        }
    }, []);

    const logout = useCallback(() => {
        logoutRequest();
        setUser(null);
        setToken(null);
        setStatus('idle');
        setError(null);
    }, []);

    const refreshProfile = useCallback(async () => {
        if (!token) return;
        try {
            const profile = await fetchProfile(token);
            if (profile) {
                const mergedUser = { ...profile, username: (profile as any).username || user?.username } as User & { username?: string; role?: string };
                setUser(mergedUser);
                persistAuth({ token, user: mergedUser });
            }
        } catch (err) {
            console.warn('Không thể tải lại hồ sơ', err);
        }
    }, [token, user?.username]);

    useEffect(() => {
        const existingToken = getStoredToken();
        const existingUser = getStoredUser();
        if (existingToken && existingUser) {
            setToken(existingToken);
            setUser(existingUser);
            setStatus('authenticated');
        }
    }, []);

    const clearError = useCallback(() => setError(null), []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, token, status, error, login, logout, refreshProfile, clearError }),
        [user, token, status, error, login, logout, refreshProfile, clearError]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;

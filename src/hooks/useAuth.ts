import { useContext } from 'react';
import { AuthContext, AuthContextValue } from '../context/AuthContext';

export default function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth phải được sử dụng bên trong AuthProvider');
    }
    return ctx;
}

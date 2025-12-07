import { User } from '../types';

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'error';

export type LoginPayload = {
    username: string;
    password: string;
};

export type AuthResponse = {
    token: string;
    user: User & { username?: string; role?: string; roles?: string[] };
};

const API_BASE = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL || '';
const LOGIN_ENDPOINT = '/authentication/token';
const PROFILE_ENDPOINT = '/authentication/introspect';

const ACCESS_TOKEN_KEY = 'accessToken';
const CURRENT_USER_KEY = 'currentUser';

function hasApiBase() {
    return Boolean(API_BASE);
}

function buildUrl(path: string) {
    if (!API_BASE) return path;
    return `${API_BASE}${path}`;
}

async function parseJsonOrText(res: Response) {
    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) return res.json();
    return res.text();
}

export async function loginRequest(payload: LoginPayload): Promise<AuthResponse> {
    // Nếu chưa cấu hình API, trả về mock user để dev có thể tiếp tục
    if (!hasApiBase()) {
        const mockUser: AuthResponse = {
            token: 'mock-token',
            user: {
                id: 'demo-user',
                name: payload.username || 'Khách',
                username: payload.username,
                email: `${payload.username || 'demo'}@example.com`,
                role: 'reader',
            },
        };
        persistAuth(mockUser);
        return mockUser;
    }

    const res = await fetch(buildUrl(LOGIN_ENDPOINT), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const data = await parseJsonOrText(res);

    if (!res.ok) {
        const message = typeof data === 'string' ? data : data?.message || 'Đăng nhập thất bại';
        throw new Error(message);
    }

    const normalized: AuthResponse = {
        token: data?.result?.token || data?.token,
        user:
            data?.result?.user ||
            data?.user || {
                id: data?.userId || 'unknown-user',
                name: data?.name || payload.username,
                username: payload.username,
                email: data?.email,
                roles: data?.roles,
            },
    };

    if (!normalized.token) {
        throw new Error('Phản hồi đăng nhập không chứa token');
    }

    persistAuth(normalized);
    return normalized;
}

export async function fetchProfile(token?: string): Promise<User | null> {
    if (!hasApiBase()) {
        const stored = getStoredUser();
        return stored;
    }

    const authToken = token || getStoredToken();
    if (!authToken) return null;

    try {
        const res = await fetch(buildUrl(PROFILE_ENDPOINT), {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token: authToken }),
        });

        const data = await parseJsonOrText(res);
        if (!res.ok) return getStoredUser();

        return (data?.result?.user || data?.user || data || getStoredUser()) as User | null;
    } catch {
        return getStoredUser();
    }
}

export function persistAuth(auth: AuthResponse) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.token);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(auth.user));
}

export function clearAuthStorage() {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function getStoredToken() {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): (User & { username?: string; role?: string }) | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (err) {
        console.warn('Parse user from storage failed', err);
        return null;
    }
}

export function getAuthHeaders(extra: Record<string, string> = {}) {
    const token = getStoredToken();
    return token
        ? {
            ...extra,
            Authorization: `Bearer ${token}`,
        }
        : extra;
}

export function logoutRequest() {
    clearAuthStorage();
}

const authService = {
    loginRequest,
    logoutRequest,
    fetchProfile,
    getAuthHeaders,
    getStoredToken,
    getStoredUser,
};

export default authService;

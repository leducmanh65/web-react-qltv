import { getAuthHeaders } from './auth';

const BASE = process.env.REACT_APP_API_BASE || process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const TAGS_URL = process.env.REACT_APP_TAGS_URL || 'https://okhiepkkkkkkkkkkkkkkhahahahahahahahaha.up.railway.app/api/tags';
const TAGS_TOKEN = process.env.REACT_APP_TAGS_TOKEN;

type FetchOptions = RequestInit & { headers?: Record<string, string> };

class ApiError extends Error {
    status?: number;
    body?: string;
    constructor(message: string, status?: number, body?: string) {
        super(message);
        this.status = status;
        this.body = body;
    }
}

async function handleFetch<T = any>(path: string, options: FetchOptions = {}): Promise<T> {
    const isAbsolute = path.startsWith('http://') || path.startsWith('https://');
    const url = isAbsolute ? path : `${BASE}${path}`;
    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    const headersWithAuth = getAuthHeaders({ ...defaultHeaders, ...(options.headers || {}) });

    const res = await fetch(url, { ...options, headers: headersWithAuth });
    if (!res.ok) {
        const text = await res.text();
        throw new ApiError(`API request failed: ${res.status} ${res.statusText}`, res.status, text);
    }
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return res.text() as unknown as T;

    const data = await res.json();
    // unwrap common envelope { code, result, message }
    if (data && typeof data === 'object' && 'result' in data) return data.result as T;
    return data as T;
}

function formatDateOnly(input: string | number | Date) {
    const d = new Date(input);
    if (isNaN(d.getTime())) return undefined;
    const y = d.getUTCFullYear();
    const m = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

export async function getBestSellers(page: number = 1) {
    // Thử endpoint phân trang trước, nếu không có thì fallback sang /api/books
    try {
        return await handleFetch(`/api/books/page/${page}`);
    } catch (err) {
        return handleFetch(`/api/books`);
    }
}

// Lấy danh sách sách phân trang (dùng chung với getBestSellers nhưng tách hàm rõ tên)
export async function getBooksPage(page: number = 1) {
    try {
        return await handleFetch(`/api/books/page/${page}`);
    } catch (err) {
        return handleFetch(`/api/books`);
    }
}

// Lấy chi tiết sách theo id
export async function getBookById(id: string | number) {
    return handleFetch(`/api/books/${id}`);
}

// Tìm kiếm sách theo title
export async function searchBooks(title: string) {
    if (!title) return getBooksPage(1);
    return handleFetch(`/api/books/searchByTitle?title=${encodeURIComponent(title)}`);
}

export async function getRecentlyRead(userId: string | number = 'me') {
    return handleFetch(`/api/books/user/${userId}`);
}

export async function getWishList(userId: string | number = 'me') {
    // Nếu có endpoint wishlist riêng, sửa tại đây; tạm dùng giống recently-read
    return handleFetch(`/api/books/user/${userId}`);
}

export async function getGenres() {
    return handleFetch('/api/category');
}

// --- Borrow slips ---
// Lưu ý: nếu backend dùng path khác, chỉnh lại tại đây. Mặc định theo chuẩn /api/borrow-slips
export async function createBorrowSlip(payload: any) {
    // Backend yêu cầu ngày dạng yyyy-MM-dd, không cần time
    const today = formatDateOnly(new Date()) || undefined;
    const normalized = {
        status: 'BORROWED',
        note: payload?.note || '',
        ...payload,
        details: (payload?.details || []).map((d: any) => ({
            ...d,
            quantity: d.quantity || 1,
            borrowDate: formatDateOnly(d.borrowDate || today),
            dueDate: formatDateOnly(d.dueDate || d.returnDate || new Date()),
        })),
    };
    // Thử path chính, nếu thất bại thử fallback không 's'
    try {
        return await handleFetch('/api/borrow-slips', {
            method: 'POST',
            body: JSON.stringify(normalized),
        });
    } catch (err) {
        return handleFetch('/api/borrow-slip', {
            method: 'POST',
            body: JSON.stringify(normalized),
        });
    }
}

export async function getBorrowSlipsByUser(userId: string | number) {
    try {
        return await handleFetch(`/api/borrow-slips/user/${userId}`);
    } catch (err) {
        return handleFetch(`/api/borrow-slip/user/${userId}`);
    }
}

export async function returnBorrowSlip(detailId: string | number) {
    // Một số backend dùng /return/{detailId}; chỉnh nếu khác
    try {
        return await handleFetch(`/api/borrow-slips/return/${detailId}`, { method: 'PUT' });
    } catch (err) {
        return handleFetch(`/api/borrow-slip/return/${detailId}`, { method: 'PUT' });
    }
}

const api = {
    getBestSellers,
    getRecentlyRead,
    getWishList,
    getGenres,
};

export default api;

// --- External tags (Railway) ---
export async function getTagsRailway() {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (TAGS_TOKEN) headers['Authorization'] = `Bearer ${TAGS_TOKEN}`;

    const res = await fetch(TAGS_URL, { headers });
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();

    if (!res.ok) {
        const message = typeof data === 'string' ? data : data?.message || `Fetch tags failed: ${res.status}`;
        throw new ApiError(message, res.status, typeof data === 'string' ? data : JSON.stringify(data));
    }

    return data as any;
}

export const API_BASE_URL = process.env.REACT_APP_API_URL || '';

export const API = {
    BOOKS: {
        LIST: `${API_BASE_URL}/books`,
        GET: (id: string | number) => `${API_BASE_URL}/books/${id}`,
        CREATE: `${API_BASE_URL}/books`,
        UPDATE: (id: string | number) => `${API_BASE_URL}/books/${id}`,
        DELETE: (id: string | number) => `${API_BASE_URL}/books/${id}`,
    }
};

// Central TypeScript types used across the dashboard
export interface Book {
    id: string | number;
    title: string;
    author?: string;
    image?: string;
    imageUrl?: string;
    category?: string;
    genreId?: number;
    description?: string;
    publishYear?: number;
    chapter?: string;
    progress?: number;
    rating?: number;
    reviews?: number;
    price?: string;
    oldPrice?: string;
    quantity?: number;
}

export interface User {
    id: string | number;
    name: string;
    email?: string;
    username?: string;
    role?: string;
}

export interface Loan {
    id: string | number;
    bookId: string | number;
    userId: string | number;
    borrowedAt: string; // ISO
    dueDate: string; // ISO
    returned: boolean;
}

export type Genre = { id: number; name: string; icon?: string };

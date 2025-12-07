import { Book, Genre } from '../types';

export const seedBestSellers: Array<Book & { image: string; rating: number; reviews: number; quantity?: number; price?: string; oldPrice?: string }> = [
    { id: 1, title: 'Such a Fun Age', author: 'Kiley Reid', category: 'Tiểu thuyết · Bestseller', image: 'https://images-na.ssl-images-amazon.com/images/P/B07P6MZPK3.01.L.jpg', rating: 4.5, reviews: 221, quantity: 5 },
    { id: 2, title: "Mrs. Everything", author: 'Jennifer Weiner', category: 'Tiểu thuyết · Bestseller', image: 'https://m.media-amazon.com/images/I/81CkHWOR5QL.jpg', rating: 4.5, reviews: 512, quantity: 4 },
    { id: 3, title: 'All This Could Be Yours', author: 'Jami Attenberg', category: 'Tiểu thuyết · Bestseller', image: 'https://m.media-amazon.com/images/I/81AqGFx0cxL.jpg', rating: 4.2, reviews: 232, quantity: 3 },
    { id: 4, title: 'The River', author: 'Peter Heller', category: 'Phiêu lưu', image: 'https://m.media-amazon.com/images/I/81Ixr7-1-7L.jpg', rating: 4.4, reviews: 412, quantity: 6 },
    { id: 5, title: 'The Old Drift', author: 'Namwali Serpell', category: 'Tiểu thuyết', image: 'https://m.media-amazon.com/images/I/81pD48V2pHL.jpg', rating: 4.3, reviews: 432, quantity: 2 },
    { id: 6, title: 'Underland', author: 'Robert Macfarlane', category: 'Khám phá', image: 'https://m.media-amazon.com/images/I/81jPThR1sVL.jpg', rating: 4.5, reviews: 304, quantity: 5 },
];

export const seedRecentlyRead: Array<Book & { image: string; chapter: string; progress: number; author: string }> = [
    { id: 'rr-1', title: 'A Spell of Winter', author: 'Helen Dunmore', chapter: 'Chapter V · The day that will never end', image: 'https://m.media-amazon.com/images/I/81vpsIs58WL.jpg', progress: 72 },
    { id: 'rr-2', title: 'Fight Club', author: 'Chuck Palahniuk', chapter: 'Chapter XV · Epilogue', image: 'https://m.media-amazon.com/images/I/71w5jo1tQYL.jpg', progress: 100 },
];

export const seedWishList: Array<Book & { image: string; author: string; category: string; reviews: number; rating: number; price: string; oldPrice?: string }> = [
    { id: 'wl-1', title: 'Wilder Girls', author: 'Rory Power', category: 'Novel · Bestseller', image: 'https://m.media-amazon.com/images/I/81Xh7QtNfSL.jpg', reviews: 411, rating: 4.4, price: '$20.99', oldPrice: '$29.99' },
];

export const seedGenres: Genre[] = [
    { id: 1, name: 'Cooking', icon: '🍳' },
    { id: 2, name: 'Encyclopedia', icon: '📘' },
    { id: 3, name: 'Sci-Fi', icon: '👩‍🚀' },
    { id: 4, name: 'Horror', icon: '💀' },
    { id: 5, name: 'Myths', icon: '📜' },
    { id: 6, name: 'Satire', icon: '🤹‍♂️' },
];

export const seedHeroCovers: string[] = [
    'https://m.media-amazon.com/images/I/71weA6dkVXL.jpg',
    'https://m.media-amazon.com/images/I/81uwA8k9-0L.jpg',
    'https://m.media-amazon.com/images/I/71WgVrdmf3L.jpg',
    'https://m.media-amazon.com/images/I/81a4kCNuH+L.jpg',
];

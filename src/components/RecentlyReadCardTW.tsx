import React from 'react';
import { Book } from '../types';

export interface RecentlyReadCardProps {
    book: Book & { image?: string; chapter?: string; progress?: number };
    onOpen?: (book: RecentlyReadCardProps['book']) => void;
}

export const RecentlyReadCard: React.FC<RecentlyReadCardProps> = ({ book, onOpen = () => { } }) => {
    return (
        <div className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all" onClick={() => onOpen(book)}>
            <img
                src={book.image || book.imageUrl}
                alt={book.title}
                className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
                <h5 className="text-xs font-bold text-gray-900 truncate leading-tight">{book.title}</h5>
                <p className="text-[11px] text-gray-600 truncate mt-0.5 leading-tight">{book.chapter}</p>
            </div>
        </div>
    );
};

export default RecentlyReadCard;

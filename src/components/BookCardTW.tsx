import React from 'react';
import { Book } from '../types';

export type BookCardTWProps = {
    book: Book & {
        rating?: number;
        reviews?: number;
        price?: string;
        oldPrice?: string;
        image?: string;
    };
    onAction?: (book: BookCardTWProps['book']) => void;
    onBorrow?: (book: BookCardTWProps['book']) => void;
    onAddToCart?: (book: BookCardTWProps['book']) => void;
};

const BookCard: React.FC<BookCardTWProps> = ({ book, onAction = () => { }, onBorrow, onAddToCart }) => {
    const renderStars = (rating: number = 0) => {
        const fullStars = Math.floor(rating);
        return '⭐'.repeat(fullStars);
    };

    const availability = book.quantity !== undefined ? `Còn ${book.quantity} bản` : 'Sẵn sàng để mượn';
    const isFav = Boolean((book as any)._favorite);

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-light hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer border border-gray-100" onClick={() => onAction(book)}>
            {/* Book Image */}
            <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-300 to-gray-400 overflow-hidden group">
                <img
                    src={book.image || book.imageUrl}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {/* Menu Button */}
                <button className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full flex items-center justify-center text-gray-600 hover:text-primary-orange opacity-0 group-hover:opacity-100 transition-opacity shadow-light">
                    ⋮
                </button>
                <button
                    className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center text-base transition-all ${isFav ? 'bg-white text-red-500 shadow-light' : 'bg-white/80 text-gray-500 hover:text-red-500'}`}
                    title="Thêm vào yêu thích"
                >
                    {isFav ? '❤️' : '🤍'}
                </button>
            </div>

            {/* Content */}
            <div className="p-3">
                <h4 className="text-sm font-bold text-gray-900 line-clamp-2 mb-1">{book.title}</h4>
                <p className="text-xs text-gray-600 mb-1">{book.author}</p>
                <p className="text-[11px] text-gray-500 mb-2">{book.category}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-2">
                    <span className="text-xs leading-none">{renderStars(book.rating)}</span>
                    <span className="text-xs text-gray-500">({book.reviews})</span>
                </div>

                {/* Availability */}
                <div className="flex items-center justify-between mt-1">
                    <span className="text-[11px] font-semibold text-primary-orange">{availability}</span>
                    <span className="text-[11px] text-gray-500">Mượn ngay</span>
                </div>
                <div className="mt-3 flex gap-2">
                    <button
                        className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-primary-orange text-white hover:opacity-90"
                        onClick={(e) => { e.stopPropagation(); onBorrow && onBorrow(book); }}
                        disabled={Number(book.quantity ?? 1) <= 0}
                    >
                        Mượn
                    </button>
                    <button
                        className="flex-1 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                        onClick={(e) => { e.stopPropagation(); onAddToCart && onAddToCart(book); }}
                        disabled={Number(book.quantity ?? 1) <= 0}
                    >
                        Thêm giỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookCard;

import React from 'react';
import StatusBadge from '../shared/StatusBadge';
import { Book } from '../../types';

export interface BookCardProps {
    book: Book & {
        description?: string;
        imageUrl?: string;
        category?: string;
        quantity?: number;
    };
    onView: (id: string | number) => void;
    onBorrow: (book: BookCardProps['book']) => void;
    onAddToCart?: (book: BookCardProps['book']) => void;
}

const BookCard: React.FC<BookCardProps> = ({ book, onView, onBorrow, onAddToCart }) => {
    const available = Number(book.quantity) > 0;
    return (
        <div className="book-card" style={{ cursor: 'pointer' }}>
            <div className="book-image-wrapper">
                {book.imageUrl ? (
                    <img src={book.imageUrl} alt={book.title} className="book-image" />
                ) : (
                    <div className="book-image-placeholder">📖</div>
                )}
                <div className="book-badge">{book.category}</div>
            </div>

            <div className="book-content">
                <h3 className="book-title" onClick={() => onView(book.id)}>{book.title}</h3>
                <p className="book-author">{book.author}</p>
                <p className="book-quantity">Số lượng: <strong>{book.quantity}</strong></p>
                <p className="book-description">{book.description}</p>
            </div>

            <div className="book-actions">
                <button className="btn-edit" onClick={() => onView(book.id)}>Xem</button>
                <button className="btn-add-book" onClick={() => (onAddToCart ? onAddToCart(book) : onBorrow(book))} disabled={!available} style={{ background: available ? undefined : '#ccc' }}>
                    {available ? 'Thêm vào giỏ' : 'Hết sách'}
                </button>
                <button className="btn-edit" onClick={() => onBorrow(book)} disabled={!available} style={{ marginLeft: 8 }}>
                    {available ? 'Mượn ngay' : ''}
                </button>
            </div>
        </div>
    );
};

export default BookCard;

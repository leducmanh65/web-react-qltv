import React from "react";
import "../../styles/User/book-card.css";

export interface Book {
  id: number;
  title: string;
  bookCode?: string;
  isbn?: string;
  description?: string;
  publishYear?: number;
  price: number;
  totalQuantity?: number;
  availableQuantity?: number;
  isActive?: boolean;
  isEbook?: boolean;
  authors?: Array<{ id: number; authorName: string }>;
  category?: { id: number; categoryName: string };
  tags?: Array<{ id: number; tagName: string }>;
  imageUrl?: string;
  createdAt?: any;
  updatedAt?: any;
}

interface BookCardProps {
  book: Book;
  onRead?: (book?: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onRead }) => {
  const authorNames = book.authors && book.authors.length > 0
    ? book.authors.map(a => a.authorName).join(", ")
    : "Unknown Author";
  
  const coverUrl = book.imageUrl || "https://books2ebooks.eu/sites/default/files/inline-images/content-front-page-open-book.png";
  const displayPrice = book.price || 0;
  const estimatedOriginalPrice = displayPrice * 1.3; // Mock 30% discount
  const discount = Math.round(((estimatedOriginalPrice - displayPrice) / estimatedOriginalPrice) * 100);
  const rating = 4; // Mock rating
  const reviews = Math.floor(Math.random() * 500) + 50; // Mock reviews
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;

  return (
    <div className="user-book-card">
      <div className="user-book-cover-wrapper">
        <img className="user-book-cover" src={coverUrl} alt={book.title} />
        {discount > 0 && <div className="user-discount-badge">-{discount}%</div>}
      </div>

      <div className="user-book-info">
        <h3 className="user-book-title">{book.title}</h3>
        <p className="user-book-author">{authorNames}</p>

        <div className="user-book-rating">
          <span className="user-stars">{"★".repeat(fullStars) + "☆".repeat(emptyStars)}</span>
          <span className="user-review-count">({reviews})</span>
        </div>

        <div className="user-book-price">
          <span className="user-current-price">${displayPrice.toFixed(2)}</span>
          {discount > 0 && <span className="user-original-price">${estimatedOriginalPrice.toFixed(2)}</span>}
        </div>

        <button className="user-read-btn" type="button" onClick={() => onRead?.(book)}>
          {book.isEbook ? "Read Ebook" : "Borrow"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
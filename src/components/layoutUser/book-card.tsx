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

  const coverUrl = book.imageUrl || "https://www.bing.com/ck/a?!&&p=ab93c4e6ed2dd9a80e0847ee8d9409d50156e164e6007af856d7ff209f26d0edJmltdHM9MTc2NTA2NTYwMA&ptn=3&ver=2&hsh=4&fclid=33afcfb7-e5a0-6c4b-1ffc-da05e4746d8b&u=a1L2ltYWdlcy9zZWFyY2g_cT0lZTElYmElYTNuaCt0dXklZTElYmIlODNuK3QlZTElYmElYWRwK3RoJWM2JWExK3h1JWMzJWEybitkaSVlMSViYiU4N3UmaWQ9NDQ4QzM0REU3QTUyMjdEQ0I4NzA2NjhGMTlGNTIzNUM5Njc0QTI2NSZGT1JNPUlRRlJCQQ";
  const discount = 0;
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

        <button className="user-read-btn" type="button" onClick={() => onRead?.(book)}>
          {book.isEbook ? "Read Ebook" : "Borrow"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
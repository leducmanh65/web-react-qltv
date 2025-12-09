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
  
  const coverUrl = book.imageUrl || "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781476740195/the-library-book-9781476740195_lg.jpg";





  return (
    <div className="user-book-card">
      <div className="user-book-cover-wrapper">
        <img className="user-book-cover" src={coverUrl} alt={book.title} />
     
      </div>

      <div className="user-book-info">
        <h3 className="user-book-title">{book.title}</h3>
        <p className="user-book-author">{authorNames}</p>

        <div className="user-book-price">
          <span className="user-original-price">{book.description}</span>
        </div>

        <button className="user-read-btn" type="button" onClick={() => onRead?.(book)}>
          {book.isEbook ? "Read Ebook" : "Borrow"}
        </button>
      </div>
    </div>
  );
};

export default BookCard;
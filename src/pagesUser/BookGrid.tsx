import React from "react";
import { BookCard } from "../components/layoutUser/book-card"; // Chỉnh đường dẫn
import type { Book } from "../components/layoutUser/book-card";

interface BookGridProps {
  loading: boolean;
  bookType: string;
  displayBooks: Book[];
  onBookClick: (book: Book, coverUrl?: string) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ 
  loading, bookType, displayBooks, onBookClick 
}) => {
  return (
    <section>
      <h3 className="user-section-title">
        {bookType === "Ebook" ? "📚 Danh sách Ebook" : bookType === "Book" ? "📖 Danh sách Sách giấy" : "📚 Tất cả sách"} 
        ({displayBooks.length})
      </h3>
      {loading ? (
        <p style={{ padding: "20px", textAlign: "center" }}>Đang tải...</p>
      ) : (
        <div className="user-books-grid">
          {displayBooks.length > 0 ? (
            displayBooks.map((book) => {
              const isEbook = bookType === "Ebook";
              const bookData = isEbook ? (book as any).book || book : book;
              const ebookCover = isEbook ? (book.imageUrl || bookData.imageUrl || "") : bookData.imageUrl;
              const displayBook = isEbook ? { ...bookData, imageUrl: ebookCover, isEbook: true } : bookData;
              
              return (
                <BookCard
                  key={book.id}
                  book={displayBook}
                  onRead={() => onBookClick(displayBook, ebookCover)}
                />
              );
            })
          ) : (
            <p className="user-no-results" style={{ padding: "20px", textAlign: "center", color: "#666" }}>
              {bookType === "Ebook"
                ? "Không có ebook nào."
                : bookType === "Book"
                ? "Không có sách giấy nào."
                : "Không tìm thấy sách nào."}
            </p>
          )}
        </div>
      )}
    </section>
  );
};
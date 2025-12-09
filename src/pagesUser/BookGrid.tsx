import React from "react";
import { BookCard } from "../components/layoutUser/book-card";
import type { Book } from "../components/layoutUser/book-card";
import { Layers } from "lucide-react";
import "../styles/User/home.css";

interface BookGridProps {
  loading: boolean;
  bookType: string;
  displayBooks: Book[];
  onBookClick: (book: Book, coverUrl?: string) => void;
}

export const BookGrid: React.FC<BookGridProps> = ({ 
  loading, bookType, displayBooks, onBookClick 
}) => {
  const getTitle = () => {
    if (bookType === "Ebook") return "Danh sách Ebook";
    if (bookType === "Book") return "Danh sách Sách giấy";
    return "Tất cả sách";
  };

  return (
    <section>
      <div className="user-section__header">
        <h3 className="user-section__title">
          <Layers size={22} color="var(--user-primary)" /> 
          {getTitle()} 
          <span style={{ fontSize: "15px", color: "var(--user-text-gray)", marginLeft: "10px", fontWeight: "normal" }}>
            ({displayBooks.length} cuốn)
          </span>
        </h3>
      </div>

      {loading ? (
        <div className="user-state--loading">
          <p>⏳ Đang tải dữ liệu sách...</p>
        </div>
      ) : (
        <div className="user-grid__books">
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
            <div className="user-state--empty">
              <p>Không tìm thấy cuốn sách nào phù hợp.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
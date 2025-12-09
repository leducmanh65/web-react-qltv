import React from "react";
import { Book, Monitor, Search } from "lucide-react";
import "../styles/User/home.css";

interface BookFiltersProps {
  bookType: string;
  setBookType: (val: string) => void;
  ebookSearch: string;
  setEbookSearch: (val: string) => void;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  bookType, setBookType, ebookSearch, setEbookSearch
}) => {
  return (
    <section className="user-filter__card">
      <h3 className="user-section__title" style={{ marginBottom: "16px" }}>
        🏷️ Chọn loại sách
      </h3>
      
      {/* Tận dụng class user-pagination__btn cho các nút Tab vì style tương tự */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <button 
          className="user-pagination__btn"
          style={bookType === "Book" ? { borderColor: "var(--user-primary)", color: "var(--user-primary)", background: "var(--user-primary-soft)" } : {}}
          onClick={() => setBookType("Book")}
        >
          <Book size={18} style={{ marginRight: 8 }} />
          Sách giấy
        </button>
        
        <button 
          className="user-pagination__btn"
          style={bookType === "Ebook" ? { borderColor: "var(--user-primary)", color: "var(--user-primary)", background: "var(--user-primary-soft)" } : {}}
          onClick={() => setBookType("Ebook")}
        >
          <Monitor size={18} style={{ marginRight: 8 }} />
          Ebook
        </button>
      </div>

      {/* Ô tìm kiếm riêng cho Ebook */}
      {bookType === "Ebook" && (
        <div className="user-filter__row">
          <div style={{ position: "relative", width: "100%" }}>
            <input
              type="text"
              className="user-filter__input"
              placeholder="Tìm kiếm Ebook (Tên, tác giả, mã...)"
              value={ebookSearch}
              onChange={(e) => setEbookSearch(e.target.value)}
              style={{ paddingLeft: "42px" }} 
            />
            <Search 
              size={18} 
              color="#95a5a6" 
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} 
            />
          </div>
        </div>
      )}
    </section>
  );
};
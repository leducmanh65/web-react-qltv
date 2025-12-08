import React from "react";

interface BookFiltersProps {
  bookType: string;
  setBookType: (val: string) => void;
  ebookSearch: string;
  setEbookSearch: (val: string) => void;
}

export const BookFilters: React.FC<BookFiltersProps> = ({
  bookType, setBookType, ebookSearch, setEbookSearch
}) => {
  const getButtonStyle = (type: string) => ({
    padding: "10px 20px",
    backgroundColor: bookType === type ? "#007bff" : "#e0e0e0",
    color: bookType === type ? "white" : "black",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer"
  });

  return (
    <>
      <section style={{ margin: "20px 0" }}>
        <h3 className="user-section-title">Loại sách</h3>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setBookType("All")} style={getButtonStyle("All")}>
            📚 Tất cả
          </button>
          <button onClick={() => setBookType("Book")} style={getButtonStyle("Book")}>
            📖 Sách giấy
          </button>
          <button onClick={() => setBookType("Ebook")} style={getButtonStyle("Ebook")}>
            💻 Ebook
          </button>
        </div>
      </section>

      {/* Ô TÌM KIẾM RIÊNG CHO EBOOK */}
      {bookType === "Ebook" && (
        <section style={{ margin: "20px 0", padding: "15px", background: "#e3f2fd", borderRadius: "8px" }}>
          <h3 className="user-section-title">🔍 Tìm kiếm Ebook</h3>
          <input
            type="text"
            placeholder="Tìm theo tên sách, tác giả, mã sách, thể loại..."
            value={ebookSearch}
            onChange={(e) => setEbookSearch(e.target.value)}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        </section>
      )}
    </>
  );
};
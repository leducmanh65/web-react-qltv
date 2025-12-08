import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuard } from "../hooks/useUserGuard";
import "../styles/User/home.css";
import { Sidebar } from "../components/layoutUser/sidebar";
import { FeaturedSection } from "../components/layoutUser/featured-section";
import { BookCard } from "../components/layoutUser/book-card";
import { 
  getAllBooks, getAllEbooks, getAllCategories, getAllTags, getAllAuthors, 
  getBooksByAuthorId, searchBooksByTitle, getBooksByCategoryAndTags 
} from "../api/apiService";
import type { Book } from "../components/layoutUser/book-card";
import EbookViewerModal from "../components/modals/EbookViewerModal";
import CreateBorrowSlipForm from "../components/forms/create/CreateBorrowSlipForm";

export const HomePage: React.FC = () => {
    useUserGuard(); // Check authentication
    const navigate = useNavigate();

    // --- 1. STATE DECLARATIONS (Khai báo tất cả State lên đầu) ---
    // Autocomplete Data States
    const [categories, setCategories] = useState<any[]>([]);
    const [tags, setTags] = useState<any[]>([]);
    const [authors, setAuthors] = useState<any[]>([]);
    
    // Selection States
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [selectedTag, setSelectedTag] = useState<any>(null);
    const [selectedAuthor, setSelectedAuthor] = useState<any>(null);
    
    // Main Logic States
    const [selectedGenre, setSelectedGenre] = useState<string>("All"); 
    const [bookType, setBookType] = useState<string>("All"); 
    const [search, setSearch] = useState<string>("");
    const [ebookSearch, setEbookSearch] = useState<string>(""); // Tìm kiếm riêng cho ebook
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal States
    const [ebookModalOpen, setEbookModalOpen] = useState(false);
    const [borrowFormOpen, setBorrowFormOpen] = useState(false);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
    const [selectedBookTitle, setSelectedBookTitle] = useState<string>("");
    const [selectedEbookCover, setSelectedEbookCover] = useState<string>("");

    const BOOKS_PER_PAGE = 20;

    // --- 2. FETCH DATA (Autocomplete) ---
    useEffect(() => {
      const fetchAutocomplete = async () => {
        try {
          // Gọi API song song
          const [catRes, tagRes, authorRes] = await Promise.all([
            getAllCategories(),
            getAllTags(),
            getAllAuthors()
          ]);

          // DEBUG: Kiểm tra dữ liệu trả về trong Console
          console.log("Categories Res:", catRes);
          console.log("Tags Res:", tagRes);
          
          // SỬA LỖI: Kiểm tra kỹ cấu trúc trả về. 
          // Nếu API trả về mảng trực tiếp thì dùng 'res', nếu bọc trong data thì dùng 'res.data'
          // Dưới đây là logic an toàn (fallback):
          setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
          setTags(Array.isArray(tagRes) ? tagRes : tagRes?.data || []);
          setAuthors(Array.isArray(authorRes) ? authorRes : authorRes?.data || []);

        } catch (err) {
          console.error("Lỗi tải dữ liệu gợi ý:", err);
        }
      };
      fetchAutocomplete();
    }, []);

    // --- 3. FETCH BOOKS (Main Data) ---
    useEffect(() => {
      const fetchBooks = async () => {
        setLoading(true);
        try {
          let response: any;
          if (bookType === "Ebook") {
            response = await getAllEbooks();
          } else {
            response = await getAllBooks();
          }
          const booksData = Array.isArray(response) ? response : response?.data || [];
          setAllBooks(booksData);
        } catch (error) {
          console.error("Failed to fetch books:", error);
          setAllBooks([]);
        } finally {
          setLoading(false);
        }
      };
      fetchBooks();
    }, [bookType]);

    // --- 3B. FILTER EBOOKS BY SEARCH ---
    const filteredEbooks = useMemo(() => {
      if (bookType !== "Ebook" || !ebookSearch.trim()) return allBooks;
      
      const searchLower = ebookSearch.toLowerCase();
      return allBooks.filter((ebook: any) => {
        const book = ebook.book || {}; // Dữ liệu ebook có trường book
        const title = (book.title ?? "").toLowerCase();
        const bookCode = (book.bookCode ?? "").toLowerCase();
        const authorNames = book.authors?.map((a: any) => a.authorName).join(" ").toLowerCase() || "";
        const categoryName = (book.category?.categoryName ?? "").toLowerCase();
        
        return title.includes(searchLower) || 
               bookCode.includes(searchLower) || 
               authorNames.includes(searchLower) ||
               categoryName.includes(searchLower);
      });
    }, [allBooks, ebookSearch, bookType]);

    // Sử dụng filteredEbooks nếu là Ebook, ngược lại dùng allBooks
    const displayBooks = bookType === "Ebook" ? filteredEbooks : allBooks;

    // --- 4. HANDLERS ---
    const handleSmartSearch = async () => {
      setLoading(true);
      try {
        let booksData = [];
        // Ưu tiên lọc theo logic
        if (selectedAuthor) {
          const res = await getBooksByAuthorId(selectedAuthor.id);
          booksData = res?.data || res || [];
        } else if (selectedCategory) {
          // Nếu có tag thì gửi kèm tag, không thì gửi mảng rỗng
          const tagIds = selectedTag ? [selectedTag.id] : [];
          const res = await getBooksByCategoryAndTags(selectedCategory.id, tagIds);
          booksData = res?.data || res || [];
        } else if (search) {
          const res = await searchBooksByTitle(search);
          booksData = res?.data || res || [];
        } else {
          // Nếu không chọn gì cả thì load lại toàn bộ
          const res = await getAllBooks();
          booksData = res?.data || res || [];
        }
        setAllBooks(booksData);
      } catch (err) {
        console.error("Smart search error:", err);
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };

    const handleBookClick = (book: Book, coverUrl?: string) => {
      setSelectedBookId(book.id);
      setSelectedBookTitle(book.title);
      if (book.isEbook) {
        setSelectedEbookCover(coverUrl || book.imageUrl || "");
        setEbookModalOpen(true);
      }
      else setBorrowFormOpen(true);
    };

    const handleNavigate = (page: string, id?: string) => {
      if (page === "reader" && id) navigate(`/user/reader/${id}`);
      else if (page === "home") navigate("/user");
    };

    // --- RENDER ---
    return (
      <div className="user-home-page">
        <Sidebar onNavigate={handleNavigate} activePage="home" />
        <div className="user-main-content">
          <FeaturedSection />

          {/* SECTION TÌM KIẾM NÂNG CAO */}
          <section style={{ margin: "20px 0", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
            <h3 className="user-section-title">Tìm kiếm nâng cao</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              
              {/* Input tìm kiếm với Datalist gợi ý */}
              <div style={{ position: "relative" }}>
                <input
                  type="text"
                  placeholder="Nhập tên sách..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  list="book-suggestions" // Kết nối với datalist
                  style={{ minWidth: 200, padding: "8px" }}
                />
                <datalist id="book-suggestions">
                  {/* Hiển thị tối đa 10 gợi ý từ danh sách sách hiện có */}
                  {allBooks.slice(0, 10).map((b) => (
                    <option key={b.id} value={b.title} />
                  ))}
                </datalist>
              </div>

              {/* Select Category */}
              <select 
                value={selectedCategory?.id || ""} 
                onChange={e => {
                  const val = e.target.value;
                  // Tìm theo ID (ép kiểu về number nếu id trong data là number)
                  const found = categories.find(c => String(c.id) === val);
                  setSelectedCategory(found || null);
                }}
                style={{ padding: "8px" }}
              >
                <option value="">-- Tất cả Thể loại --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.categoryName}</option>
                ))}
              </select>

              {/* Select Tag */}
              <select 
                value={selectedTag?.id || ""} 
                onChange={e => {
                  const val = e.target.value;
                  const found = tags.find(t => String(t.id) === val);
                  setSelectedTag(found || null);
                }}
                style={{ padding: "8px" }}
              >
                <option value="">-- Tất cả Tag --</option>
                {tags.map(t => (
                  <option key={t.id} value={t.id}>{t.tagName}</option>
                ))}
              </select>

              {/* Select Author */}
              <select 
                value={selectedAuthor?.id || ""} 
                onChange={e => {
                  const val = e.target.value;
                  const found = authors.find(a => String(a.id) === val);
                  setSelectedAuthor(found || null);
                }}
                style={{ padding: "8px" }}
              >
                <option value="">-- Tất cả Tác giả --</option>
                {authors.map(a => (
                  <option key={a.id} value={a.id}>{a.authorName}</option>
                ))}
              </select>

              <button 
                onClick={handleSmartSearch}
                style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
              >
                Tìm kiếm
              </button>
            </div>
          </section>

          {/* SECTION CHỌN LOẠI SÁCH */}
          <section style={{ margin: "20px 0" }}>
            <h3 className="user-section-title">Loại sách</h3>
            <div style={{ display: "flex", gap: 12 }}>
              <button
                onClick={() => setBookType("All")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: bookType === "All" ? "#007bff" : "#e0e0e0",
                  color: bookType === "All" ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                📚 Tất cả
              </button>
              <button
                onClick={() => setBookType("Book")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: bookType === "Book" ? "#007bff" : "#e0e0e0",
                  color: bookType === "Book" ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                📖 Sách giấy
              </button>
              <button
                onClick={() => setBookType("Ebook")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: bookType === "Ebook" ? "#007bff" : "#e0e0e0",
                  color: bookType === "Ebook" ? "white" : "black",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
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
                onChange={e => setEbookSearch(e.target.value)}
                style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
            </section>
          )}

          {/* SECTION KẾT QUẢ */}
          <section>
            <h3 className="user-section-title">
              {bookType === "Ebook" ? "📚 Danh sách Ebook" : bookType === "Book" ? "📖 Danh sách Sách giấy" : "📚 Tất cả sách"} ({displayBooks.length})
            </h3>
            {loading ? (
               <p style={{ padding: "20px", textAlign: "center" }}>Đang tải...</p> 
            ) : (
              <div className="user-books-grid">
                {displayBooks.length > 0 ? (
                  displayBooks.map((book) => {
                    const isEbook = bookType === "Ebook";
                    const bookData = isEbook ? (book.book || book) : book;
                    const ebookCover = isEbook ? (book.imageUrl || bookData.imageUrl || "") : bookData.imageUrl;
                    // Đảm bảo thẻ ebook có cờ isEbook để nút hiện "Read Ebook"
                    const displayBook = isEbook ? { ...bookData, imageUrl: ebookCover, isEbook: true } : bookData;
                    return (
                      <BookCard 
                        key={book.id} 
                        book={displayBook} 
                        onRead={() => handleBookClick(displayBook, ebookCover)} 
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
        </div>

        {/* Modals giữ nguyên */}
        {ebookModalOpen && selectedBookId && (
          <EbookViewerModal
            bookId={selectedBookId}
            bookTitle={selectedBookTitle}
            coverUrl={selectedEbookCover}
            onClose={() => { setEbookModalOpen(false); setSelectedBookId(null); setSelectedEbookCover(""); setSelectedBookTitle(""); }}
          />
        )}
        {borrowFormOpen && selectedBookId && (
          <CreateBorrowSlipForm
            isOpen={borrowFormOpen}
            onClose={() => { setBorrowFormOpen(false); setSelectedBookId(null); }}
            onSuccess={() => { setBorrowFormOpen(false); setSelectedBookId(null); alert("Thành công!"); }}
          />
        )}
      </div>
    );
};

export default HomePage;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen} from "lucide-react";
import "../styles/User/home.css";
import "../styles/User/book-card.css"; 
import { getReadingHistoryByUserId, saveReadingProgress } from "../api/apiService";

export const EbookHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const formatDate = (value: any) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      const [y, m, d, hh = 0, mm = 0, ] = value;
      const pad = (n: number) => String(n).padStart(2, "0");
      if (!y || !m || !d) return "";
      return `${pad(d)}/${pad(m)}/${y} ${pad(hh)}:${pad(mm)}`; // Bỏ giây cho gọn
    }
    return "";
  };

  const handleOpenBook = async (item: any) => {
    if (!item.bookId) return;
    
    const userId = localStorage.getItem("userId");
    // Nếu chưa đăng nhập vẫn cho đọc (demo) hoặc chặn tùy logic
    if (userId) {
      try {
        await saveReadingProgress({
          userId: parseInt(userId),
          bookId: item.bookId,
          currentPage: item.currentPage,
          totalPages: item.totalPages,
          lastRead: new Date().toISOString(),
        });
      } catch (err) {
        console.error("Failed to save progress:", err);
      }
    }
    
    navigate(`/user/reader/${item.bookId}`);
  };

  useEffect(() => {
    const fetchEbookHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          setError("Vui lòng đăng nhập để xem lịch sử.");
          setHistory([]);
          return;
        }
        
        const res: any = await getReadingHistoryByUserId(storedUserId);
        const data = res?.data || res || [];
        
        const mapped = Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.id,
              bookId: item.book?.id,
              title: item.book?.title || "(Không tên)",
              author: item.book?.authors?.map((a: any) => a.authorName).join(", ") || "Tác giả ẩn danh",
              lastRead: formatDate(item.lastReadAt || item.createdAt),
              currentPage: item.currentPage || 0,
              totalPages: item.book?.pageCount || 0,
              // Tính phần trăm tiến độ
              progress: item.book?.pageCount ? Math.round((item.currentPage / item.book.pageCount) * 100) : 0,
              coverUrl: item.book?.imageUrl || "",
            }))
          : [];
        
        setHistory(mapped);
      } catch (err: any) {
        console.error("Fetch ebook history failed", err);
        setError("Không tải được lịch sử đọc Ebook");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEbookHistory();
  }, []);

  return (
    <div className="user-layout">
      <div className="user-layout__content">
        
        {/* HEADER */}
        <div className="user-section__header">
          <h2 className="user-section__title">
            <BookOpen size={24} color="var(--user-primary)" />
            Lịch sử đọc Ebook
          </h2>
        </div>
        
        {/* MAIN CONTENT */}
      <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
          {loading && <p>Đang tải lịch sử đọc Ebook...</p>}
          {error && !loading && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && history.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {history.map((item) => (
                <div
                  key={item.id}
                  className="user-book-card"
                  onClick={() => handleOpenBook(item)}
                >
                  <div className="user-book-cover-wrapper">
                    <img
                      className="user-book-cover"
                      src={item.coverUrl || "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781476740195/the-library-book-9781476740195_lg.jpg"}
                      alt={item.title}
                    />
                  </div>

                  <div className="user-book-info">
                    <h3 className="user-book-title">{item.title}</h3>
                    <p className="user-book-author">{item.author}</p>
                    <p className="user-book-category-text"> {item.lastRead}</p>
                    <button
                      className="user-read-btn"
                      style={{ marginTop: "10px" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenBook(item);
                      }}
                    >
                      📖 Đọc tiếp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && !error && <p style={{ textAlign: "center", color: "#666", padding: "40px" }}>Bạn chưa đọc Ebook nào.</p>
          )}
        </div> 
      </div>
    </div>
  );
};

export default EbookHistoryPage;



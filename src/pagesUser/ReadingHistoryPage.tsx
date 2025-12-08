import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserGuard } from "../hooks/useUserGuard"; 
import "../styles/User/home.css"; // Tái sử dụng CSS cũ để bố cục giống hệt Home
import { Sidebar } from "../components/layoutUser/sidebar";
import { getBorrowSlipsByUserId } from "../api/apiService";

export const ReadingHistoryPage: React.FC = () => {
  useUserGuard();
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Chuyển mảng ngày [yyyy, mm, dd, ...] thành chuỗi dễ đọc
  const formatDate = (value: any) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      const [y, m, d, hh = 0, mm = 0, ss = 0] = value;
      // Đảm bảo 2 chữ số
      const pad = (n: number) => String(n).padStart(2, "0");
      if (!y || !m || !d) return "";
      return `${pad(d)}/${pad(m)}/${y} ${pad(hh)}:${pad(mm)}:${pad(ss)}`.trim();
    }
    return "";
  };

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      setError("");
      try {
        const storedUserId = localStorage.getItem("userId");
        if (!storedUserId) {
          setError("Không tìm thấy userId trong phiên đăng nhập.");
          setHistory([]);
          return;
        }
        const res: any = await getBorrowSlipsByUserId(storedUserId);
        const data = res?.data || res || [];
        // Flatten: một phiếu mượn có thể chứa nhiều sách (details)
        const mapped = Array.isArray(data)
          ? data.flatMap((slip: any) => {
              const slipCreatedAt = formatDate(slip.createdAt);
              if (Array.isArray(slip.details) && slip.details.length > 0) {
                return slip.details.map((detail: any) => ({
                  id: `${slip.id}-${detail.id ?? "d"}`,
                  slipCode: slip.slipCode,
                  title: detail.book?.title || "(Không tên)",
                  author: detail.book?.authors?.map((a: any) => a.authorName).join(", ") || "(Không rõ)",
                  date: formatDate(detail.borrowDate) || slipCreatedAt,
                  status: detail.status || slip.status || "",
                  bookId: detail.book?.id ?? detail.bookId,
                }));
              }
              return {
                id: slip.id,
                slipCode: slip.slipCode,
                title: slip.book?.title || "(Không tên)",
                author: slip.book?.authors?.map((a: any) => a.authorName).join(", ") || "(Không rõ)",
                date: slipCreatedAt,
                status: slip.status || "",
                bookId: slip.bookId || slip.book?.id,
              };
            })
          : [];
        setHistory(mapped);
      } catch (err: any) {
        console.error("Fetch reading history failed", err);
        setError("Không tải được lịch sử đọc sách");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // Hàm điều hướng chung cho Sidebar
  const handleNavigate = (page: string, id?: string) => {
    if (page === "home") navigate("/user");
    else if (page === "history") navigate("/user/history");
    else if (page === "reader" && id) navigate(`/user/reader/${id}`);
  };

  return (
    <div className="user-home-page">
      {/* Sidebar được render lại ở đây, nhưng activePage="history" để highlight nút Lịch sử */}
      <Sidebar onNavigate={handleNavigate} activePage="history" />

      <div className="user-main-content">
        <h2 className="user-section-title" style={{ marginTop: 0 }}>📜 Lịch sử đọc sách</h2>
        
        <div style={{ background: "white", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.05)" }}>
          {loading && <p>Đang tải lịch sử...</p>}
          {error && !loading && <p style={{ color: "red" }}>{error}</p>}
          {!loading && !error && history.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                  <th style={{ padding: "10px" }}>Mã phiếu</th>
                  <th style={{ padding: "10px" }}>Tên sách</th>
                  <th style={{ padding: "10px" }}>Tác giả</th>
                  <th style={{ padding: "10px" }}>Ngày đọc</th>
                  <th style={{ padding: "10px" }}>Trạng thái</th>
                  <th style={{ padding: "10px" }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item) => (
                  <tr key={item.id} style={{ borderBottom: "1px solid #f5f5f5" }}>
                    <td style={{ padding: "12px 10px", color: "#666" }}>{item.slipCode || ""}</td>
                    <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{item.title}</td>
                    <td style={{ padding: "12px 10px", color: "#666" }}>{item.author}</td>
                    <td style={{ padding: "12px 10px" }}>{item.date}</td>
                    <td style={{ padding: "12px 10px" }}>
                      <span style={{ 
                        padding: "4px 8px", 
                        borderRadius: "12px", 
                        fontSize: "0.85rem",
                        backgroundColor: (item.status || "").toUpperCase().includes("BORROW") ? "#e3f2fd" : "#e8f5e9",
                        color: (item.status || "").toUpperCase().includes("BORROW") ? "#1976d2" : "#2e7d32"
                      }}>
                        {item.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px 10px" }}>
                        {item.bookId ? (
                          <button
                            style={{ cursor: "pointer", border: "none", background: "transparent", color: "#007bff" }}
                            onClick={() => navigate(`/user/reader/${item.bookId}`)}
                          >
                            Đọc tiếp
                          </button>
                        ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            !loading && !error && <p>Bạn chưa đọc cuốn sách nào.</p>
          )}
        </div>
      </div>
    </div>
  );
};
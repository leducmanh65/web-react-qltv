import React, { useState, useEffect } from "react";
import { History } from "lucide-react"; // Icon cho đẹp
import "../styles/User/home.css"; 
import { getBorrowSlipsByUserId } from "../api/apiService";

export const ReadingHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Hàm format ngày tháng
  const formatDate = (value: any) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (Array.isArray(value)) {
      const [y, m, d, hh = 0, mm = 0, ss = 0] = value;
      const pad = (n: number) => String(n).padStart(2, "0");
      if (!y || !m || !d) return "";
      return `${pad(d)}/${pad(m)}/${y} ${pad(hh)}:${pad(mm)}:${pad(ss)}`.trim();
    }
    return "";
  };

  // Cập nhật class theo chuẩn BEM trong CSS mới
  const getStatusClass = (status: string) => {
    const s = (status || "").toUpperCase();
    if (s.includes("BORROW") || s.includes("PENDING")) return "user-badge--borrowing";
    if (s.includes("RETURN") || s.includes("COMPLETED")) return "user-badge--returned";
    if (s.includes("OVERDUE") || s.includes("LATE")) return "user-badge--overdue";
    return "user-badge--default";
  };

  // Kiểm tra hạn trả
  const isOverdue = (dueDateStr: string) => {
    if (!dueDateStr) return false;
    try {
      const parts = dueDateStr.split(' ')[0].split('/');
      if (parts.length === 3) {
        const d = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
        return d < new Date();
      }
    } catch (e) {
      return false;
    }
    return false;
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
        
        // Flatten data structure
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
                  dueDate: formatDate(detail.dueDate || detail.returnDate || slip.dueDate),
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
                dueDate: formatDate(slip.dueDate),
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

  return (
    <div className="user-layout">
      <div className="user-layout__content">
        
        {/* Header Section */}
        <div className="user-section__header">
          <h2 className="user-section__title">
            <History size={24} color="var(--user-primary)" />
            Lịch sử đọc sách
          </h2>
        </div>
        
        {/* Main Card Container */}
        <div className="user-history__card">
          {loading && (
            <div className="user-state--loading">
              <p>⏳ Đang tải dữ liệu lịch sử...</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="user-state--error">
              {error}
            </div>
          )}
          
          {!loading && !error && history.length > 0 ? (
            <div className="user-history__wrapper">
              <table className="user-history__table">
                <thead>
                  <tr>
                    <th>Mã phiếu</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Ngày mượn</th>
                    <th>Trạng thái</th>
                    <th>Hạn trả</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      {/* Cột Mã phiếu */}
                      <td>
                        <span className="user-cell--code">{item.slipCode || "--"}</span>
                      </td>
                      
                      {/* Cột Tên sách */}
                      <td className="user-cell--title">{item.title}</td>
                      
                      {/* Cột Tác giả */}
                      <td className="user-cell--author">{item.author}</td>
                      
                      {/* Cột Ngày mượn */}
                      <td>{item.date}</td>
                      
                      {/* Cột Trạng thái */}
                      <td>
                        <span className={`user-badge ${getStatusClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      
                      {/* Cột Hạn trả (Tô đỏ nếu quá hạn) */}
                      <td className={isOverdue(item.dueDate) && !item.status.toUpperCase().includes("RETURN") ? "user-cell--danger" : ""}>
                        {item.dueDate || "(Không có)"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !loading && !error && (
              <div className="user-state--empty">
                <p>Bạn chưa có lịch sử mượn sách nào.</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
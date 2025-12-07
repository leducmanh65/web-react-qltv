import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { BookOpen, Users, FileText, TrendingUp, Loader2, RefreshCw } from "lucide-react";
import { getAllBooks, getAllUsers, getAllBorrowSlips } from "../api/apiService";
import type { Book, User, BorrowSlip } from "../hooks/useManagementHooks";
import "../styles/dashboard.css";

// --- Components ---
interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <div className="card stat-card">
    <div className="stat-icon-circle" style={{ background: `${color}15`, color: color }}>
      <Icon size={32} />
    </div>
    <div className="stat-content">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  </div>
);

// --- Helper: Lấy danh sách 7 ngày gần nhất (ngược lại từ hôm nay trở về trước) ---
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    // Sử dụng local date thay vì UTC để tránh lệch timezone
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD local
    const label = `${d.getDate()}/${d.getMonth() + 1}`; // DD/MM để hiển thị
    days.push({ dateStr, label });
  }
  return days;
};

// --- Main Component ---
export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    newBooksCount: 0
  });

  const [newBooksList, setNewBooksList] = useState<Book[]>([]);
  // State cho biểu đồ
  const [chartData, setChartData] = useState<{ label: string; count: number; height: number }[]>([]);
  // Hàm refresh data
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, usersRes, slipsRes] = await Promise.all([
          getAllBooks(),
          getAllUsers(),
          getAllBorrowSlips()
        ]);

        const books = (booksRes as unknown as Book[]) || [];
        const users = (usersRes as unknown as User[]) || [];
        const slips = (slipsRes as unknown as BorrowSlip[]) || [];

        // 1. Thống kê cơ bản
        const activeSlips = slips.filter((s: any) => s.status !== "RETURNED");
        const sortedBooks = [...books].sort((a, b) => b.id - a.id);

        // Lấy 10 cuốn để tính thống kê
        const recentStats = sortedBooks.slice(0, 10); 
        // Chỉ lấy 3 cuốn để hiển thị ra list
        const recentBooks = sortedBooks.slice(0, 3);  

        setStats({
          totalBooks: books.length,
          totalUsers: users.length,
          activeBorrows: activeSlips.length,
          newBooksCount: recentStats.length // Card sẽ hiện 10
        });

        setNewBooksList(recentBooks); // List chỉ hiện 3

        // 2. Xử lý dữ liệu Biểu đồ
        const borrowCounts: Record<string, number> = {};
        
        slips.forEach((slip: any) => {
          // Lấy ngày mượn từ chi tiết đầu tiên
          const detail = slip.details?.[0];
          if (detail && detail.borrowDate) {
            let dateStr = "";
            if (Array.isArray(detail.borrowDate)) {
              // Chuyển mảng [YYYY, MM, DD] thành chuỗi, cộng thêm 1 ngày để fix timezone
              const [y, m, d] = detail.borrowDate;
              const date = new Date(y, m - 1, d + 1); // Cộng 1 ngày để fix timezone issue
              const adjustedYear = date.getFullYear();
              const adjustedMonth = String(date.getMonth() + 1).padStart(2, '0');
              const adjustedDay = String(date.getDate()).padStart(2, '0');
              dateStr = `${adjustedYear}-${adjustedMonth}-${adjustedDay}`;
            } else {
              dateStr = String(detail.borrowDate).substring(0, 10);
            }
            borrowCounts[dateStr] = (borrowCounts[dateStr] || 0) + 1;
          }
        });

        // Map dữ liệu vào 7 ngày gần nhất
        const last7Days = getLast7Days();
        let maxVal = 0;
        
        // Bước 1: Tính count cho từng ngày và tìm max để chia tỷ lệ
        const tempChartData = last7Days.map(day => {
          const count = borrowCounts[day.dateStr] || 0;
          if (count > maxVal) maxVal = count;
          return { label: day.label, count };
        });

        // Bước 2: Tính chiều cao % (height)
        // Nếu maxVal = 0 (không có ai mượn) thì set height = 0
        const finalChartData = tempChartData.map(item => ({
          ...item,
          height: maxVal > 0 ? (item.count / maxVal) * 100 : 0
        }));

        setChartData(finalChartData);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refetchTrigger]);

  // Hàm refetch để có thể gọi từ bên ngoài
  const refetch = () => {
    setRefetchTrigger(prev => prev + 1);
  };

  // Tự động refresh mỗi 30 giây
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 30000); // 30 giây

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <Loader2 className="animate-spin" size={40} color="#2B3674" />
        <p className="loading-text">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div></div> {/* Spacer */}
        <button
          onClick={refetch}
          className="btn-secondary"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', padding: '8px 16px' }}
          disabled={loading}
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>
      <TopBar title="Dashboard" />

      {/* 1. Grid Thống Kê */}
      <div className="dashboard-stat-grid">
        <StatCard icon={BookOpen} label="Total Books" value={stats.totalBooks} color="#6A5AE0" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="#FF8F6B" />
        <StatCard icon={FileText} label="Active Borrows" value={stats.activeBorrows} color="#00C853" />
        <StatCard icon={TrendingUp} label="New Books" value={stats.newBooksCount} color="#2D9CDB" />
      </div>

      {/* 2. Grid Nội Dung */}
      <div className="dashboard-content-grid">
        
        {/* === BIỂU ĐỒ (Div ID=1) === */}
        <div className="card chart-card" id="1">
          <div className="chart-header">
            <h3 className="chart-title">Weekly Activity</h3>
            <p className="chart-subtitle">Borrowing statistics for the last 7 days</p>
          </div>

          <div className="bar-chart-container">
            {chartData.map((item, index) => (
              <div key={index} className="bar-group">
                {/* Số lượng hiện khi hover hoặc luôn hiện */}
                <div 
                  className="bar-value" 
                  style={{ opacity: item.count > 0 ? 1 : 0 }}
                >
                  {item.count}
                </div>
                
                {/* Cột biểu đồ */}
                <div 
                  className="bar" 
                  style={{ 
                    height: `${Math.max(item.height, 2)}%`, // Tối thiểu 2% để hiện vạch nếu là 0
                    backgroundColor: item.count > 0 ? '#4318FF' : '#E0E5F2' // Màu xám nếu là 0
                  }}
                ></div>
                
                {/* Nhãn ngày */}
                <div className="bar-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* New Books List Card */}
        <div className="card new-books-card">
          <h3 className="new-books-title">New Books</h3>
          <ul className="new-books-list">
            {newBooksList.length === 0 ? (
              <p className="no-books-message">No books found.</p>
            ) : (
              newBooksList.map((book) => (
                <li key={book.id} className="new-book-item">
                  <div className="book-cover-placeholder" style={{
                    background: `hsl(${(book.id * 50) % 360}, 70%, 80%)`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: '12px', height: '100%' }}>
                      {book.title.charAt(0)}
                    </div>
                  </div>
                  <div className="book-info">
                    <h5 className="book-title">{book.title}</h5>
                    <p className="book-author">
                      {book.authors && book.authors.length > 0
                        ? book.authors.map(a => a.authorName).join(", ")
                        : "Unknown Author"}
                    </p>
                    <div className="book-meta">
                      <span className="book-id">ID: {book.bookCode || book.id}</span>
                      <span className={`stock-info ${book.availableQuantity < 5 ? 'stock-low' : ''}`}>
                        Stock: {book.availableQuantity}
                      </span>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>

      </div>
    </div>
  );
}
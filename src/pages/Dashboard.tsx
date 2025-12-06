import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { BookOpen, Users, FileText, TrendingUp, Loader2 } from "lucide-react";
import { getAllBooks, getAllUsers, getAllBorrowSlips } from "../api/apiService";
import type { Book, User, BorrowSlip } from "../hooks/useManagementHooks";

// --- Components ---

// Card Thống kê nhỏ
interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <div className="card stat-card-body-lg">
    <div
      className="stat-icon-circle-lg"
      style={{
        background: `${color}15`,
        color: color
      }}
    >
      <Icon size={32} />
    </div>
    <div>
      <p className="stat-label">{label}</p>
      <h3 className="stat-value-lg">{value}</h3>
    </div>
  </div>
);

// --- Helper Functions ---

// Hàm tạo danh sách 7 ngày gần nhất định dạng DD/MM
const getLast7Days = () => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      fullDate: d.toISOString().split('T')[0], // YYYY-MM-DD
      label: `${d.getDate()}/${d.getMonth() + 1}` // DD/MM
    });
  }
  return days;
};

// --- Main Component ---

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // State lưu dữ liệu thống kê
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    activeBorrows: 0,
    newBooksCount: 0
  });

  // State lưu sách mới (top 3-5)
  const [newBooksList, setNewBooksList] = useState<Book[]>([]);

  // State dữ liệu biểu đồ
  const [chartData, setChartData] = useState<{ label: string; count: number; height: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Gọi song song 3 API để tiết kiệm thời gian
        const [booksRes, usersRes, slipsRes] = await Promise.all([
          getAllBooks(),
          getAllUsers(),
          getAllBorrowSlips()
        ]);

        const books = (booksRes as unknown as Book[]) || [];
        const users = (usersRes as unknown as User[]) || [];
        const slips = (slipsRes as unknown as BorrowSlip[]) || [];

        // 1. Xử lý số liệu tổng quan
        const activeSlips = slips.filter((s: any) => s.status !== "RETURNED");

        // Sắp xếp sách theo ID giảm dần (giả sử ID lớn là sách mới) để lấy sách mới
        // Nếu API có trường createdAt thì đổi logic sort theo createdAt
        const sortedBooks = [...books].sort((a, b) => b.id - a.id);
        const recentBooks = sortedBooks.slice(0, 5); // Lấy 5 sách mới nhất

        setStats({
          totalBooks: books.length,
          totalUsers: users.length,
          activeBorrows: activeSlips.length,
          newBooksCount: recentBooks.length // Hoặc số lượng sách nhập trong tháng này nếu muốn logic phức tạp hơn
        });

        setNewBooksList(recentBooks);

        // 2. Xử lý dữ liệu biểu đồ (Số lượng mượn theo 7 ngày gần nhất)
        const last7Days = getLast7Days();

        // Tạo map đếm số lượng mượn theo ngày
        const borrowCounts: Record<string, number> = {};

        slips.forEach((slip: any) => {
          // Giả sử detail đầu tiên chứa ngày mượn. 
          // API Java trả về mảng [YYYY, MM, DD] hoặc chuỗi ISO. Cần xử lý linh hoạt.
          const detail = slip.details?.[0];
          if (detail && detail.borrowDate) {
            let dateStr = "";
            if (Array.isArray(detail.borrowDate)) {
              // [2025, 5, 20] -> "2025-05-20"
              const [y, m, d] = detail.borrowDate;
              dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            } else {
              dateStr = String(detail.borrowDate).substring(0, 10);
            }

            if (borrowCounts[dateStr]) borrowCounts[dateStr]++;
            else borrowCounts[dateStr] = 1;
          }
        });

        // Map dữ liệu vào 7 ngày để vẽ biểu đồ
        let maxCount = 0;
        const chart = last7Days.map(day => {
          const count = borrowCounts[day.fullDate] || 0;
          if (count > maxCount) maxCount = count;
          return { label: day.label, count };
        });

        // Tính chiều cao cột % (để vẽ CSS)
        const finalChartData = chart.map(c => ({
          ...c,
          height: maxCount === 0 ? 0 : (c.count / maxCount) * 100
        }));

        setChartData(finalChartData);

      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="empty-state" style={{ height: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={40} color="#2B3674" />
        <p style={{ marginTop: 10, color: '#A3AED0' }}>Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      <TopBar title="Dashboard" />

      {/* 1. Grid Thống Kê */}
      <div className="dashboard-stat-grid">
        <StatCard icon={BookOpen} label="Total Books" value={stats.totalBooks} color="#6A5AE0" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="#FF8F6B" />
        <StatCard icon={FileText} label="Active Borrows" value={stats.activeBorrows} color="#00C853" />
        <StatCard icon={TrendingUp} label="New Books (Last Added)" value={stats.newBooksCount} color="#2D9CDB" />
      </div>

      {/* 2. Grid Nội Dung */}
      <div className="dashboard-content-grid">

        {/* Recent Activity Card (Custom CSS Chart) */}
        <div className="card chart-container" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: 'auto' }}>
            <h3 className="page-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
              Recent Borrowing Activity
            </h3>
            <p style={{ color: '#A3AED0', fontSize: '14px' }}>Number of books borrowed in the last 7 days</p>
          </div>

          {/* Biểu đồ cột đơn giản bằng CSS Flexbox */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            height: '200px',
            marginTop: '30px',
            borderBottom: '1px solid #E0E5F2',
            paddingBottom: '10px'
          }}>
            {chartData.map((data, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {/* Tooltip số lượng */}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: '#2B3674',
                  marginBottom: '6px',
                  opacity: data.count > 0 ? 1 : 0
                }}>
                  {data.count}
                </span>
                {/* Cột */}
                <div style={{
                  width: '30%',
                  maxWidth: '20px',
                  backgroundColor: '#4318FF',
                  borderRadius: '5px 5px 0 0',
                  height: `${Math.max(data.height, 2)}%`, // Tối thiểu 2% để hiện vạch nếu là 0
                  opacity: data.count === 0 ? 0.2 : 1,
                  transition: 'height 0.5s ease-in-out'
                }}></div>
                {/* Nhãn ngày */}
                <span style={{ marginTop: '10px', fontSize: '12px', color: '#A3AED0' }}>
                  {data.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* New Books List Card */}
        <div className="card" style={{ padding: '30px' }}>
          <h3 className="page-title" style={{ fontSize: '20px', marginBottom: '20px' }}>
            New Books
          </h3>
          <ul className="new-books-list">
            {newBooksList.length === 0 ? (
              <p style={{ color: '#A3AED0', fontStyle: 'italic' }}>No books found.</p>
            ) : (
              newBooksList.map((book) => (
                <li key={book.id} className="new-book-item">
                  {/* Placeholder cover màu ngẫu nhiên */}
                  <div className="book-cover-placeholder" style={{
                    background: `hsl(${(book.id * 50) % 360}, 70%, 80%)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 'bold', fontSize: '12px'
                  }}>
                    {book.title.charAt(0)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h5 className="book-title-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {book.title}
                    </h5>
                    <p className="book-author-sm">
                      {book.authors && book.authors.length > 0
                        ? book.authors.map(a => a.authorName).join(", ")
                        : "Unknown Author"}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                      <span style={{ fontSize: '11px', color: '#A3AED0' }}>ID: {book.bookCode || book.id}</span>
                      <span className={`stock-info ${book.availableQuantity < 5 ? 'stock-low' : ''}`} style={{ fontSize: '11px' }}>
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
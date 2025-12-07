import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { BookOpen, Users, FileText, TrendingUp, Loader2 } from "lucide-react";
import { getAllBooks, getAllUsers, getAllBorrowSlips } from "../api/apiService";
import type { Book, User, BorrowSlip } from "../hooks/useManagementHooks";
import "../styles/dashboard.css";

// --- Components ---

// Card Thống kê nhỏ
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

// Line Chart Component (SVG)
interface LineChartProps {
  data: { label: string; count: number }[];
}

const LineChart = ({ data }: LineChartProps) => {
  if (!data || data.length === 0) return <p>No data available</p>;

  // Dynamic width based on data length (responsive)
  const minWidth = 900;
  const pointSpacing = 55; // pixels per point
  const width = Math.max(minWidth, data.length * pointSpacing);
  const height = 300;
  const padding = { top: 30, right: 40, bottom: 50, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Tìm max count để scale
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  // Tính toạ độ các điểm
  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - (d.count / maxCount) * chartHeight;
    return { x, y, count: d.count, label: d.label };
  });

  // Tạo path string cho đường
  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' ');

  // Y-axis labels
  const yLabels = [0, Math.ceil(maxCount / 2), maxCount];

  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <svg width={width} height={height} style={{ minWidth: width, display: 'block' }}>
        {/* Grid background */}
        {yLabels.map((label, i) => {
          const y = padding.top + (i / (yLabels.length - 1)) * chartHeight;
          return (
            <g key={`grid-${i}`}>
              <line
                x1={padding.left}
                y1={y}
                x2={width - padding.right}
                y2={y}
                stroke="#E0E5F2"
                strokeDasharray="4,4"
                strokeWidth="1"
              />
              <text
                x={padding.left - 15}
                y={y + 5}
                textAnchor="end"
                fontSize="12"
                fill="#A3AED0"
              >
                {label}
              </text>
            </g>
          );
        })}

        {/* Axes */}
        <line 
          x1={padding.left} 
          y1={padding.top} 
          x2={padding.left} 
          y2={height - padding.bottom} 
          stroke="#2B3674" 
          strokeWidth="2" 
        />
        <line 
          x1={padding.left} 
          y1={height - padding.bottom} 
          x2={width - padding.right} 
          y2={height - padding.bottom} 
          stroke="#2B3674" 
          strokeWidth="2" 
        />

        {/* Line path */}
        <path
          d={pathData}
          fill="none"
          stroke="#4318FF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Area under line (gradient effect) */}
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4318FF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#4318FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`${pathData} L ${points[points.length - 1].x} ${height - padding.bottom} L ${points[0].x} ${height - padding.bottom} Z`}
          fill="url(#lineGradient)"
        />

        {/* Data points (circles) */}
        {points.map((p, i) => (
          <g key={`point-${i}`}>
            <circle cx={p.x} cy={p.y} r="5" fill="#fff" stroke="#4318FF" strokeWidth="2" />
            <circle cx={p.x} cy={p.y} r="10" fill="#4318FF" opacity="0.1" />
            <title>{`${p.label}: ${p.count} mượn`}</title>
          </g>
        ))}

        {/* X-axis labels */}
        {points.map((p, i) => (
          <text
            key={`label-${i}`}
            x={p.x}
            y={height - padding.bottom + 25}
            textAnchor="middle"
            fontSize="12"
            fill="#A3AED0"
          >
            {p.label}
          </text>
        ))}

        {/* Y-axis label */}
        <text
          x={-height / 2}
          y={20}
          textAnchor="middle"
          fontSize="12"
          fill="#A3AED0"
          transform="rotate(-90)"
        >
          Số lượng mượn
        </text>
      </svg>
    </div>
  );
};

// --- Helper Functions ---

// Hàm tạo danh sách 14 ngày gần nhất định dạng DD/MM
const getLast14Days = () => {
  const days = [];
  for (let i = 13; i >= 0; i--) {
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

        // 2. Xử lý dữ liệu biểu đồ (Số lượng mượn theo 14 ngày gần nhất)
        const last14Days = getLast14Days();

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

        // Map dữ liệu vào 14 ngày để vẽ biểu đồ
        let maxCount = 0;
        const chart = last14Days.map((day: any) => {
          const count = borrowCounts[day.fullDate] || 0;
          if (count > maxCount) maxCount = count;
          return { label: day.label, count };
        });

        // Nếu maxCount vẫn là 0, tạo fallback data cho demo
        if (maxCount === 0) {
          console.warn("No borrow data found. Using demo data.");
          const demoData = [0, 1, 2, 3, 5, 4, 6, 8, 10, 7, 5, 3, 2, 1];
          maxCount = 10;
          chart.forEach((c: any, i: number) => {
            c.count = demoData[i];
          });
        }

        // Tính chiều cao cột % (để vẽ CSS)
        const finalChartData = chart.map((c: any) => ({
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
      <div className="loading-container">
        <Loader2 className="animate-spin" size={40} color="#2B3674" />
        <p className="loading-text">Loading Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
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

        {/* Trend Line Chart */}
        <div className="card chart-card">
          <div className="chart-header">
            <h3 className="chart-title">Borrowing Trend (Last 14 Days)</h3>
            <p className="chart-subtitle">Number of books borrowed over time</p>
          </div>
          <div className="chart-content">
            <LineChart data={chartData.map(d => ({ label: d.label, count: d.count }))} />
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
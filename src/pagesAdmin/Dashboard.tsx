import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import { BookOpen, Users, FileText, TrendingUp, Loader2, Calendar } from "lucide-react";
import { getAllBooks, getAllUsers, getBorrowSlipsByCreatedAt } from "../api/apiService";
import type { Book, User, BorrowSlip } from "../hooks/useManagementHooks";
import "../styles/Admin/dashboard.css";

// --- Components ---
interface StatCardProps {
  icon: any;
  label: string;
  value: string | number;
  color: string;
  background: string;
}

const StatCard = ({ icon: Icon, label, value, color, background }: StatCardProps) => (
  <div className="card stat-card" style={{background : background}}>
    <div className="stat-icon-circle" style={{ background: `${color}15`, color: color }}>
      <Icon size={32} />
    </div>
    <div className="stat-content">
      <p className="stat-label" style={{ background: `${color}15`, color: color }}>{label}</p>
      <h3 className="stat-value" style={{ background: `${color}15`, color: color }}>{value}</h3>
    </div>
  </div>
);

// --- Helper: Lấy danh sách ngày (7 ngày hoặc 30 ngày) ---
const getDateRange = (days: number) => {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    result.push({
      dateStr: d.toISOString().split('T')[0], // YYYY-MM-DD
      label: `${d.getDate()}/${d.getMonth() + 1}` // DD/MM
    });
  }
  return result;
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
  const [chartPeriod, setChartPeriod] = useState<'week' | 'month'>('week');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [booksRes, usersRes] = await Promise.all([
          getAllBooks(),
          getAllUsers()
        ]);

        const books = (booksRes as unknown as Book[]) || [];
        const users = (usersRes as unknown as User[]) || [];

        const sortedBooks = [...books].sort((a, b) => b.id - a.id);
        const recentStats = sortedBooks.slice(0, 10); 
        const recentBooks = sortedBooks.slice(0, 3);  

        // Fetch borrow slips count for active borrows
        const todayStr = new Date().toISOString().split('T')[0];
        let activeBorrowsCount = 0;
        try {
          const todaySlips: any = await getBorrowSlipsByCreatedAt(todayStr);
          const slips = todaySlips?.data || todaySlips || [];
          activeBorrowsCount = slips.filter((s: any) => s.status !== "RETURNED").length;
        } catch (err) {
          console.warn("Could not fetch active borrows", err);
        }

        setStats({
          totalBooks: books.length,
          totalUsers: users.length,
          activeBorrows: activeBorrowsCount,
          newBooksCount: recentStats.length
        });

        setNewBooksList(recentBooks);

        // 2. Fetch chart data using getBorrowSlipsByCreatedAt for each date
        const daysCount = chartPeriod === 'week' ? 7 : 30;
        const dateRange = getDateRange(daysCount);
        const borrowCounts: Record<string, number> = {};

        await Promise.all(
          dateRange.map(async (day) => {
            try {
              const res: any = await getBorrowSlipsByCreatedAt(day.dateStr);
              const slips = res?.data || res || [];
              borrowCounts[day.dateStr] = slips.length;
            } catch (err) {
              borrowCounts[day.dateStr] = 0;
            }
          })
        );

        let maxVal = 0;
        const tempChartData = dateRange.map(day => {
          const count = borrowCounts[day.dateStr] || 0;
          if (count > maxVal) maxVal = count;
          return { label: day.label, count };
        });

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
  }, [chartPeriod]);

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
        <StatCard icon={BookOpen} label="Total Books" value={stats.totalBooks} color="#ffffffff"   background="linear-gradient(to right, #d64192, #a87fc7)" />
        <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="#ffffffff" 
        background="linear-gradient(to right, #946dbe, #926bbc)"/>
        <StatCard icon={FileText} label="Active Borrows" value={stats.activeBorrows} color="#ffffffff"
        background="linear-gradient(to right, #9fdfed,  #8fb5db)" />
        <StatCard icon={TrendingUp} label="New Books" value={stats.newBooksCount} color="#ffffffff" 
        background="linear-gradient(to right, #f7d085, #ef8664)"/>
      </div>

      {/* 2. Grid Nội Dung */}
      <div className="dashboard-content-grid">
        
        {/* === BIỂU ĐỒ (Div ID=1) === */}
        <div className="card chart-card" id="1" style={{background : "#ffffff", border: "1px solid #0048ff"}}>
          <div className="chart-header">
            <div>
              <h3 className="chart-title">{chartPeriod === 'week' ? 'Weekly' : 'Monthly'} Activity</h3>
              <p className="chart-subtitle">Borrowing statistics for the last {chartPeriod === 'week' ? '7 days' : '30 days'}</p>
            </div>
            <button 
              className="btn-toggle-period"
              onClick={() => setChartPeriod(prev => prev === 'week' ? 'month' : 'week')}
            >
              <Calendar size={16} />
              {chartPeriod === 'week' ? 'View Month' : 'View Week'}
            </button>
          </div>

          <div className="bar-chart-container">
            {chartData.map((item, index) => (
              <div key={index} className="bar-group">
                {/* Số lượng hiện khi hover hoặc luôn hiện */}
                <div className={`bar-value ${item.count > 0 ? 'visible' : 'hidden'}`}>
                  {item.count}
                </div>
                
                {/* Cột biểu đồ */}
                <div 
                  className={`bar ${item.count > 0 ? 'bar-active' : 'bar-empty'}`}
                  style={{ height: `${Math.max(item.height, 2)}%` }}
                ></div>
                
                {/* Nhãn ngày */}
                <div className="bar-label">{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* New Books List Card */}
        <div className="card new-books-card" style={{background : "#ffffff", border: "1px solid #0048ff"}}>
          <h3 className="new-books-title">New Books</h3>
          <ul className="new-books-list">
            {newBooksList.length === 0 ? (
              <p className="no-books-message">No books found.</p>
            ) : (
              newBooksList.map((book) => (
                <li key={book.id} className="new-book-item" style={{ background: `hsl(${(book.id * 50) % 360}, 70%, 80%)` }}>
                  <div 
                    className="book-cover-placeholder" 
                    
                  >
                    <div className="book-cover-initial">
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
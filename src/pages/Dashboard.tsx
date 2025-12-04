import TopBar from "../components/TopBar";
import { BookOpen, Users, FileText, TrendingUp } from "lucide-react";

// Định nghĩa kiểu dữ liệu cho Props (Optional nhưng tốt cho code)
interface StatCardProps {
  icon: any;
  label: string;
  value: string;
  color: string;
}

const StatCard = ({ icon: Icon, label, value, color }: StatCardProps) => (
  <div className="card stat-card-body-lg">
    <div 
      className="stat-icon-circle-lg"
      style={{ 
        background: `${color}15`, // Giữ lại inline style vì màu này động theo props
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

export default function Dashboard() {
  return (
    <div style={{ width: '100%' }}>
      <TopBar title="Dashboard" />
      
      {/* 1. Grid Thống Kê */}
      <div className="dashboard-stat-grid">
        <StatCard icon={BookOpen} label="Total Books" value="1,250" color="#6A5AE0" />
        <StatCard icon={Users} label="Total Users" value="324" color="#FF8F6B" />
        <StatCard icon={FileText} label="Active Borrows" value="89" color="#00C853" />
        <StatCard icon={TrendingUp} label="New Books" value="12" color="#2D9CDB" />
      </div>

      {/* 2. Grid Nội Dung (Biểu đồ & Sách mới) */}
      <div className="dashboard-content-grid">
        
        {/* Recent Activity Card */}
        <div className="card chart-container">
          <h3 className="page-title" style={{ fontSize: '20px', marginBottom: '30px' }}>
            Recent Borrowing Activity
          </h3>
          <div className="chart-placeholder">
            (Chart area for GET /api/borrowSlips/createdAt)
          </div>
        </div>

        {/* New Books Card */}
        <div className="card" style={{ padding: '30px' }}>
          <h3 className="page-title" style={{ fontSize: '20px', marginBottom: '30px' }}>
            New Books
          </h3>
          <ul className="new-books-list">
            {[1, 2, 3].map((i) => (
              <li key={i} className="new-book-item">
                <div className="book-cover-placeholder"></div>
                <div>
                  <h5 className="book-title-sm">Design System</h5>
                  <p className="book-author-sm">Author Name</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}
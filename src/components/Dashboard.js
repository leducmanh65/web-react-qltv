import React, { useState, useEffect } from 'react';
import { getBooks, getUsers, getBorrowSlips } from '../services/api';
import '../styles/Dashboard.css';

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [books, users, slips] = await Promise.all([
        getBooks(),
        getUsers(),
        getBorrowSlips()
      ]);

      const totalBooks = books.reduce((sum, book) => sum + book.quantity, 0);
      const lateSlips = slips.filter(s => s.status === 'late').length;
      const borrowing = slips.filter(s => s.status === 'borrowing').length;

      setStats({
        totalBooks,
        totalUsers: users.length,
        borrowToday: borrowing,
        lateReturns: lateSlips
      });
    } catch (err) {
      console.error('Lỗi khi tải thống kê:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="dashboard-loading">Đang tải dữ liệu...</div>;
  }

  if (!stats) {
    return <div className="dashboard-loading">Không thể tải dữ liệu</div>;
  }

  const statCards = [
    {
      title: 'Tổng số sách',
      value: stats.totalBooks,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      ),
      color: 'blue'
    },
    {
      title: 'Người dùng',
      value: stats.totalUsers,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
      ),
      color: 'green'
    },
    {
      title: 'Đang mượn',
      value: stats.borrowToday,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
        </svg>
      ),
      color: 'purple'
    },
    {
      title: 'Trễ hạn',
      value: stats.lateReturns,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      ),
      color: 'red'
    }
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-welcome">
        Xin chào, {user.fullName}!
      </h2>

      <div className="dashboard-stats">
        {statCards.map((card, index) => (
          <div key={index} className={`stat-card ${card.color}`}>
            <div className="stat-card-content">
              <div className="stat-card-info">
                <h3>{card.title}</h3>
                <p>{card.value}</p>
              </div>
              <div className="stat-card-icon">
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
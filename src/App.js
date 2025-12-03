import React, { useState } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import BookManagement from './components/BookManagement';
import BorrowManagement from './components/BorrowManagement';
import UserManagement from './components/UserManagement';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      setUser(null);
      setCurrentPage('dashboard');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user} />;
      case 'books':
        return <BookManagement user={user} />;
      case 'borrow':
        return <BorrowManagement user={user} />;
      case 'users':
        return <UserManagement user={user} />;
      default:
        return <Dashboard user={user} />;
    }
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return 'Trang chủ';
      case 'books':
        return 'Quản lý sách';
      case 'borrow':
        return 'Mượn/Trả sách';
      case 'users':
        return 'Quản lý người dùng';
      default:
        return 'Trang chủ';
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app-container">
      <Sidebar
        user={user}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      />
      <div className="app-main">
        <div className="app-header">
          <h2 className="app-header-title">{getPageTitle()}</h2>
        </div>
        <div className="app-content">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}

export default App;
import React from 'react';
import './TopNavbar.css';

interface TopNavbarProps {
  onToggleMenu?: () => void;
  onToggleCart?: () => void;
  onToggleProfile?: () => void;
}

const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMenu, onToggleCart, onToggleProfile }) => {
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('currentUser') || 'null') : null;
  const cart: Array<{ quantity?: number }> = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('cart') || '[]') : [];
  const cartCount = cart.reduce((s, item) => s + (item.quantity || 1), 0);

  return (
    <header className="top-navbar">
      <div className="navbar-left"></div>
      <div className="navbar-center">
        <h2 className="page-title">Thư Viện Online</h2>
      </div>
      <div className="navbar-right">
        <button className="icon-btn" title="Giỏ mượn" onClick={onToggleCart}>
          🧺
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </button>
        <button className="icon-btn" title="Thông báo">🔔</button>
        <button className="icon-btn" title="Cài đặt">⚙️</button>
        <div className="divider"></div>
        <button
          className="user-btn"
          title="Hồ sơ"
          onClick={(e) => {
            e.stopPropagation();
            onToggleProfile && onToggleProfile();
          }}
        >
          <div className="user-avatar-small">{user ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          <span className="user-name-short">{user ? user.name.split(' ')[0] : 'User'}</span>
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;


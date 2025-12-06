import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Repeat,
  Users,
  Library,
  LogOut
} from "lucide-react";

import { Tablet } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();

  const handleLogout = () => {
    try {
      localStorage.removeItem('accessToken');
      window.location.href = '/auth';
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const menuItems = [
    {
      path: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={20} />
    },
    {
      path: "/admin/books",
      label: "Book Management",
      icon: <BookOpen size={20} />
    },
    {
      path: "/admin/ebooks",
      label: "Ebook Management",
      icon: <Tablet size={20} />
    },
    {
      path: "/admin/circulation",
      label: "Circulation",
      icon: <Repeat size={20} />
    },
    {
      path: "/admin/users",
      label: "User Management",
      icon: <Users size={20} />
    },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-box">
          <Library color="#fff" size={28} />
        </div>
        <h1 className="logo-text">LMS Admin</h1>
      </div>

      <div className="sidebar-divider">MENU</div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          // Logic kiểm tra active: Chính xác
          const isActive = location.pathname === item.path ||
            (item.path !== "/" && location.pathname.startsWith(item.path));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive ? "active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {/* Vạch sáng bên phải khi active */}
              {isActive && <div className="active-bar"></div>}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer" style={{ display: 'flex', justifyContent: 'center', padding: '20px 0' }}>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
}
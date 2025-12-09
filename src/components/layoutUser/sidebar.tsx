import React from "react";
import { Home, History, BookOpen, Settings, Library } from "lucide-react";
import "../../styles/User/sidebar.css";

type NavigateHandler = (page: string, id?: string) => void;

interface SidebarProps {
  onNavigate?: NavigateHandler;
  activePage?: string;
}

const NAV_ITEMS = [
  { icon: <Home size={22} />, label: "Trang chủ", page: "home" },
  { icon: <History size={22} />, label: "Lịch sử mượn", page: "history" },
  { icon: <BookOpen size={22} />, label: "Đọc Ebook", page: "ebook-history" },
  { icon: <Settings size={22} />, label: "Cài đặt", page: "settings" },
];

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage }) => {
  return (
    <aside className="user-sidebar">
      {/* Logo Area */}
      <div 
        className="user-sidebar-header"
        onClick={() => onNavigate?.("home")}
      >
        <div className="user-sidebar-logo">
          <Library size={24} color="#fff" />
        </div>
        <span className="user-logo-text">LMS BookClub</span>
      </div>

      {/* Navigation */}
      <nav className="user-sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const isActive = activePage ? activePage === item.page : item.page === "home";

          return (
            <button
              key={item.page}
              className={`user-nav-item ${isActive ? "active" : ""}`}
              type="button"
              onClick={() => onNavigate?.(item.page)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Footer / Logout button (Optional) */}
      <div className="user-sidebar-footer">
        <p>© 2024 LMS BookClub</p>
      </div>
    </aside>
  );
};

export default Sidebar;
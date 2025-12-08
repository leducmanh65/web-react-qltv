import React from "react";
import "../../styles/User/sidebar.css";

type NavigateHandler = (page: string, id?: string) => void;

interface SidebarProps {
  onNavigate?: NavigateHandler;
  activePage?: string;
}

// Đã thêm mục History vào đây
const NAV_ITEMS = [
  { icon: "🏠", label: "Home", page: "home" },
  { icon: "🕒", label: "History", page: "history" }, // <-- Nút Lịch sử mới
  { icon: "⚙️", label: "Settings", page: "settings" },
  { icon: "🔍", label: "Search", page: "search" },
  { icon: "❓", label: "Help", page: "help" },
];

export const Sidebar: React.FC<SidebarProps> = ({ onNavigate, activePage }) => {
  return (
    <aside className="user-sidebar">
      <nav className="user-sidebar-nav">
        <div 
          className="user-sidebar-logo" 
          onClick={() => onNavigate?.("home")} 
          role="button" 
          tabIndex={0} 
          onKeyDown={(e) => e.key === "Enter" && onNavigate?.("home")}
        >
          <div className="logo-text">R</div>
        </div>

        {NAV_ITEMS.map((item) => {
          // Kiểm tra activePage khớp với item.page
          const isActive = activePage ? activePage === item.page : item.page === "home";

          return (
            <button
              key={item.page}
              className={`user-nav-item ${isActive ? "active" : ""}`}
              title={item.label}
              type="button"
              onClick={() => onNavigate?.(item.page)}
            >
              {item.icon}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
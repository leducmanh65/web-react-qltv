import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

type NavItem = { id: string; label: string; icon: string; path: string };

const navItems: NavItem[] = [
    // Giữ lại một mục chính, bỏ các mục không dùng
    { id: 'home', label: 'Trang chủ', icon: '🏠', path: '/dashboard' },
];

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <aside className="fixed left-0 top-0 h-screen w-20 bg-white shadow-soft flex flex-col items-center py-8 gap-6 z-10">
            <div className="w-10 h-10 rounded-xl bg-primary-orange text-white font-bold text-lg flex items-center justify-center">
                R
            </div>
            <div className="flex flex-col gap-4 flex-1 justify-start pt-4">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <button
                            key={item.id}
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg transition-all ${active
                                ? 'bg-primary-orange text-white shadow-light'
                                : 'text-gray-500 hover:bg-gray-100'
                                }`}
                            aria-label={item.label}
                            onClick={() => navigate(item.path)}
                        >
                            <span aria-hidden>{item.icon}</span>
                        </button>
                    );
                })}
            </div>
            {/* Footer trống sau khi bỏ các icon không cần thiết */}
        </aside>
    );
};

export default Sidebar;

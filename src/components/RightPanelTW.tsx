import React from 'react';
import RecentlyReadCard from './RecentlyReadCardTW';
import { Book, User } from '../types';

type PanelBook = Book & { image?: string; author?: string; category?: string; reviews?: number };

export interface RightPanelProps {
    user?: (User & { username?: string; role?: string }) | null;
    recentlyReadData?: PanelBook[];
    wishListData?: PanelBook[];
    onOpenFavorites?: () => void;
    onOpenUser?: () => void;
    onOpenCart?: () => void;
    onRequestLogin?: () => void;
    onLogout?: () => void;
    authStatus?: 'idle' | 'loading' | 'authenticated' | 'error';
}

export const RightPanel: React.FC<RightPanelProps> = ({ user, recentlyReadData = [], wishListData = [], onOpenFavorites, onOpenUser, onOpenCart, onRequestLogin, onLogout, authStatus }) => {
    const isLoggedIn = Boolean(user);
    return (
        <aside className="fixed right-0 top-0 w-[320px] h-screen bg-white p-5 overflow-y-auto text-gray-900 shadow-soft border-l border-orange-50 scroll-thin">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-3 group"
                        onClick={onOpenUser}
                        title="Thông tin người dùng"
                    >
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-lg font-bold text-primary-orange group-hover:shadow-light">
                            {(user?.name || user?.username || 'K').charAt(0).toUpperCase()}
                        </div>
                        <div className="text-left">
                            <h3 className="text-sm font-bold">{user?.name || user?.username || 'Khách'}</h3>
                            <p className="text-xs text-gray-500">{user?.email || 'Chạm để xem chi tiết'}</p>
                        </div>
                    </button>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        className="w-9 h-9 bg-gray-100 hover:bg-orange-50 text-gray-600 rounded-xl flex items-center justify-center"
                        onClick={onOpenFavorites}
                        title="Xem yêu thích"
                    >
                        ❤️
                    </button>
                    <button
                        className="w-9 h-9 bg-gray-100 hover:bg-orange-50 text-gray-600 rounded-xl flex items-center justify-center"
                        title="Giỏ mượn"
                        onClick={onOpenCart}
                    >
                        🛍️
                    </button>
                    <button
                        className={`px-3 h-9 rounded-xl text-xs font-semibold transition-all ${isLoggedIn ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-primary-orange text-white hover:opacity-90'}`}
                        onClick={isLoggedIn ? onLogout : onRequestLogin}
                        title={isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}
                        disabled={authStatus === 'loading'}
                    >
                        {authStatus === 'loading' ? 'Đang xử lý...' : isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-gray-700">Đang đọc / mới mượn</h4>
                    <button className="text-xs text-gray-500 hover:text-primary-orange">Xem tất cả</button>
                </div>
                <div className="space-y-2">
                    {recentlyReadData.map((book) => (
                        <RecentlyReadCard key={book.id} book={book} />
                    ))}
                </div>
            </div>

            <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="flex justify-between items-center mb-3">
                    <h4 className="text-xs font-bold text-gray-700">Danh sách muốn mượn</h4>
                    <button className="text-xs text-gray-500 hover:text-primary-orange">Xem tất cả</button>
                </div>
                <div className="space-y-2">
                    {wishListData.map((book) => (
                        <div key={book.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl hover:bg-orange-50 transition-all">
                            <img
                                src={book.image || book.imageUrl}
                                alt={book.title}
                                className="w-12 h-16 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-gray-900 truncate leading-tight">{book.title}</h5>
                                <p className="text-[11px] text-gray-600 truncate leading-tight">{book.author}</p>
                                <p className="text-[11px] text-gray-500 truncate leading-tight">{book.category}</p>
                            </div>
                            <button className="text-gray-400 hover:text-primary-orange flex-shrink-0 text-sm">⋮</button>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RightPanel;

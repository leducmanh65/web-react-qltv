import React from 'react';
import { Book, User } from '../../types';

export interface RightProfilePanelProps {
    user?: User | null;
    visible: boolean;
    onClose?: () => void;
}

const RightProfilePanel: React.FC<RightProfilePanelProps> = ({ user, visible, onClose }) => {
    const u = user || JSON.parse(localStorage.getItem('currentUser') || 'null');

    const getRecentlyRead = (): Book[] => {
        const books = JSON.parse(localStorage.getItem('books') || '[]');
        return Array.isArray(books) ? books.slice(0, 3) : [];
    };

    const getWishlist = (): Book[] => {
        const books = JSON.parse(localStorage.getItem('books') || '[]');
        return Array.isArray(books) ? books.slice(3, 6) : [];
    };

    if (!visible) return null;

    const recentBooks = getRecentlyRead();
    const wishBooks = getWishlist();

    return (
        <aside className="right-panel right-panel-visible">
            <button className="close-btn" onClick={onClose}>✕</button>

            <div className="profile-card">
                <div className="avatar">{u && u.name ? u.name.charAt(0).toUpperCase() : 'U'}</div>
                <h3>{u ? u.name : 'Khách'}</h3>
                <p className="muted">{u ? u.email : 'Chưa đăng nhập'}</p>
            </div>

            <div className="profile-actions">
                <button className="btn-edit" onClick={() => window.location.href = '/profile'}>Hồ sơ</button>
                <button className="btn-add-book" onClick={() => window.location.href = '/user'}>Khoản mượn</button>
                <button className="btn-cancel" onClick={() => { localStorage.removeItem('currentUser'); window.location.href = '/login'; }}>Đăng xuất</button>
            </div>

            <div className="panel-section">
                <div className="section-header">
                    <h4>Recently Read</h4>
                    <button type="button" className="view-all" onClick={() => window.location.href = '/books'}>View All</button>
                </div>
                <div className="recent-books">
                    {recentBooks.map((book) => (
                        <div key={book.id} className="recent-book-item">
                            <div className="recent-book-cover">
                                {book.imageUrl ? (
                                    <img src={book.imageUrl} alt={book.title} />
                                ) : (
                                    <div className="book-placeholder">📖</div>
                                )}
                            </div>
                            <div className="recent-book-info">
                                <h5>{book.title}</h5>
                                <p className="chapter-text">Chapter V: The day that will never end...</p>
                                <div className="progress-bar">
                                    <div className="progress" style={{ width: '72%' }}></div>
                                </div>
                                <span className="progress-text">72%</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="panel-section">
                <div className="section-header">
                    <h4>Wish List</h4>
                    <button type="button" className="view-all" onClick={() => window.location.href = '/books'}>View All</button>
                </div>
                <div className="wishlist-books">
                    {wishBooks.map((book) => (
                        <div key={book.id} className="wishlist-item">
                            <div className="wishlist-cover">
                                {book.imageUrl ? (
                                    <img src={book.imageUrl} alt={book.title} />
                                ) : (
                                    <div className="book-placeholder">📖</div>
                                )}
                            </div>
                            <div className="wishlist-info">
                                <h5>{book.title}</h5>
                                <p className="wishlist-author">{book.author}</p>
                                <p className="wishlist-category">Novel · Bestseller</p>
                                <div className="wishlist-rating">
                                    <span>⭐⭐⭐⭐ (411)</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
};

export default RightProfilePanel;

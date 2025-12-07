import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import { initializeSampleData } from '../data/sampleBooks';
import { Book } from '../types';

const UserProfile: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [categories, setCategories] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('All');

    useEffect(() => {
        initializeSampleData();

        const savedBooks = localStorage.getItem('books');
        if (savedBooks) {
            const booksData = JSON.parse(savedBooks);
            setBooks(booksData);
            setFilteredBooks(booksData);
        }
    }, []);

    useEffect(() => {
        const cats = Array.from(new Set(books.map((b) => (b as any).category).filter(Boolean)));
        setCategories(['All', ...cats]);
    }, [books]);

    useEffect(() => {
        const filtered = books.filter((book: any) => {
            const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.author || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (book.category || '').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
        setFilteredBooks(filtered);
    }, [searchTerm, books, selectedCategory]);

    return (
        <div className="user-profile-container">
            <div className="user-profile-header">
                <h1>📚 Thư Viện Online</h1>
            </div>

            <div className="category-bar">
                {categories.map((c) => (
                    <button
                        key={c}
                        className={`category-chip ${selectedCategory === c ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(c)}
                    >
                        {c}
                    </button>
                ))}
            </div>

            <div className="search-and-action">
                <div className="search-box">
                    <input
                        type="text"
                        placeholder="🔍 Tìm kiếm theo tên sách, tác giả, thể loại..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input"
                    />
                </div>
                <div className="action-buttons">
                    <div className="view-toggle">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            title="Grid View"
                        >
                            ⊞ Grid
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            title="List View"
                        >
                            ☰ List
                        </button>
                    </div>
                </div>
            </div>

            <div className="books-section">
                <div className="books-header">
                    <h2>Sách Trong Thư Viện ({filteredBooks.length})</h2>
                </div>

                {filteredBooks.length === 0 ? (
                    <div className="empty-state">
                        <p>📭 Không có sách nào phù hợp với tìm kiếm của bạn.</p>
                    </div>
                ) : (
                    <>
                        <div className={`books-${viewMode}`}>
                            {filteredBooks.map((book: any) => (
                                <div key={book.id} className={`book-card book-card-${viewMode}`}>
                                    <div className="book-image-wrapper">
                                        {book.imageUrl ? (
                                            <img src={book.imageUrl} alt={book.title} className="book-image" />
                                        ) : (
                                            <div className="book-image-placeholder">
                                                <span>📖</span>
                                            </div>
                                        )}
                                        <div className="book-badge">{book.category}</div>
                                    </div>

                                    <div className="book-content">
                                        <h3 className="book-title">{book.title}</h3>
                                        <p className="book-author">{book.author}</p>
                                        {book.publishYear && (
                                            <p className="book-year">Year: {book.publishYear}</p>
                                        )}
                                        <p className="book-quantity">
                                            Copies: <strong>{book.quantity}</strong>
                                        </p>
                                        {book.description && (
                                            <p className="book-description">{book.description}</p>
                                        )}
                                    </div>

                                    <div className="book-actions">
                                        <button
                                            onClick={() => window.location.href = `/book/${book.id}`}
                                            className="btn-view"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;

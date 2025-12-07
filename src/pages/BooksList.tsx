import React, { useEffect, useState } from 'react';
import { Book } from '../types';
import BorrowModal from '../components/borrow/BorrowModal';
import '../styles/bookslist.css';
import { getBookById, getBooksPage, searchBooks, createBorrowSlip } from '../services/api';
import { getStoredUser } from '../services/auth';

const BooksList: React.FC = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [query, setQuery] = useState<string>('');
    const [borrowBook, setBorrowBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async (search?: string) => {
        setLoading(true);
        setError(null);
        try {
            let data: any;
            if (search && search.trim()) {
                data = await searchBooks(search.trim());
            } else {
                data = await getBooksPage(1);
            }
            const raw = Array.isArray(data?.content) ? data.content : Array.isArray(data) ? data : [];
            const list = raw.map((b: any) => ({
                ...b,
                category: b.category?.categoryName || b.category,
                author: Array.isArray(b.authors) && b.authors.length ? b.authors[0].authorName : b.author,
                quantity: b.availableQuantity ?? b.totalQuantity ?? b.quantity,
                image: (b.imageUrl || b.image) ?? b.coverImage,
            }));
            setBooks(list as Book[]);
            localStorage.setItem('books', JSON.stringify(list));
        } catch (err: any) {
            setError(err?.message || 'Không tải được danh sách sách');
            const saved = JSON.parse(localStorage.getItem('books') || '[]');
            setBooks(Array.isArray(saved) ? saved : []);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filtered = books.filter((b: Book) =>
        b.title.toLowerCase().includes(query.toLowerCase()) ||
        (b.author || '').toLowerCase().includes(query.toLowerCase()) ||
        (b.category || '').toLowerCase().includes(query.toLowerCase())
    );

    const handleView = (id: string | number) => {
        window.location.href = `/books/${id}`;
    };

    const handleBorrow = (book: Book) => {
        setBorrowBook(book);
    };

    const addToCart = (book: Book) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((i: any) => i.bookId === book.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            cart.push({ bookId: book.id, title: book.title, author: book.author, imageUrl: (book as any).imageUrl, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm vào giỏ');
    };

    const confirmBorrow = async (days: number) => {
        const user = getStoredUser() || JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user || !borrowBook) {
            alert('Vui lòng đăng nhập trước khi mượn.');
            window.location.href = '/login';
            return;
        }

        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + days);

        try {
            await createBorrowSlip({
                readerId: user.id,
                note: '',
                details: [{ bookId: borrowBook.id, dueDate: dueDate }],
            });
            alert('Mượn sách thành công!');
            setBorrowBook(null);
            fetchBooks(query);
            window.location.href = '/user';
        } catch (err) {
            // Fallback local
            const loans = JSON.parse(localStorage.getItem('loans') || '[]');
            const loan = { id: Date.now(), bookId: borrowBook.id, userId: user.id, borrowedAt: new Date().toISOString(), dueDate: dueDate.toISOString(), returned: false };
            loans.push(loan);
            localStorage.setItem('loans', JSON.stringify(loans));

            const all = JSON.parse(localStorage.getItem('books') || '[]');
            const updated = all.map((b: any) => b.id === borrowBook.id ? { ...b, quantity: Number(b.quantity) - 1 } : b);
            localStorage.setItem('books', JSON.stringify(updated));
            setBooks(updated);
            setBorrowBook(null);
            alert('Mượn sách (local)');
            window.location.href = '/user';
        }
    };

    return (
        <div className="books-page">
            <div className="books-banner">
                <h1>Thư Viện Online</h1>
                <div className="banner-preview" />
            </div>

            <div className="category-chips">
                {['All', 'Tiểu thuyết', 'Tự truyện', 'Khoa học', 'Truyện tranh', 'Lịch sử'].map((c, idx) => (
                    <button key={c} className={`chip ${idx === 0 ? 'active' : ''}`}>{c}</button>
                ))}
            </div>

            <div className="search-row">
                <input
                    className="search-input"
                    placeholder="🔍 Tìm kiếm theo tên sách, tác giả, thể loại..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') fetchBooks(query); }}
                />
                <button className="view-btn primary" onClick={() => fetchBooks(query)}>Tìm</button>
                <button className="view-btn" onClick={() => { setQuery(''); fetchBooks(''); }}>Reset</button>
            </div>

            <div className="content-card">
                <h3>Sách Trong Thư Viện ({filtered.length})</h3>
                {loading && <div style={{ marginTop: 8 }}>Đang tải...</div>}
                {error && <div style={{ marginTop: 8, color: 'red' }}>{error}</div>}
                <div className="separator" />
                <div className="book-grid">
                    {filtered.map((b: Book) => (
                        <div key={b.id} className="book-card-wrapper">
                            <div className="book-badge">{b.category || 'Tiểu thuyết'}</div>
                            <div className="book-card">
                                <img className="img" src={(b as any).image || ''} alt={b.title} />
                                <div className="meta">
                                    <div className="title">{b.title}</div>
                                    <div className="author">{b.author}</div>
                                    <div className="price">{(b as any).price} <span className="oldprice">{(b as any).oldPrice}</span></div>
                                </div>
                                <div className="actions" style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                    <button className="btn-add-book" onClick={() => handleView(b.id)}>Xem</button>
                                    <button className="btn-add-book" onClick={() => handleBorrow(b)} disabled={Number((b as any).quantity) <= 0}>Mượn</button>
                                    <button className="btn-add-book" onClick={() => addToCart(b)} disabled={Number((b as any).quantity) <= 0}>Thêm giỏ</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {borrowBook && <BorrowModal book={borrowBook} onClose={() => setBorrowBook(null)} onConfirm={confirmBorrow} />}
        </div>
    );
};

export default BooksList;

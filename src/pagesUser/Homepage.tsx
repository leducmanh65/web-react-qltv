import React from "react";
import "../styles/User/landing.css";

// Dummy icon components (giữ nhẹ, không phụ thuộc lib ngoài)
const IconCart = () => <span aria-hidden>🛒</span>;
const IconUser = () => <span aria-hidden>👤</span>;
const IconLogin = () => <span aria-hidden>🔑</span>;
const IconFilter = () => <span aria-hidden>▾</span>;
const IconStar = () => <span aria-hidden>★</span>;

type Book = {
    id: number;
    title: string;
    author: string;
    tag: string;
    rating: number;
    price: string;
};

const featuredBooks: Book[] = [
    { id: 1, title: "Sách mới", author: "Tác giả A", tag: "Best-sellers", rating: 4.8, price: "$12.99" },
    { id: 2, title: "Eagerly", author: "Tác giả B", tag: "Sách mới", rating: 4.7, price: "$13.49" },
    { id: 3, title: "Thiền & Thăng hoa", author: "Tác giả C", tag: "Tâm lý", rating: 4.9, price: "$14.99" },
    { id: 4, title: "Khai sáng", author: "Tác giả D", tag: "Kinh điển", rating: 4.6, price: "$11.99" },
    { id: 5, title: "Nông trại xanh", author: "Tác giả E", tag: "Thiếu nhi", rating: 4.5, price: "$9.99" },
    { id: 6, title: "Sách mới 6", author: "Tác giả F", tag: "Best-sellers", rating: 4.6, price: "$10.49" },
    { id: 7, title: "Sách mới 7", author: "Tác giả G", tag: "Tiểu thuyết", rating: 4.4, price: "$12.49" },
    { id: 8, title: "Sách mới 8", author: "Tác giả H", tag: "Kinh doanh", rating: 4.3, price: "$15.99" },
];

const navLinks = ["Trang chủ", "Khám phá", "Xu hướng", "Thư viện", "Blog"];
const sidebarLinks = ["Dashboard", "Tiến trình", "Thư viện", "Khóa học", "Sticker"];

const Header: React.FC = () => (
    <header className="header">
        <div className="header-left">BIBLIO.</div>
        <nav className="header-nav">
            {navLinks.map((item) => (
                <a key={item} href="#">{item}</a>
            ))}
        </nav>
        <div className="header-actions">
            <div className="header-meta">Đang truy cập: 10+ người</div>
            <button type="button" className="icon-btn" aria-label="Giỏ hàng"><IconCart /></button>
            <button type="button" className="icon-btn" aria-label="Tài khoản"><IconUser /></button>
            <button type="button" className="login-btn" aria-label="Đăng nhập">
                <IconLogin />
                <span>Đăng nhập</span>
            </button>
        </div>
    </header>
);

const Sidebar: React.FC = () => (
    <aside className="sidebar">
        <div className="sidebar-user">
            <div className="avatar" aria-hidden>U</div>
            <div className="user-info">
                <div className="user-name">admin</div>
                <div className="user-role">User gui</div>
            </div>
        </div>
        <div className="sidebar-links">
            {sidebarLinks.map((link) => (
                <button key={link} type="button" className="sidebar-link">{link}</button>
            ))}
        </div>
    </aside>
);

const Banner: React.FC = () => (
    <section className="banner">
        <div className="banner-text">
            <h2>Join now our book club.</h2>
            <p>3 months of unlimited reading for $29</p>
            <button type="button" className="banner-cta">Join now</button>
        </div>
        <div className="banner-thumbs" aria-hidden>
            {[1, 2, 3, 4].map((n) => (
                <div key={n} className="thumb" />
            ))}
        </div>
    </section>
);

const FilterBar: React.FC = () => (
    <section className="filter-bar">
        <div className="filter-group">
            {["Thể loại sách", "Tiêu đề", "Người xuất bản", "Đánh giá sách"].map((item) => (
                <button key={item} type="button" className="filter-pill">
                    <span>{item}</span>
                    <IconFilter />
                </button>
            ))}
        </div>
        <div className="search-row">
            <input type="text" placeholder="Tìm sách/ebook..." />
            <button type="button" className="search-btn">Tìm kiếm</button>
        </div>
    </section>
);

const BookCard: React.FC<Book> = ({ title, author, tag, rating, price }) => (
    <div className="book-card">
        <div className="book-image" aria-hidden>
            <span>Ảnh sách</span>
        </div>
        <div className="book-tag">{tag}</div>
        <h3 className="book-title">{title}</h3>
        <p className="book-author">{author}</p>
        <div className="book-rating"><IconStar /> {rating.toFixed(1)}</div>
        <div className="book-price">{price}</div>
    </div>
);

const BookSection: React.FC<{ title: string; books: Book[] }> = ({ title, books }) => (
    <section className="book-grid-section">
        <div className="section-title">{title}</div>
        <div className="book-grid">
            {books.map((b) => (
                <BookCard key={b.id} {...b} />
            ))}
        </div>
    </section>
);

const Homepage: React.FC = () => {
    return (
        <div className="page">
            <Header />
            <div className="layout">
                <Sidebar />
                <main className="content">
                    <Banner />
                    <FilterBar />
                    <BookSection title="Tuyển tập nổi bật" books={featuredBooks} />
                    <BookSection title="Dành riêng cho bạn" books={featuredBooks} />
                </main>
            </div>
        </div>
    );
};

export default Homepage;

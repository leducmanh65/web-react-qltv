import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RightPanel from './RightPanelTW';
import BookCard from './BookCardTW';
import Sidebar from './SidebarTW';
import { useDashboardData, useAuth } from '../hooks';
import { Book } from '../types';
import { seedHeroCovers } from '../data/dashboardSeed';
import BorrowModal from './BorrowModal';
import BorrowCart from './BorrowCart';
import { createBorrowSlip } from '../services/api';
import { getStoredUser } from '../services/auth';

const BookDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, status: authStatus, error: authError, login, logout, clearError } = useAuth();
  const {
    bestSellersData = [],
    recentlyReadData = [],
    wishListData = [],
    genreData = [],
    loading = false,
  } = useDashboardData(user?.id ?? 'me');

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenreId, setSelectedGenreId] = useState<number | 'all'>('all');
  const [showFavorites, setShowFavorites] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showBorrowCart, setShowBorrowCart] = useState(false);
  const [borrowBook, setBorrowBook] = useState<Book | null>(null);
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const filteredBestSellers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    const activeGenre = selectedGenreId !== 'all' ? genreData.find((g) => g.id === selectedGenreId) : null;

    return bestSellersData.filter((b) => {
      const matchesSearch = !term
        ? true
        : [b.title, b.author, b.category]
          .filter(Boolean)
          .some((field) => field!.toLowerCase().includes(term));

      const matchesGenre = activeGenre
        ? (b.genreId === activeGenre.id) || (b.category?.toLowerCase() === activeGenre.name.toLowerCase())
        : true;

      return matchesSearch && matchesGenre;
    });
  }, [bestSellersData, searchTerm, selectedGenreId, genreData]);

  const openAuth = () => {
    clearError();
    setShowAuthModal(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(credentials);
      setShowAuthModal(false);
    } catch (err) {
      // error đã được set trong context
    }
  };

  const handleLogout = () => {
    logout();
    setShowProfile(false);
  };

  const addToCart = (book: Book) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((i: any) => i.bookId === book.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        bookId: book.id,
        title: book.title,
        author: book.author,
        imageUrl: (book as any).imageUrl || (book as any).image,
        quantity: 1,
        category: book.category,
      });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Đã thêm vào giỏ mượn');
  };

  const confirmBorrow = async (days: number) => {
    const user = getStoredUser() || JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (!user || !borrowBook) {
      alert('Vui lòng đăng nhập trước khi mượn.');
      openAuth();
      return;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    try {
      await createBorrowSlip({
        readerId: user.id,
        details: [
          {
            bookId: borrowBook.id,
            dueDate: dueDate,
          },
        ],
      });
      alert('Mượn sách thành công!');
    } catch (err) {
      // Fallback local storage
      const loans = JSON.parse(localStorage.getItem('loans') || '[]');
      const loan = {
        id: Date.now(),
        bookId: borrowBook.id,
        userId: user.id,
        borrowedAt: new Date().toISOString(),
        dueDate: dueDate.toISOString(),
        returned: false,
      };
      loans.push(loan);
      localStorage.setItem('loans', JSON.stringify(loans));

      const all = JSON.parse(localStorage.getItem('books') || '[]');
      const updated = all.map((b: any) => (b.id === borrowBook.id ? { ...b, quantity: Number(b.quantity ?? 1) - 1 } : b));
      localStorage.setItem('books', JSON.stringify(updated));

      alert('Mượn sách (local)');
    } finally {
      setBorrowBook(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-[#ffe6d0] via-[#fff5ea] to-white text-gray-900">
      <Sidebar />

      <main className="ml-20 mr-[320px] flex-1 min-h-screen px-10 py-8 overflow-y-auto scroll-thin">
        <section className="bg-white rounded-[24px] p-8 mb-12 flex justify-between items-center shadow-soft border border-orange-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Mượn sách online dễ dàng.</h2>
            <p className="text-sm text-gray-600 mb-6">Hơn 1.000+ đầu sách, mượn tức thì, nhắc hạn tự động.</p>
            <div className="flex gap-3 flex-wrap">
              <button
                className="px-6 py-2 bg-primary-orange text-white font-bold text-sm rounded-full shadow-light hover:shadow-medium transition-all hover:-translate-y-0.5"
                onClick={() => navigate('/books')}
              >
                Khám phá thư viện
              </button>
              <button
                className="px-6 py-2 bg-white text-primary-orange font-bold text-sm rounded-full border border-primary-orange/30 hover:bg-orange-50 transition-all"
                onClick={() => navigate('/user')}
              >
                Xem sách đang mượn
              </button>
            </div>
          </div>
          <div className="flex gap-3">
            {seedHeroCovers.map((cover, idx) => (
              <div
                key={cover}
                className="w-24 h-36 rounded-xl overflow-hidden shadow-light hover:shadow-medium transition-all hover:-translate-y-1 cursor-pointer"
                style={{ marginTop: idx % 2 === 0 ? '12px' : '0px' }}
              >
                <img src={cover} alt="Featured cover" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
            <h3 className="text-base font-bold text-gray-900">Sách nổi bật</h3>
            <div className="flex items-center gap-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên, tác giả, thể loại"
                className="h-9 w-64 px-3 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-orange/60"
              />
              <button
                className="px-4 py-1.5 bg-primary-orange text-white text-xs font-bold rounded-full hover:opacity-90 transition-all"
                onClick={() => navigate('/books')}
              >
                Xem tất cả
              </button>
            </div>
          </div>

          {/* Bộ lọc chủ đề */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-6">
            <button
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${selectedGenreId === 'all'
                ? 'bg-primary-orange text-white border-primary-orange shadow-light'
                : 'bg-white text-gray-700 border-gray-200 hover:border-primary-orange hover:text-primary-orange'
                }`}
              onClick={() => setSelectedGenreId('all')}
            >
              Tất cả
            </button>
            {genreData.slice(0, 8).map((g) => {
              const active = selectedGenreId === g.id;
              return (
                <button
                  key={g.id}
                  className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all min-w-[110px] text-center ${active
                    ? 'bg-primary-orange text-white border-primary-orange shadow-light'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-primary-orange hover:text-primary-orange'
                    }`}
                  onClick={() => setSelectedGenreId(g.id)}
                >
                  {g.name}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-4 gap-6">
            {filteredBestSellers.map((book: Book) => (
              <BookCard
                key={book.id}
                book={book}
                onAction={() => navigate('/books')}
                onBorrow={(b) => setBorrowBook(b)}
                onAddToCart={(b) => addToCart(b)}
              />
            ))}
            {!filteredBestSellers.length && (
              <div className="col-span-4 text-center text-sm text-gray-500 py-6 bg-gray-50 rounded-xl">
                Không có sách thuộc chủ đề này.
              </div>
            )}
          </div>
        </section>
      </main>

      <RightPanel
        user={user}
        authStatus={authStatus}
        recentlyReadData={recentlyReadData}
        wishListData={wishListData}
        onOpenFavorites={() => setShowFavorites(true)}
        onOpenUser={() => (user ? setShowProfile(true) : openAuth())}
        onOpenCart={() => setShowBorrowCart(true)}
        onRequestLogin={openAuth}
        onLogout={handleLogout}
      />

      {showFavorites && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20" onClick={() => setShowFavorites(false)}>
          <div className="bg-white rounded-2xl shadow-soft w-[360px] max-h-[70vh] overflow-auto p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">Sách yêu thích</h4>
              <button className="text-gray-500 hover:text-primary-orange" onClick={() => setShowFavorites(false)}>✕</button>
            </div>
            <div className="space-y-3">
              {wishListData.map((book) => (
                <div key={book.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                  <img src={book.image || book.imageUrl} alt={book.title} className="w-12 h-16 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{book.title}</div>
                    <div className="text-xs text-gray-600 truncate">{book.author}</div>
                    <div className="text-[11px] text-gray-500 truncate">{book.category}</div>
                  </div>
                </div>
              ))}
              {!wishListData.length && <p className="text-sm text-gray-500">Chưa có sách yêu thích.</p>}
            </div>
          </div>
        </div>
      )}

      {showProfile && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-20" onClick={() => setShowProfile(false)}>
          <div className="bg-white rounded-2xl shadow-soft w-[340px] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-gray-900">Thông tin người dùng</h4>
              <button className="text-gray-500 hover:text-primary-orange" onClick={() => setShowProfile(false)}>✕</button>
            </div>
            <div className="flex gap-3 items-center mb-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-lg font-bold text-primary-orange">
                {(user?.name || user?.username || 'U').charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-gray-900">{user?.name || user?.username || 'Khách'}</div>
                <div className="text-xs text-gray-500">{user?.email || 'Chưa cập nhật email'}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm text-gray-700">
              <div>Email: {user?.email || 'Chưa cung cấp'}</div>
              <div>Quyền: {user?.role || 'Độc giả'}</div>
              <div>Đang mượn: 3 cuốn · Yêu thích: {wishListData.length} cuốn</div>
            </div>
            <button
              className="mt-4 w-full px-4 py-2 bg-primary-orange text-white rounded-xl font-semibold text-sm hover:opacity-90"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white rounded-2xl shadow-soft w-[360px] p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-gray-900">Đăng nhập</h4>
              </div>
              <button className="text-gray-500 hover:text-primary-orange" onClick={() => setShowAuthModal(false)}>✕</button>
            </div>

            <form className="space-y-3" onSubmit={handleLoginSubmit}>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Tên đăng nhập</label>
                <input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/60"
                  placeholder="vd: admin"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Mật khẩu</label>
                <input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-orange/60"
                  placeholder="••••••"
                  required
                />
              </div>

              {authError && (
                <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">{authError}</div>
              )}

              <button
                type="submit"
                disabled={authStatus === 'loading'}
                className="w-full bg-primary-orange text-white font-semibold text-sm rounded-xl px-3 py-2 hover:opacity-90 disabled:opacity-60"
              >
                {authStatus === 'loading' ? 'Đang đăng nhập...' : 'Đăng nhập'}
              </button>
            </form>
          </div>
        </div>
      )}

      {borrowBook && (
        <BorrowModal
          book={borrowBook as any}
          onClose={() => setBorrowBook(null)}
          onConfirm={confirmBorrow}
        />
      )}

      <BorrowCart visible={showBorrowCart} onClose={() => setShowBorrowCart(false)} />
    </div>
  );
};

export default BookDashboard;

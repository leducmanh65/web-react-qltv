import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BorrowModal from '../components/BorrowModal';
import { Book } from '../types';
import { getBookById, createBorrowSlip } from '../services/api';
import { getStoredUser } from '../services/auth';

type RouteParams = { id?: string };

const BookDetail: React.FC = () => {
    const { id } = useParams<RouteParams>();
    const [book, setBook] = useState<Book & { description?: string; imageUrl?: string; publishYear?: string | number } | null>(null);
    const [showBorrow, setShowBorrow] = useState<boolean>(false);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                if (!id) return;
                const data = await getBookById(id);
                setBook(data as any);
            } catch (err) {
                const all = JSON.parse(localStorage.getItem('books') || '[]');
                const found = (Array.isArray(all) ? all : []).find((b: any) => String(b.id) === String(id));
                setBook(found || null);
            }
        };
        fetchDetail();
    }, [id]);

    const confirmBorrow = async (days: number) => {
        if (!book) return;
        const user = getStoredUser() || JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) { alert('Vui lòng đăng nhập'); window.location.href = '/login'; return; }

        const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + days);

        try {
            await createBorrowSlip({
                readerId: user.id,
                note: '',
                details: [{ bookId: book.id, dueDate: dueDate }],
            });
            alert('Mượn sách thành công!');
            setShowBorrow(false);
            window.location.href = '/user';
        } catch (err) {
            // fallback local
            const loans = JSON.parse(localStorage.getItem('loans') || '[]');
            const loan = { id: Date.now(), bookId: book.id, userId: user.id, borrowedAt: new Date().toISOString(), dueDate: dueDate.toISOString(), returned: false };
            loans.push(loan); localStorage.setItem('loans', JSON.stringify(loans));
            const updated = JSON.parse(localStorage.getItem('books') || '[]').map((b: any) => b.id === book.id ? { ...b, quantity: Number(b.quantity) - 1 } : b);
            localStorage.setItem('books', JSON.stringify(updated));
            setBook({ ...book, quantity: Number((book as any).quantity) - 1 });
            setShowBorrow(false);
            alert('Mượn sách (local)');
            window.location.href = '/user';
        }
    };

    const addToCart = (bk: Book) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const existing = cart.find((i: any) => i.bookId === bk.id);
        if (existing) existing.quantity = (existing.quantity || 1) + 1;
        else cart.push({ bookId: bk.id, title: bk.title, author: bk.author, imageUrl: (bk as any).imageUrl, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Đã thêm vào giỏ');
    };

    if (!book) return <div style={{ padding: 20 }}>Không tìm thấy sách</div>;

    return (
        <div style={{ padding: 20 }}>
            <h2>{book.title}</h2>
            <div style={{ display: 'flex', gap: 20 }}>
                <div style={{ width: 220 }}>
                    {book.imageUrl ? <img src={book.imageUrl} style={{ width: '100%' }} alt={book.title} /> : <div style={{ height: 300, background: '#eee' }}></div>}
                </div>
                <div>
                    <p><strong>Tác giả:</strong> {book.author}</p>
                    <p><strong>Thể loại:</strong> {(book as any).category}</p>
                    <p><strong>Năm:</strong> {(book as any).publishYear}</p>
                    <p><strong>Số lượng:</strong> {(book as any).quantity ?? (book as any).availableQuantity ?? (book as any).totalQuantity ?? '—'}</p>
                    <p>{(book as any).description}</p>

                    <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
                        <button className="btn-add-book" onClick={() => addToCart(book)} disabled={Number((book as any).quantity) <= 0}>Thêm vào giỏ</button>
                        <button className="btn-add-book" onClick={() => setShowBorrow(true)} disabled={Number((book as any).quantity) <= 0}>Mượn ngay</button>
                    </div>
                </div>
            </div>

            {showBorrow && <BorrowModal book={book} onClose={() => setShowBorrow(false)} onConfirm={confirmBorrow} />}
        </div>
    );
};

export default BookDetail;

import React, { useEffect, useState } from 'react';
import { Book, Loan, User } from '../types';
import { getBorrowSlipsByUser, returnBorrowSlip } from '../services/api';
import { getStoredUser } from '../services/auth';

const UserDashboard: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loans, setLoans] = useState<Loan[]>([]);
    const [booksMap, setBooksMap] = useState<Record<string | number, Book>>({});

    useEffect(() => {
        const u = getStoredUser() || JSON.parse(localStorage.getItem('currentUser') || 'null');
        setUser(u);

        const all = JSON.parse(localStorage.getItem('books') || '[]');
        const map: Record<string | number, Book> = {};
        (Array.isArray(all) ? all : []).forEach((b: Book) => { map[b.id] = b; });
        setBooksMap(map);

        if (!u) return;

        // Thử gọi API borrow slips, fallback local
        getBorrowSlipsByUser(u.id)
            .then((res: any) => {
                const slips = Array.isArray(res) ? res : (res ? [res] : []);
                const flatted: Loan[] = slips.flatMap((slip: any) =>
                    (slip?.details || []).map((d: any) => ({
                        id: d.id,
                        bookId: d.book?.id,
                        userId: slip.reader?.id,
                        borrowedAt: normalizeDate(d.borrowDate) || normalizeDate(slip.createdAt) || '',
                        dueDate: normalizeDate(d.dueDate) || '',
                        returned: d.status === 'RETURNED',
                    }))
                );
                setLoans(flatted.filter((l) => !l.returned));
            })
            .catch(() => {
                const l = JSON.parse(localStorage.getItem('loans') || '[]');
                setLoans(Array.isArray(l) ? l.filter((x: any) => !x.returned && x.userId === u.id) : []);
            });
    }, []);

    const handleReturn = async (loanId: Loan['id']) => {
        try {
            await returnBorrowSlip(loanId);
            setLoans((prev) => prev.filter((l) => l.id !== loanId));
            alert('Trả sách thành công');
        } catch (err) {
            // fallback local
            const allLoans = JSON.parse(localStorage.getItem('loans') || '[]');
            const updated = (Array.isArray(allLoans) ? allLoans : []).map((l: any) => l.id === loanId ? { ...l, returned: true } : l);
            localStorage.setItem('loans', JSON.stringify(updated));
            const loan = allLoans.find((l: any) => l.id === loanId);
            const allBooks = JSON.parse(localStorage.getItem('books') || '[]');
            const updatedBooks = (Array.isArray(allBooks) ? allBooks : []).map((b: any) => loan && b.id === loan.bookId ? { ...b, quantity: Number(b.quantity) + 1 } : b);
            localStorage.setItem('books', JSON.stringify(updatedBooks));
            setLoans(updated.filter((l: any) => !l.returned));
            alert('Trả sách (local)');
        }
    };

    function normalizeDate(value: any): string | undefined {
        if (!value) return undefined;
        // value có thể là string ISO, hoặc array [yyyy, m, d, ...]
        if (typeof value === 'string') {
            const d = new Date(value);
            return isNaN(d.getTime()) ? undefined : d.toISOString();
        }
        if (Array.isArray(value)) {
            const [y, m = 1, d = 1, hh = 0, mm = 0, ss = 0, ns = 0] = value;
            const date = new Date(Date.UTC(y, (m as number) - 1, d as number, hh as number, mm as number, ss as number, Math.floor((ns as number) / 1e6)));
            return isNaN(date.getTime()) ? undefined : date.toISOString();
        }
        return undefined;
    }

    if (!user) return (
        <div style={{ padding: 20 }}>
            <h2>Xin chào</h2>
            <p>Bạn cần đăng nhập để xem dashboard</p>
            <a href="/login">Đăng nhập</a>
        </div>
    );

    return (
        <div style={{ padding: 20 }}>
            <h2>Xin chào, {user.name}</h2>
            <p>Email: {user.email}</p>

            <h3>Khoản mượn hiện tại</h3>
            {loans.length === 0 ? <p>Không có sách mượn</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ textAlign: 'left' }}>
                            <th>Tiêu đề</th><th>Ngày mượn</th><th>Hạn trả</th><th>Trạng thái</th><th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loans.map((l) => (
                            <tr key={l.id} style={{ borderTop: '1px solid #eee' }}>
                                <td>{booksMap[l.bookId] ? booksMap[l.bookId].title : '---'}</td>
                                <td>{new Date(l.borrowedAt).toLocaleDateString()}</td>
                                <td>{new Date(l.dueDate).toLocaleDateString()}</td>
                                <td>{new Date(l.dueDate) < new Date() ? 'Quá hạn' : 'Đang mượn'}</td>
                                <td><button className="btn-edit" onClick={() => handleReturn(l.id)}>Trả sách</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UserDashboard;

import React, { useEffect, useState } from 'react';
import { createBorrowSlip } from '../services/api';
import { getStoredUser } from '../services/auth';

export interface BorrowCartItem {
    bookId: string | number;
    title: string;
    author?: string;
    imageUrl?: string;
    quantity?: number;
    category?: string;
}

export interface BorrowCartProps {
    visible: boolean;
    onClose?: () => void;
}

const BorrowCart: React.FC<BorrowCartProps> = ({ visible, onClose }) => {
    const [items, setItems] = useState<BorrowCartItem[]>([]);
    const [days, setDays] = useState<number>(14);

    useEffect(() => {
        if (!visible) return;
        try {
            const c = JSON.parse(localStorage.getItem('cart') || '[]');
            setItems(Array.isArray(c) ? c : []);
        } catch (err) {
            setItems([]);
        }
    }, [visible]);

    const removeItem = (bookId: BorrowCartItem['bookId']) => {
        const updated = items.filter(i => i.bookId !== bookId);
        setItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const changeQuantity = (bookId: BorrowCartItem['bookId'], delta: number) => {
        const updated = items.map(i => {
            if (i.bookId !== bookId) return i;
            const q = Math.max(1, (i.quantity || 1) + delta);
            return { ...i, quantity: q };
        });
        setItems(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const confirmBorrow = async () => {
        const user = getStoredUser() || JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (!user) { alert('Vui lòng đăng nhập'); window.location.href = '/login'; return; }

        const dueDate = new Date(); dueDate.setDate(dueDate.getDate() + days);

        try {
            await createBorrowSlip({
                readerId: user.id,
                details: items.map(it => ({
                    bookId: it.bookId,
                    quantity: it.quantity || 1,
                    dueDate: dueDate,
                })),
            });
            alert('Mượn thành công!');
            localStorage.setItem('cart', JSON.stringify([]));
            setItems([]);
            onClose && onClose();
            window.location.href = '/user';
            return;
        } catch (err) {
            // Fallback local
            const loans = JSON.parse(localStorage.getItem('loans') || '[]');
            const allBooks = JSON.parse(localStorage.getItem('books') || '[]');

            items.forEach(it => {
                const loan = { id: Date.now() + Math.random(), bookId: it.bookId, userId: user.id, borrowedAt: new Date().toISOString(), dueDate: dueDate.toISOString(), returned: false };
                loans.push(loan);
                const bidx = allBooks.findIndex((b: any) => b.id === it.bookId);
                if (bidx >= 0) allBooks[bidx].quantity = Math.max(0, Number(allBooks[bidx].quantity) - (it.quantity || 1));
            });

            localStorage.setItem('loans', JSON.stringify(loans));
            localStorage.setItem('books', JSON.stringify(allBooks));
            localStorage.setItem('cart', JSON.stringify([]));
            setItems([]);
            alert('Mượn (local)');
            onClose && onClose();
            window.location.href = '/user';
        }
    };

    if (!visible) return null;

    const totalItems = items.reduce((s, it) => s + (it.quantity || 1), 0);

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />

            <aside className="relative ml-auto w-96 max-w-full h-full bg-white shadow-xl rounded-l-2xl flex flex-col">
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-orange to-primary-orange-dark flex items-center justify-center text-white font-bold">U</div>
                        <div>
                            <div className="text-sm font-bold">Giỏ mượn</div>
                            <div className="text-xs text-gray-500">{totalItems} mục</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="text-sm text-gray-500 hover:text-gray-700" onClick={() => { localStorage.setItem('cart', JSON.stringify([])); setItems([]); }} title="Xóa tất cả">Clear</button>
                        <button className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center" onClick={onClose}>✕</button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto flex-1">
                    {items.length === 0 ? (
                        <div className="text-center text-gray-500 py-20">Giỏ trống</div>
                    ) : (
                        <div className="space-y-4">
                            {items.map(it => (
                                <div key={it.bookId} className="flex gap-4 items-start bg-gray-50 p-3 rounded-xl">
                                    <div className="w-20 h-28 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                        {it.imageUrl ? (
                                            <img src={it.imageUrl} alt={it.title} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div className="truncate">
                                                <div className="text-sm font-bold text-gray-900 truncate">{it.title}</div>
                                                <div className="text-xs text-gray-500 truncate">{it.author}</div>
                                            </div>
                                            <button className="text-gray-400 hover:text-primary-orange text-sm ml-2" onClick={() => removeItem(it.bookId)}>Xóa</button>
                                        </div>

                                        <div className="mt-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <button className="w-8 h-8 rounded-md bg-white border" onClick={() => changeQuantity(it.bookId, -1)}>-</button>
                                                <div className="px-3 py-1 bg-white border rounded-md text-sm">{it.quantity || 1}</div>
                                                <button className="w-8 h-8 rounded-md bg-white border" onClick={() => changeQuantity(it.bookId, 1)}>+</button>
                                            </div>
                                            <div className="text-xs text-gray-500">{it.category || ''}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-6 py-4 border-t bg-white rounded-b-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <div className="text-sm text-gray-600">Thời gian mượn (ngày)</div>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1 bg-gray-100 rounded-md" onClick={() => setDays(Math.max(1, days - 1))}>-</button>
                            <input type="number" value={days} onChange={(e) => setDays(Math.max(1, Number(e.target.value || 1)))} className="w-16 text-center rounded-md border px-2 py-1" />
                            <button className="px-3 py-1 bg-gray-100 rounded-md" onClick={() => setDays(days + 1)}>+</button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-xs text-gray-500">Tổng</div>
                            <div className="text-lg font-bold text-gray-900">{totalItems} mục · {days} ngày</div>
                        </div>
                        <div className="flex gap-3">
                            <button className="px-4 py-2 bg-gray-100 rounded-lg text-sm" onClick={onClose}>Tiếp tục xem</button>
                            <button className="px-4 py-2 bg-primary-orange text-white rounded-lg text-sm font-bold" onClick={confirmBorrow}>Xác nhận mượn</button>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
};

export default BorrowCart;

import React, { useState } from 'react';
import { Book } from '../../types';

export interface BorrowModalProps {
    book: (Book & { author?: string }) | null;
    onClose: () => void;
    onConfirm: (days: number) => void;
}

// Modal mượn sách: chọn số ngày, gọi onConfirm
const BorrowModal: React.FC<BorrowModalProps> = ({ book, onClose, onConfirm }) => {
    const [days, setDays] = useState<number>(14);

    if (!book) return null;

    return (
        <div className="form-container">
            <div className="form-overlay" onClick={onClose}></div>
            <div className="form-content">
                <h2>Yêu cầu mượn: {book.title}</h2>
                <p>Tác giả: {book.author}</p>
                <div className="form-group">
                    <label>Số ngày mượn</label>
                    <input type="number" min={1} value={days} onChange={(e) => setDays(Number(e.target.value))} />
                </div>
                <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                    <button className="btn-submit" onClick={() => { onConfirm(days); }}>Xác nhận</button>
                    <button className="btn-cancel" onClick={onClose}>Hủy</button>
                </div>
            </div>
        </div>
    );
};

export default BorrowModal;

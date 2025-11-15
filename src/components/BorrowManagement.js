import React, { useState, useEffect } from 'react';
import {
  getBorrowSlips,
  getBooks,
  getUsers,
  getBorrowDetails,
  createBorrowSlip,
  createBorrowDetail,
  updateBorrowSlip,
  updateBorrowDetail,
  patchBook
} from '../services/api';
import '../styles/BorrowManagement.css';

const BorrowManagement = ({ user }) => {
  const [slips, setSlips] = useState([]);
  const [books, setBooks] = useState([]);
  const [users, setUsers] = useState([]);
  const [details, setDetails] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [slipsData, booksData, usersData, detailsData] = await Promise.all([
        getBorrowSlips(),
        getBooks(),
        getUsers(),
        getBorrowDetails()
      ]);
      setSlips(slipsData);
      setBooks(booksData);
      setUsers(usersData);
      setDetails(detailsData);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      alert('Không thể tải dữ liệu!');
    }
  };

  const handleBorrow = async () => {
    if (!selectedBook) {
      alert('Vui lòng chọn sách!');
      return;
    }

    try {
      const book = books.find(b => b.id === parseInt(selectedBook));
      if (!book || book.available <= 0) {
        alert('Sách đã hết hoặc không tồn tại!');
        return;
      }

      // Tạo phiếu mượn
      const newSlip = {
        userId: user.id,
        borrowDate: new Date().toISOString().split('T')[0],
        returnDate: null,
        status: 'borrowing'
      };

      const slip = await createBorrowSlip(newSlip);

      // Tạo chi tiết mượn
      await createBorrowDetail({
        slipId: slip.id,
        bookId: parseInt(selectedBook),
        quantity: 1,
        returned: false
      });

      // Cập nhật số lượng sách
      await patchBook(selectedBook, {
        available: book.available - 1
      });

      fetchData();
      setShowForm(false);
      setSelectedBook('');
      alert('Mượn sách thành công!');
    } catch (err) {
      console.error('Lỗi khi mượn sách:', err);
      alert('Lỗi khi mượn sách!');
    }
  };

  const handleReturn = async (slipId) => {
    if (!window.confirm('Xác nhận trả sách?')) return;

    try {
      const slipDetails = details.filter(d => d.slipId === slipId && !d.returned);

      // Cập nhật số lượng sách và chi tiết mượn
      for (const detail of slipDetails) {
        const book = books.find(b => b.id === detail.bookId);
        if (book) {
          await patchBook(detail.bookId, {
            available: book.available + detail.quantity
          });
        }

        await updateBorrowDetail(detail.id, {
          returned: true
        });
      }

      // Cập nhật phiếu mượn
      await updateBorrowSlip(slipId, {
        returnDate: new Date().toISOString().split('T')[0],
        status: 'returned'
      });

      fetchData();
      alert('Trả sách thành công!');
    } catch (err) {
      console.error('Lỗi khi trả sách:', err);
      alert('Lỗi khi trả sách!');
    }
  };

  const userSlips = user.role === 'reader'
    ? slips.filter(s => s.userId === user.id)
    : slips;

  const getBookTitle = (slipId) => {
    const detail = details.find(d => d.slipId === slipId);
    if (!detail) return 'N/A';
    const book = books.find(b => b.id === detail.bookId);
    return book?.title || 'N/A';
  };

  const getUserName = (userId) => {
    const u = users.find(u => u.id === userId);
    return u?.fullName || 'N/A';
  };

  const availableBooks = books.filter(b => b.available > 0);

  const getStatusLabel = (status) => {
    switch (status) {
      case 'returned':
        return 'Đã trả';
      case 'late':
        return 'Trễ hạn';
      case 'borrowing':
        return 'Đang mượn';
      default:
        return status;
    }
  };

  return (
    <div className="borrow-management-container">
      <div className="borrow-header">
        <h2 className="borrow-title">Quản lý mượn/trả</h2>
        {user.role === 'reader' && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Mượn sách
          </button>
        )}
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">Mượn sách</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Chọn sách</label>
              <select
                className="borrow-form-select"
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
              >
                <option value="">-- Chọn sách --</option>
                {availableBooks.map(book => (
                  <option key={book.id} value={book.id}>
                    {book.title} (Còn: {book.available})
                  </option>
                ))}
              </select>
            </div>

            <div className="borrow-form-actions">
              <button onClick={handleBorrow} className="btn btn-primary">
                Xác nhận
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setSelectedBook('');
                }}
                className="btn btn-secondary"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="borrow-table-wrapper">
        <div className="borrow-table">
          <table>
            <thead>
              <tr>
                <th>Người mượn</th>
                <th>Sách</th>
                <th>Ngày mượn</th>
                <th>Ngày trả</th>
                <th className="center">Trạng thái</th>
                <th className="center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {userSlips.length > 0 ? (
                userSlips.map(slip => (
                  <tr key={slip.id}>
                    <td>{getUserName(slip.userId)}</td>
                    <td>{getBookTitle(slip.id)}</td>
                    <td>{slip.borrowDate}</td>
                    <td>{slip.returnDate || '-'}</td>
                    <td className="center">
                      <span className={`borrow-status ${slip.status}`}>
                        {getStatusLabel(slip.status)}
                      </span>
                    </td>
                    <td className="center">
                      {slip.status === 'borrowing' || slip.status === 'late' ? (
                        <button
                          onClick={() => handleReturn(slip.id)}
                          className="btn btn-success btn-small"
                        >
                          Trả sách
                        </button>
                      ) : (
                        <span style={{ color: '#9ca3af' }}>-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Chưa có phiếu mượn nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BorrowManagement;
import React, { useState, useEffect } from 'react';
import {
  getBooks,
  getAuthors,
  getCategories,
  getPublishers,
  createBook,
  updateBook,
  deleteBook
} from '../services/api';
import '../styles/BookManagement.css';

const BookManagement = ({ user }) => {
  const [books, setBooks] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    authorId: '',
    categoryId: '',
    publisherId: '',
    quantity: 0,
    available: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [booksData, authorsData, categoriesData, publishersData] = await Promise.all([
        getBooks(),
        getAuthors(),
        getCategories(),
        getPublishers()
      ]);
      setBooks(booksData);
      setAuthors(authorsData);
      setCategories(categoriesData);
      setPublishers(publishersData);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      alert('Không thể tải dữ liệu. Vui lòng kiểm tra kết nối!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const bookData = {
        ...formData,
        authorId: parseInt(formData.authorId),
        categoryId: parseInt(formData.categoryId),
        publisherId: parseInt(formData.publisherId),
        quantity: parseInt(formData.quantity),
        available: parseInt(formData.available)
      };

      if (editingBook) {
        await updateBook(editingBook.id, bookData);
      } else {
        await createBook(bookData);
      }

      fetchData();
      handleCloseForm();
      alert(editingBook ? 'Cập nhật sách thành công!' : 'Thêm sách thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu sách:', err);
      alert('Lỗi khi lưu sách!');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa sách này?')) return;

    try {
      await deleteBook(id);
      fetchData();
      alert('Xóa sách thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa sách:', err);
      alert('Lỗi khi xóa sách!');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      authorId: book.authorId,
      categoryId: book.categoryId,
      publisherId: book.publisherId,
      quantity: book.quantity,
      available: book.available
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingBook(null);
    setFormData({
      title: '',
      authorId: '',
      categoryId: '',
      publisherId: '',
      quantity: 0,
      available: 0
    });
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAuthorName = (id) => authors.find(a => a.id === id)?.name || '';
  const getCategoryName = (id) => categories.find(c => c.id === id)?.name || '';
  const getPublisherName = (id) => publishers.find(p => p.id === id)?.name || '';

  const canEdit = user.role === 'admin' || user.role === 'librarian';

  return (
    <div className="book-management-container">
      <div className="book-header">
        <h2 className="book-title">Quản lý sách</h2>
        {canEdit && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Thêm sách
          </button>
        )}
      </div>

      <div className="book-search">
        <input
          type="text"
          placeholder="Tìm kiếm sách..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
        />
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingBook ? 'Sửa sách' : 'Thêm sách mới'}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="book-form-full">
                <div className="form-group">
                  <label className="form-label">Tên sách</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="book-form-grid">
                <div className="form-group">
                  <label className="form-label">Tác giả</label>
                  <select
                    className="form-select"
                    value={formData.authorId}
                    onChange={(e) => setFormData({ ...formData, authorId: e.target.value })}
                    required
                  >
                    <option value="">Chọn tác giả</option>
                    {authors.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Thể loại</label>
                  <select
                    className="form-select"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Chọn thể loại</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Nhà xuất bản</label>
                  <select
                    className="form-select"
                    value={formData.publisherId}
                    onChange={(e) => setFormData({ ...formData, publisherId: e.target.value })}
                    required
                  >
                    <option value="">Chọn NXB</option>
                    {publishers.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Số lượng</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    min="0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Còn lại</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.value })}
                    required
                    min="0"
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {editingBook ? 'Cập nhật' : 'Thêm'}
                </button>
                <button type="button" onClick={handleCloseForm} className="btn btn-secondary">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="book-table-wrapper">
        <div className="book-table">
          <table>
            <thead>
              <tr>
                <th>Tên sách</th>
                <th>Tác giả</th>
                <th>Thể loại</th>
                <th>NXB</th>
                <th className="center">Số lượng</th>
                <th className="center">Còn lại</th>
                {canEdit && <th className="center">Thao tác</th>}
              </tr>
            </thead>
            <tbody>
              {filteredBooks.length > 0 ? (
                filteredBooks.map(book => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{getAuthorName(book.authorId)}</td>
                    <td>{getCategoryName(book.categoryId)}</td>
                    <td>{getPublisherName(book.publisherId)}</td>
                    <td className="center">{book.quantity}</td>
                    <td className="center">
                      <span className={`book-quantity ${book.available > 0 ? 'available' : 'unavailable'}`}>
                        {book.available}
                      </span>
                    </td>
                    {canEdit && (
                      <td className="center">
                        <div className="book-action-buttons">
                          <button
                            onClick={() => handleEdit(book)}
                            className="book-action-btn edit"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="book-action-btn delete"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Xóa
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={canEdit ? 7 : 6} className="text-center">
                    Không tìm thấy sách nào
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

export default BookManagement;
import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';
import '../styles/UserManagement.css';

const UserManagement = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'reader',
    fullName: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      console.error('Lỗi khi tải người dùng:', err);
      alert('Không thể tải danh sách người dùng!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }

      fetchUsers();
      handleCloseForm();
      alert(editingUser ? 'Cập nhật người dùng thành công!' : 'Thêm người dùng thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu người dùng:', err);
      alert('Lỗi khi lưu người dùng!');
    }
  };

  const handleDelete = async (id) => {
    if (id === user.id) {
      alert('Không thể xóa tài khoản đang đăng nhập!');
      return;
    }

    if (!window.confirm('Bạn có chắc muốn xóa người dùng này?')) return;

    try {
      await deleteUser(id);
      fetchUsers();
      alert('Xóa người dùng thành công!');
    } catch (err) {
      console.error('Lỗi khi xóa người dùng:', err);
      alert('Lỗi khi xóa người dùng!');
    }
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setFormData({
      username: u.username,
      password: u.password,
      role: u.role,
      fullName: u.fullName
    });
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({
      username: '',
      password: '',
      role: 'reader',
      fullName: ''
    });
  };

  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên';
      case 'librarian':
        return 'Thủ thư';
      case 'reader':
        return 'Độc giả';
      default:
        return role;
    }
  };

  return (
    <div className="user-management-container">
      <div className="user-header">
        <h2 className="user-title">Quản lý người dùng</h2>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Thêm người dùng
        </button>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={handleCloseForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
              </h3>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Tên đăng nhập</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mật khẩu</label>
                <input
                  type="password"
                  className="form-input"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Họ tên</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Vai trò</label>
                <select
                  className="form-select"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="reader">Độc giả</option>
                  <option value="librarian">Thủ thư</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Cập nhật' : 'Thêm'}
                </button>
                <button type="button" onClick={handleCloseForm} className="btn btn-secondary">
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="user-table-wrapper">
        <div className="user-table">
          <table>
            <thead>
              <tr>
                <th>Tên đăng nhập</th>
                <th>Họ tên</th>
                <th>Vai trò</th>
                <th className="center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(u => (
                  <tr key={u.id}>
                    <td>{u.username}</td>
                    <td>{u.fullName}</td>
                    <td>
                      <span className={`user-role-badge ${u.role}`}>
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="center">
                      <div className="user-action-buttons">
                        <button
                          onClick={() => handleEdit(u)}
                          className="user-action-btn edit"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                          </svg>
                          Sửa
                        </button>
                        {u.id !== user.id && (
                          <button
                            onClick={() => handleDelete(u.id)}
                            className="user-action-btn delete"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="3 6 5 6 21 6"></polyline>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Xóa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Chưa có người dùng nào
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

export default UserManagement;
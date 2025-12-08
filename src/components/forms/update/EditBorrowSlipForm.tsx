import React, { useState, useEffect } from "react";
import { X, Calendar, FileText, Save, User as UserIcon, BookOpen } from "lucide-react";
import { updateBorrowSlip, getAllUsers, getAllBooks } from "../../../api/apiService";
import type { BorrowSlip, User, Book } from "../../../hooks/useManagementHooks";
import "../../../styles/Admin/admin-modal.css"; // CSS chung

interface EditBorrowSlipFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: BorrowSlip | null;
}

export default function EditBorrowSlipForm({ isOpen, onClose, onSuccess, initialData }: EditBorrowSlipFormProps) {
  // --- STATE DATA ---
  const [form, setForm] = useState({
    readerId: 0,
    bookIds: [] as number[],
    borrowDate: "",
    dueDate: "",
    note: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State cho tìm kiếm và danh sách lựa chọn
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);

  // --- 1. LOAD DANH SÁCH USER & BOOK KHI MỞ MODAL ---
  useEffect(() => {
    if (isOpen) {
      Promise.all([getAllUsers(), getAllBooks()])
        .then(([usersRes, booksRes]: any) => {
          setLocalUsers(usersRes?.data || usersRes || []);
          setLocalBooks(booksRes?.data || booksRes || []);
        })
        .catch((err) => console.error("Error fetching list data:", err));
    }
  }, [isOpen]);

  // --- 2. ĐỔ DỮ LIỆU CŨ VÀO FORM ---
  useEffect(() => {
    if (isOpen && initialData) {
      // a. Xử lý ngày tháng
      const detail = initialData.details?.[0]; // Lấy thông tin ngày từ detail đầu tiên
      
      const toDateString = (dateArr: number[] | undefined) => {
        if (!dateArr || !Array.isArray(dateArr)) return "";
        const [y, m, d] = dateArr;
        return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      };

      // b. Lấy danh sách ID sách đang có trong phiếu
      const currentBookIds = initialData.details?.map((d: any) => d.book.id) || [];

      setForm({
        readerId: initialData.reader?.id || 0,
        bookIds: currentBookIds,
        borrowDate: toDateString(detail?.borrowDate),
        dueDate: toDateString(detail?.dueDate),
        note: "", // Nếu backend có trả về note thì điền vào: initialData.note
      });
    }
  }, [isOpen, initialData]);

  // --- HANDLERS ---

  // Lọc danh sách hiển thị
  const filteredUsers = (localUsers || []).filter((u) =>
    userSearch === "" ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredBooks = (localBooks || []).filter((b) =>
    bookSearch === "" ||
    b.title.toLowerCase().includes(bookSearch.toLowerCase())
  );

  // Chọn/Bỏ chọn sách
  const toggleBook = (bookId: number) => {
    setForm(prev => {
      const isSelected = prev.bookIds.includes(bookId);
      if (isSelected) {
        return { ...prev, bookIds: prev.bookIds.filter(id => id !== bookId) };
      } else {
        return { ...prev, bookIds: [...prev.bookIds, bookId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id) return;
    if (form.readerId === 0) return alert("Vui lòng chọn người mượn!");
    if (form.bookIds.length === 0) return alert("Vui lòng chọn ít nhất 1 cuốn sách!");

    setIsSubmitting(true);
    try {
      const payload = {
        readerId: form.readerId,
        bookIds: form.bookIds,
        borrowDate: form.borrowDate ? new Date(form.borrowDate) : null,
        dueDate: form.dueDate ? new Date(form.dueDate) : null,
        note: form.note
      };

      console.log("Update Payload:", payload);

      await updateBorrowSlip(initialData.id, payload);
      alert("Cập nhật phiếu mượn thành công!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Update failed", err);
      alert(err?.response?.data?.message || "Cập nhật thất bại. Hãy kiểm tra Backend có hỗ trợ sửa toàn bộ không.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div 
        className="admin-modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ width: 700, maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }}
      >
        
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Sửa Phiếu Mượn: {initialData?.slipCode}</h3>
          <button className="admin-btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            
            {/* Cột Trái: Thông tin chung */}
            <div>
              {/* 1. Chọn User */}
              <div className="admin-form-group">
                <label className="admin-form-label"><UserIcon size={16} className="mr-2 text-blue-500"/> Người Mượn</label>
                <input
                  className="admin-form-input"
                  placeholder="Tìm người mượn..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{marginBottom: 8}}
                />
                {userSearch && filteredUsers.length > 0 && (
                  <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", marginBottom: 8 }}>
                    {filteredUsers.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          padding: "8px", cursor: "pointer",
                          backgroundColor: form.readerId === u.id ? "#e3f2fd" : "#fff"
                        }}
                        onClick={() => { setForm({ ...form, readerId: u.id }); setUserSearch(""); }}
                      >
                        {u.username} ({u.email})
                      </div>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 13, padding: '8px', background: '#f9fafb', borderRadius: 4 }}>
                  Đang chọn: <b>{localUsers.find(u => u.id === form.readerId)?.username || "Chưa chọn"}</b>
                </div>
              </div>

              {/* 2. Ngày Mượn */}
              <div className="admin-form-group">
                <label className="admin-form-label">Ngày Mượn</label>
                <input
                  type="date"
                  className="admin-form-input"
                  value={form.borrowDate}
                  onChange={(e) => setForm({ ...form, borrowDate: e.target.value })}
                />
              </div>

              {/* 3. Hạn Trả */}
              <div className="admin-form-group">
                <label className="admin-form-label">Hạn Trả</label>
                <input
                  type="date"
                  className="admin-form-input"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>

              {/* 4. Ghi chú */}
              <div className="admin-form-group">
                <label className="admin-form-label"><FileText size={16} className="mr-2 text-gray-500"/> Ghi Chú</label>
                <textarea
                  className="admin-form-input admin-form-textarea"
                  value={form.note}
                  onChange={(e) => setForm({ ...form, note: e.target.value })}
                  rows={3}
                />
              </div>
            </div>

            {/* Cột Phải: Chọn Sách */}
            <div>
              <div className="admin-form-group">
                <label className="admin-form-label"><BookOpen size={16} className="mr-2 text-green-500"/> Danh Sách Sách</label>
                <input
                  className="admin-form-input"
                  placeholder="Tìm sách..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  style={{marginBottom: 8}}
                />
                
                <div style={{ maxHeight: 300, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4 }}>
                  {filteredBooks.map(b => (
                    <label 
                      key={b.id} 
                      style={{ 
                        display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", 
                        borderBottom: "1px solid #eee", cursor: "pointer",
                        backgroundColor: form.bookIds.includes(b.id) ? "#f0fdf4" : "transparent"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.bookIds.includes(b.id)}
                        onChange={() => toggleBook(b.id)}
                        style={{ width: 16, height: 16 }}
                      />
                      <div style={{fontSize: 13}}>
                        <div style={{fontWeight: 600}}>ID{b.id} - {b.title}</div>
                        <div style={{color: '#666', fontSize: 11}}>Kho: {b.availableQuantity}</div>
                      </div>
                    </label>
                  ))}
                </div>
                
                <div style={{ marginTop: 8, fontSize: 13, fontWeight: 600, color: '#333' }}>
                  Tổng cộng: {form.bookIds.length} cuốn
                </div>
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang lưu..." : <><Save size={18}/> Cập Nhật</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
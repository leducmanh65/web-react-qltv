import { useState, useEffect } from "react";
import { X, AlertTriangle, Info } from "lucide-react";
import { createBorrowSlip, getAllUsers, getAllBooks, getBorrowSlipsByUserId } from "../../../api/apiService";
import type { Book, User, BorrowSlip } from "../../../hooks/useManagementHooks";
import "../../../styles/Admin/admin-modal.css"; // Import CSS chung

interface CreateBorrowSlipFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  users?: User[];
  books?: Book[];
}

export default function CreateBorrowSlipForm({ isOpen, onClose, onSuccess, users = [], books = [] }: CreateBorrowSlipFormProps) {
  const [form, setForm] = useState({
    readerId: 0,
    bookIds: [] as number[],
    note: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [bookSearch, setBookSearch] = useState("");

  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);

  const [currentBorrowedCount, setCurrentBorrowedCount] = useState(0);
  const [holdingBooksMap, setHoldingBooksMap] = useState<Record<number, number>>({});
  const [userQuota, setUserQuota] = useState(5);

  useEffect(() => {
    if (isOpen && localUsers.length === 0) {
      Promise.all([getAllUsers(), getAllBooks()])
        .then(([usersRes, booksRes]: any) => {
          setLocalUsers(usersRes?.data || usersRes || []);
          setLocalBooks(booksRes?.data || booksRes || []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setLocalUsers(users || []);
          setLocalBooks(books || []);
        });
    }
  }, [isOpen]);

  useEffect(() => {
    const checkUserBorrowStatus = async () => {
      if (form.readerId === 0) {
        setCurrentBorrowedCount(0);
        setHoldingBooksMap({});
        setUserQuota(5);
        return;
      }

      const selectedUser = localUsers.find(u => u.id === form.readerId);
      const limit = selectedUser?.bookQuota && selectedUser.bookQuota > 0 ? selectedUser.bookQuota : 5;
      setUserQuota(limit);

      try {
        const slips: BorrowSlip[] = await getBorrowSlipsByUserId(form.readerId) as any;
        
        let totalCount = 0;
        const bookCounts: Record<number, number> = {};

        if (Array.isArray(slips)) {
          slips.forEach(slip => {
            if (slip.details) {
              slip.details.forEach((detail: any) => {
                if (!detail.returnDate && slip.status !== "RETURNED") {
                  totalCount++;
                  const bId = detail.book?.id;
                  if (bId) {
                    bookCounts[bId] = (bookCounts[bId] || 0) + 1;
                  }
                }
              });
            }
          });
        }
        setCurrentBorrowedCount(totalCount);
        setHoldingBooksMap(bookCounts);
      } catch (error) {
        console.error("Error checking user borrow history:", error);
        setCurrentBorrowedCount(0);
        setHoldingBooksMap({});
      }
    };

    checkUserBorrowStatus();
  }, [form.readerId, localUsers]);

  const filteredUsers = (localUsers || []).filter((u) =>
    userSearch === "" ||
    u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.id.toString().includes(userSearch)
  );

  const filteredBooks = (localBooks || []).filter((b) =>
    bookSearch === "" ||
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.id.toString().includes(bookSearch)
  );

  const toggleBook = (bookId: number) => {
    setForm(prev => {
      const isSelected = prev.bookIds.includes(bookId);
      
      if (!isSelected) {
        if (currentBorrowedCount + prev.bookIds.length + 1 > userQuota) {
          alert(`Không thể chọn thêm! User này chỉ được mượn tối đa ${userQuota} cuốn.`);
          return prev;
        }

        const holdingQty = holdingBooksMap[bookId] || 0;
        if (holdingQty >= 2) {
          alert(`Không thể mượn thêm sách này! Người dùng đang giữ ${holdingQty} cuốn cùng loại.`);
          return prev;
        }

        return { ...prev, bookIds: [...prev.bookIds, bookId] };
      } 
      else {
        return { ...prev, bookIds: prev.bookIds.filter(id => id !== bookId) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.readerId) return alert("Vui lòng chọn bạn đọc");
    if (!form.bookIds.length) return alert("Vui lòng chọn ít nhất 1 cuốn sách");
    
    if (currentBorrowedCount + form.bookIds.length > userQuota) {
      return alert(`Vượt quá hạn mức mượn sách (${userQuota} cuốn).`);
    }

    setIsSubmitting(true);
    try {
      await createBorrowSlip(form);
      onSuccess();
      setForm({ readerId: 0, bookIds: [], note: "" });
      setUserSearch("");
      setBookSearch("");
      setCurrentBorrowedCount(0);
      setHoldingBooksMap({});
      onClose();
      alert("Tạo phiếu mượn thành công!");
    } catch (err: any) {
      console.error("Create borrow slip failed:", err);
      alert(err?.response?.data?.message || "Tạo phiếu mượn thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isQuotaFull = currentBorrowedCount >= userQuota;
  
  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div 
        className="admin-modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ width: 650 }} // Form này cần rộng hơn chút
      >
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Tạo Phiếu Mượn Mới</h3>
          <button className="admin-btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ overflowY: 'auto', maxHeight: '75vh', paddingRight: '5px' }}>
          
          {/* 1. Chọn Người dùng */}
          <div className="admin-form-group">
            <label className="admin-form-label">Bạn Đọc *</label>
            <input
              className="admin-form-input"
              placeholder="Tìm bạn đọc theo tên, email hoặc ID..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={() => setUserSearch("")}
              style={{ marginBottom: 8 }}
            />
            
            {userSearch !== null && (filteredUsers.length > 0 || users?.length === 0) && (
              <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", borderRadius: 6, marginBottom: 8, backgroundColor: "#fff" }}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        backgroundColor: form.readerId === u.id ? "#e3f2fd" : "transparent",
                        borderBottom: "1px solid #f0f0f0",
                        fontSize: '14px',
                        color: '#333'
                      }}
                      onClick={() => {
                        setForm({ ...form, readerId: u.id, bookIds: [] });
                        setUserSearch("");
                      }}
                    >
                      <strong>ID{u.id}</strong> - {u.username} (Quota: {u.bookQuota || 5})
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 10, color: "#999", fontSize: '14px' }}>Không tìm thấy bạn đọc</div>
                )}
              </div>
            )}

            {/* Thông báo trạng thái Hạn mức */}
            {form.readerId > 0 && (
              <div style={{ marginBottom: 8, padding: 12, backgroundColor: isQuotaFull ? "#fef2f2" : "#f0fdf4", borderRadius: 6, border: "1px solid " + (isQuotaFull ? "#fecaca" : "#bbf7d0") }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#1f2937' }}>
                    ✓ Người mượn: <b>{localUsers?.find(u => u.id === form.readerId)?.username}</b>
                  </span>
                  <button
                    type="button"
                    style={{ padding: "4px 10px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: '12px' }}
                    onClick={() => { setForm({ ...form, readerId: 0, bookIds: [] }); setCurrentBorrowedCount(0); }}
                  >
                    Đổi
                  </button>
                </div>
                
                <div style={{ marginTop: 8, fontSize: '13px', color: isQuotaFull ? '#dc2626' : '#15803d', display: 'flex', alignItems: 'center', gap: 6 }}>
                  {isQuotaFull ? <AlertTriangle size={16} /> : <Info size={16} />}
                  <span>
                    Đang giữ: <b>{currentBorrowedCount}/{userQuota}</b> cuốn. 
                    {isQuotaFull 
                      ? " (Đã đầy hạn mức)"
                      : ` (Còn được mượn: ${Math.max(0, userQuota - currentBorrowedCount - form.bookIds.length)} cuốn)`
                    }
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 2. Chọn Sách */}
          <div className="admin-form-group">
            <label className="admin-form-label">Sách Mượn *</label>
            <input
              className="admin-form-input"
              placeholder="Tìm sách..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              disabled={form.readerId === 0 || isQuotaFull && form.bookIds.length === 0}
              style={{ marginBottom: 8 }}
            />
            
            <div style={{ border: "1px solid #e5e7eb", borderRadius: 6, padding: 0, maxHeight: 200, overflowY: "auto", backgroundColor: (form.readerId === 0) ? "#f9fafb" : "#fff" }}>
              {filteredBooks.length === 0 ? (
                <p style={{ color: "#9ca3af", textAlign: "center", padding: 12, fontSize: '14px' }}>Không có sách</p>
              ) : (
                filteredBooks.map(b => {
                  const isChecked = form.bookIds.includes(b.id);
                  const holdingThisBook = holdingBooksMap[b.id] || 0;
                  const isDisabled = form.readerId === 0 || 
                                     (!isChecked && (currentBorrowedCount + form.bookIds.length >= userQuota)) ||
                                     (!isChecked && holdingThisBook >= 2);

                  return (
                    <label 
                      key={b.id} 
                      style={{ 
                        display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", 
                        cursor: isDisabled ? "not-allowed" : "pointer", 
                        borderBottom: "1px solid #f3f4f6",
                        opacity: isDisabled ? 0.6 : 1,
                        backgroundColor: isChecked ? "#eff6ff" : "transparent",
                        fontSize: '14px', color: '#374151'
                      }}
                      title={isDisabled ? (holdingThisBook >= 2 ? "Đã mượn tối đa 2 cuốn loại này" : "Hết hạn mức mượn") : ""}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBook(b.id)}
                        disabled={isDisabled}
                        style={{ width: 16, height: 16, cursor: 'pointer' }}
                      />
                      <div style={{display:'flex', flexDirection:'column'}}>
                        <span><strong>ID{b.id}</strong> - {b.title}</span>
                        {holdingThisBook > 0 && (
                          <span style={{fontSize: 12, color: '#f97316', fontWeight: 500}}>
                            (Đang giữ: {holdingThisBook} cuốn)
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })
              )}
            </div>

            {/* List sách đã chọn */}
            {form.bookIds.length > 0 && (
              <div style={{ marginTop: 12, padding: 12, backgroundColor: "#f3f4f6", borderRadius: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: '#4b5563' }}>
                  ✓ Đã chọn ({form.bookIds.length}):
                </div>
                {form.bookIds.map(id => {
                  const book = localBooks?.find(b => b.id === id) || books?.find(b => b.id === id);
                  return (
                    <div key={id} style={{ fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6, paddingBottom: 6, borderBottom: '1px dashed #e5e7eb' }}>
                      <span style={{color: '#1f2937'}}>• {book?.title}</span>
                      <button
                        type="button"
                        style={{ padding: "2px 8px", background: "#ef4444", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 11 }}
                        onClick={() => toggleBook(id)}
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Ghi Chú</label>
            <textarea
              className="admin-form-input admin-form-textarea"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
              style={{ resize: 'none' }}
            />
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button 
              type="submit" 
              className="admin-btn admin-btn-primary" 
              disabled={isSubmitting || (isQuotaFull && form.bookIds.length === 0)}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Phiếu Mượn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
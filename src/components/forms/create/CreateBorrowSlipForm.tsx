import { useState, useEffect } from "react";
import { X, AlertTriangle, Info } from "lucide-react";
import { createBorrowSlip, getAllUsers, getAllBooks, getBorrowSlipsByUserId } from "../../../api/apiService";
import type { Book, User, BorrowSlip } from "../../../hooks/useManagementHooks";

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

  // Local state
  const [localUsers, setLocalUsers] = useState<User[]>([]);
  const [localBooks, setLocalBooks] = useState<Book[]>([]);

  // --- STATE QUẢN LÝ SLIP ---
  const [currentBorrowedCount, setCurrentBorrowedCount] = useState(0); // Tổng số sách đang giữ
  const [holdingBooksMap, setHoldingBooksMap] = useState<Record<number, number>>({}); // Map đếm số lượng từng cuốn: { bookId: quantity }
  const [userQuota, setUserQuota] = useState(5); // Hạn mức của user (lấy từ DB)

  // Fetch data ban đầu
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

  // --- LOGIC KIỂM TRA LỊCH SỬ MƯỢN ---
  useEffect(() => {
    const checkUserBorrowStatus = async () => {
      if (form.readerId === 0) {
        setCurrentBorrowedCount(0);
        setHoldingBooksMap({});
        setUserQuota(5);
        return;
      }

      // 1. Cập nhật Quota theo User đã chọn
      const selectedUser = localUsers.find(u => u.id === form.readerId);
      // Nếu user có bookQuota thì dùng, không thì mặc định 5
      const limit = selectedUser?.bookQuota && selectedUser.bookQuota > 0 ? selectedUser.bookQuota : 5;
      setUserQuota(limit);

      try {
        // 2. Lấy lịch sử mượn
        const slips: BorrowSlip[] = await getBorrowSlipsByUserId(form.readerId) as any;
        
        let totalCount = 0;
        const bookCounts: Record<number, number> = {};

        if (Array.isArray(slips)) {
          slips.forEach(slip => {
            if (slip.details) {
              slip.details.forEach((detail: any) => {
                // Sách chưa trả (không có returnDate và status slip không phải RETURNED)
                if (!detail.returnDate && slip.status !== "RETURNED") {
                  totalCount++;
                  
                  // Đếm số lượng từng cuốn sách (ID) đang giữ
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
  }, [form.readerId, localUsers]); // Thêm localUsers vào deps để đảm bảo tìm thấy user


  // --- FILTER ---
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

  // --- LOGIC CHỌN SÁCH (TOGGLE) ---
  const toggleBook = (bookId: number) => {
    setForm(prev => {
      const isSelected = prev.bookIds.includes(bookId);
      
      // A. Nếu đang chọn thêm sách
      if (!isSelected) {
        // 1. Kiểm tra Tổng Hạn Mức (Quota)
        // (Sách đang giữ + Sách đã chọn trong form + 1 cuốn định chọn) > Quota
        if (currentBorrowedCount + prev.bookIds.length + 1 > userQuota) {
          alert(`Không thể chọn thêm! User này chỉ được mượn tối đa ${userQuota} cuốn (Đang giữ: ${currentBorrowedCount}, Đang chọn: ${prev.bookIds.length}).`);
          return prev;
        }

        // 2. Kiểm tra giới hạn 2 cuốn giống nhau
        // (Số lượng cuốn này đang giữ + 1 cuốn định chọn) > 2
        // Lưu ý: Form này dùng checkbox nên chỉ chọn được 1 cuốn mỗi loại trong lần tạo này.
        const holdingQty = holdingBooksMap[bookId] || 0;
        if (holdingQty >= 2) {
          alert(`Không thể mượn thêm sách này! Người dùng đang giữ ${holdingQty} cuốn cùng loại (Giới hạn tối đa 2 cuốn giống nhau).`);
          return prev;
        }
        // Trường hợp hy hữu: Nếu form cho phép chọn số lượng (ở đây checkbox là 1), 
        // thì holdingQty + (sl_trong_form) + 1 > 2

        return { ...prev, bookIds: [...prev.bookIds, bookId] };
      } 
      
      // B. Nếu bỏ chọn
      else {
        return { ...prev, bookIds: prev.bookIds.filter(id => id !== bookId) };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.readerId) return alert("Vui lòng chọn bạn đọc");
    if (!form.bookIds.length) return alert("Vui lòng chọn ít nhất 1 cuốn sách");
    
    // Check lại lần cuối (Double check)
    if (currentBorrowedCount + form.bookIds.length > userQuota) {
      return alert(`Vượt quá hạn mức mượn sách (${userQuota} cuốn).`);
    }

    setIsSubmitting(true);
    try {
      await createBorrowSlip(form);
      onSuccess();
      // Reset form
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

  // Tính toán UI
  const isQuotaFull = currentBorrowedCount >= userQuota;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 600, maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Phiếu Mượn Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 1. Chọn Người dùng */}
          <div className="form-group">
            <label className="form-label">Bạn Đọc *</label>
            <input
              className="form-input"
              placeholder="Tìm bạn đọc theo tên, email hoặc ID..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
              onFocus={() => setUserSearch("")}
              style={{ marginBottom: 8 }}
            />
            
            {userSearch !== null && (filteredUsers.length > 0 || users?.length === 0) && (
              <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4, marginBottom: 8, backgroundColor: "#fff" }}>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => (
                    <div
                      key={u.id}
                      style={{
                        padding: "10px 12px",
                        cursor: "pointer",
                        backgroundColor: form.readerId === u.id ? "#c8e6c9" : "transparent",
                        borderBottom: "1px solid #eee",
                      }}
                      onClick={() => {
                        setForm({ ...form, readerId: u.id, bookIds: [] }); // Reset sách khi đổi user
                        setUserSearch("");
                      }}
                    >
                      <div><strong>ID{u.id}</strong> - {u.username} (Quota: {u.bookQuota || 5})</div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: 10, color: "#999" }}>Không tìm thấy bạn đọc</div>
                )}
              </div>
            )}

            {/* Thông báo trạng thái Hạn mức */}
            {form.readerId > 0 && (
              <div style={{ marginBottom: 8, padding: 12, backgroundColor: isQuotaFull ? "#ffebee" : "#e8f5e9", borderRadius: 4, border: "1px solid #ddd" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>
                    ✓ Người mượn: <b>{localUsers?.find(u => u.id === form.readerId)?.username}</b>
                  </span>
                  <button
                    type="button"
                    style={{ padding: "2px 6px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer" }}
                    onClick={() => { setForm({ ...form, readerId: 0, bookIds: [] }); setCurrentBorrowedCount(0); }}
                  >
                    Đổi
                  </button>
                </div>
                
                <div style={{ marginTop: 8, fontSize: '13px', color: isQuotaFull ? '#d32f2f' : '#2e7d32', display: 'flex', alignItems: 'center', gap: 6 }}>
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
          <div className="form-group">
            <label className="form-label">Sách Mượn *</label>
            <input
              className="form-input"
              placeholder="Tìm sách..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              disabled={form.readerId === 0 || isQuotaFull && form.bookIds.length === 0}
              style={{ marginBottom: 8 }}
            />
            
            <div style={{ border: "1px solid #ddd", borderRadius: 4, padding: 8, maxHeight: 200, overflowY: "auto", backgroundColor: (form.readerId === 0) ? "#f5f5f5" : "#fff" }}>
              {filteredBooks.length === 0 ? (
                <p style={{ color: "#999", textAlign: "center" }}>Không có sách</p>
              ) : (
                filteredBooks.map(b => {
                  const isChecked = form.bookIds.includes(b.id);
                  // Kiểm tra đang giữ bao nhiêu cuốn loại này
                  const holdingThisBook = holdingBooksMap[b.id] || 0;
                  // Disable nếu: 
                  // 1. Chưa chọn User
                  // 2. Full Quota (và sách này chưa được chọn)
                  // 3. Đã giữ >= 2 cuốn loại này (và sách này chưa được chọn)
                  const isDisabled = form.readerId === 0 || 
                                     (!isChecked && (currentBorrowedCount + form.bookIds.length >= userQuota)) ||
                                     (!isChecked && holdingThisBook >= 2);

                  return (
                    <label 
                      key={b.id} 
                      style={{ 
                        display: "flex", alignItems: "center", gap: 8, padding: 6, 
                        cursor: isDisabled ? "not-allowed" : "pointer", 
                        borderBottom: "1px solid #eee",
                        opacity: isDisabled ? 0.5 : 1,
                        backgroundColor: isChecked ? "#fff9c4" : "transparent"
                      }}
                      title={isDisabled ? (holdingThisBook >= 2 ? "Đã mượn tối đa 2 cuốn loại này" : "Hết hạn mức mượn") : ""}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleBook(b.id)}
                        disabled={isDisabled}
                      />
                      <div style={{display:'flex', flexDirection:'column'}}>
                        <span><strong>ID{b.id}</strong> - {b.title}</span>
                        {holdingThisBook > 0 && (
                          <span style={{fontSize: 11, color: '#f57c00'}}>
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
              <div style={{ marginTop: 8, padding: 8, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>
                  ✓ Đã chọn ({form.bookIds.length}):
                </div>
                {form.bookIds.map(id => {
                  const book = localBooks?.find(b => b.id === id) || books?.find(b => b.id === id);
                  return (
                    <div key={id} style={{ fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                      <span>• {book?.title}</span>
                      <button
                        type="button"
                        style={{ padding: "0px 6px", background: "#ff6b6b", color: "#fff", border: "none", borderRadius: 3, cursor: "pointer" }}
                        onClick={() => toggleBook(id)}
                      >
                        X
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Ghi Chú</label>
            <textarea
              className="form-input form-textarea"
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={3}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting || (isQuotaFull && form.bookIds.length === 0)}
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Phiếu Mượn"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
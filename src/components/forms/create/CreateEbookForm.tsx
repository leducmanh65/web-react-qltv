import React, { useState, useEffect } from "react";
import { X, BookOpen, Layers, Maximize, Image, Type } from "lucide-react";
import { createEbookPage, getAllBooks } from "../../../api/apiService";
import type { Book } from "../../../hooks/useManagementHooks";

interface CreateEbookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  books?: Book[];
  initialBookId?: number; // Thêm prop này để tự chọn sách
}

export default function CreateEbookForm({ isOpen, onClose, onSuccess, books = [], initialBookId = 0 }: CreateEbookFormProps) {
  const [form, setForm] = useState({
    bookId: initialBookId, // Dùng giá trị khởi tạo
    pageNumber: 1,
    imageUrl: "",
    contentText: "",
    width: 0,
    height: 0,
  });
  
  const [localBooks, setLocalBooks] = useState<Book[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (books.length > 0) {
        setLocalBooks(books);
      } else {
        getAllBooks().then((res: any) => {
          setLocalBooks(res?.data || res || []);
        }).catch(err => console.error("Lỗi tải sách:", err));
      }
      
      // Reset form khi mở lại, nhưng giữ bookId nếu có
      if (initialBookId > 0) {
         setForm(prev => ({ ...prev, bookId: initialBookId }));
      }
    }
  }, [isOpen, books, initialBookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.bookId || form.bookId === 0) return alert("Vui lòng chọn sách!");
    if (!form.imageUrl.trim()) return alert("URL hình ảnh bắt buộc!");
    
    setIsSubmitting(true);

    const payload = {
      bookId: Number(form.bookId),
      pageNumber: Number(form.pageNumber) || 1,
      imageUrl: form.imageUrl,
      contentText: form.contentText || "",
      width: Number(form.width) || 0,
      height: Number(form.height) || 0,
    };

    try {
      await createEbookPage(payload);
      
      // --- THÔNG BÁO THÀNH CÔNG ---
      alert(`Đã thêm trang số ${form.pageNumber} thành công!`); 
      
      onSuccess(); // Gọi refetch ở trang cha
      
      // Reset form để nhập trang tiếp theo (Tăng số trang lên 1)
      setForm(prev => ({ 
        ...prev, 
        pageNumber: prev.pageNumber + 1, 
        imageUrl: "", 
        contentText: "",
        // Giữ nguyên bookId, width, height để nhập cho nhanh
      }));
    } catch (err: any) {
      console.error("Create ebook page failed:", err);
      alert(err?.response?.data?.message || "Tạo trang thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // --- STYLES OBJECTS ---
  const overlayStyle: React.CSSProperties = {
    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backdropFilter: 'blur(4px)'
  };

  const modalStyle: React.CSSProperties = {
    backgroundColor: '#fff', borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
    width: '600px', maxWidth: '95%', maxHeight: '90vh',
    display: 'flex', flexDirection: 'column', overflow: 'hidden'
  };

  const headerStyle: React.CSSProperties = {
    padding: '16px 24px', borderBottom: '1px solid #f0f0f0',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: '#f9fafb'
  };

  const bodyStyle: React.CSSProperties = { padding: '24px', overflowY: 'auto' };

  const labelStyle: React.CSSProperties = {
    display: 'flex', alignItems: 'center', gap: '6px',
    fontWeight: 600, fontSize: '14px', marginBottom: '6px', color: '#374151'
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '6px',
    border: '1px solid #d1d5db', fontSize: '14px', outline: 'none',
    backgroundColor: '#fff', color: '#111'
  };

  const rowStyle: React.CSSProperties = { display: 'flex', gap: '16px', marginBottom: '16px' };

  const footerStyle: React.CSSProperties = {
    padding: '16px 24px', borderTop: '1px solid #f0f0f0',
    display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#fff'
  };

  const btnPrimaryStyle: React.CSSProperties = {
    backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px',
    padding: '10px 20px', fontSize: '14px', fontWeight: 600,
    cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1,
    display: 'flex', alignItems: 'center', gap: '6px'
  };

  const btnCancelStyle: React.CSSProperties = {
    backgroundColor: '#fff', color: '#374151', border: '1px solid #d1d5db',
    borderRadius: '6px', padding: '10px 20px', fontSize: '14px', fontWeight: 500, cursor: 'pointer'
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>Upload Trang Ebook</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: 4 }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          <form onSubmit={handleSubmit}>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}><BookOpen size={16} color="#3b82f6"/> Chọn Sách *</label>
              <select
                style={inputStyle}
                value={form.bookId}
                onChange={(e) => setForm({ ...form, bookId: parseInt(e.target.value) })}
                required
              >
                <option value="0">-- Chọn sách --</option>
                {localBooks.map(b => (
                  <option key={b.id} value={b.id}>ID{b.id} - {b.title}</option>
                ))}
              </select>
            </div>

            <div style={rowStyle}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Layers size={16} color="#f59e0b"/> Trang số *</label>
                <input
                  type="number"
                  style={inputStyle}
                  value={form.pageNumber}
                  onChange={(e) => setForm({ ...form, pageNumber: parseInt(e.target.value || "0") })}
                  required
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Maximize size={16} color="#10b981"/> Rộng (px)</label>
                <input type="number" style={inputStyle} value={form.width} onChange={(e) => setForm({ ...form, width: parseInt(e.target.value || "0") })} placeholder="0" />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Maximize size={16} color="#10b981"/> Cao (px)</label>
                <input type="number" style={inputStyle} value={form.height} onChange={(e) => setForm({ ...form, height: parseInt(e.target.value || "0") })} placeholder="0" />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}><Image size={16} color="#8b5cf6"/> URL Hình Ảnh *</label>
              <input
                style={inputStyle}
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
                required
              />
              {form.imageUrl && (
                <div style={{ marginTop: '8px', padding: '10px', border: '1px dashed #d1d5db', borderRadius: '6px', textAlign: 'center' }}>
                  <img src={form.imageUrl} alt="Preview" style={{ maxHeight: '100px', maxWidth: '100%', objectFit: 'contain' }} onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}><Type size={16} color="#6b7280"/> Nội dung văn bản (OCR)</label>
              <textarea
                style={{ ...inputStyle, minHeight: '80px', fontFamily: 'inherit' }}
                value={form.contentText}
                onChange={(e) => setForm({ ...form, contentText: e.target.value })}
                placeholder="Nhập nội dung chữ..."
              />
            </div>

          </form>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button type="button" onClick={onClose} style={btnCancelStyle}>Đóng</button>
          <button onClick={handleSubmit} disabled={isSubmitting} style={btnPrimaryStyle}>
            {isSubmitting ? "Đang lưu..." : "Lưu & Nhập Tiếp"}
          </button>
        </div>

      </div>
    </div>
  );
}
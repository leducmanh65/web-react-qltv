import React, { useState } from "react";
import { X, User, Mail, Lock, Phone, Calendar, Save } from "lucide-react";
import { createUser } from "../../../api/apiService";

interface CreateUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateUserForm({ isOpen, onClose, onSuccess }: CreateUserFormProps) {
  const [form, setForm] = useState({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username.trim()) return alert("Username bắt buộc");
    if (!form.password.trim()) return alert("Mật khẩu bắt buộc");
    if (!form.email.trim()) return alert("Email bắt buộc");
    
    setIsSubmitting(true);
    try {
      await createUser(form);
      alert("Tạo người dùng thành công!");
      onSuccess();
      setForm({ username: "", password: "", email: "", phoneNumber: "", birthDate: "" });
      onClose();
    } catch (err: any) {
      console.error("Create user failed", err);
      alert(err?.response?.data?.message || "Tạo người dùng thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // --- STYLES OBJECTS (Đảm bảo chạy 100%) ---
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
    width: '500px', maxWidth: '95%', maxHeight: '90vh',
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
    backgroundColor: '#fff', color: '#111', marginBottom: '16px'
  };

  const footerStyle: React.CSSProperties = {
    padding: '16px 24px', borderTop: '1px solid #f0f0f0',
    display: 'flex', justifyContent: 'flex-end', gap: '12px', backgroundColor: '#fff'
  };

  const btnPrimaryStyle: React.CSSProperties = {
    backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px',
    padding: '10px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
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
          <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>Thêm Người Dùng</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        {/* Body */}
        <div style={bodyStyle}>
          <form onSubmit={handleSubmit}>
            <div>
              <label style={labelStyle}><User size={16} color="#3b82f6"/> Username *</label>
              <input style={inputStyle} value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="Nhập tên đăng nhập" required />
            </div>

            <div>
              <label style={labelStyle}><Mail size={16} color="#ef4444"/> Email *</label>
              <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="example@email.com" required />
            </div>

            <div>
              <label style={labelStyle}><Lock size={16} color="#f97316"/> Mật Khẩu *</label>
              <input type="password" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••" required />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Phone size={16} color="#22c55e"/> SĐT</label>
                <input style={inputStyle} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} placeholder="09xxx..." />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Calendar size={16} color="#a855f7"/> Ngày Sinh</label>
                <input type="date" style={inputStyle} value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div style={footerStyle}>
          <button onClick={onClose} style={btnCancelStyle}>Hủy</button>
          <button onClick={handleSubmit} disabled={isSubmitting} style={btnPrimaryStyle}>
            {isSubmitting ? "Đang lưu..." : <><Save size={18}/> Lưu</>}
          </button>
        </div>

      </div>
    </div>
  );
}
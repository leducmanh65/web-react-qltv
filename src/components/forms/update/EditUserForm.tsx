import React, { useState, useEffect } from "react";
import { X, User, Mail, Phone, Calendar, Save, Lock } from "lucide-react";
import { updateUser } from "../../../api/apiService";
import type { User as UserType } from "../../../hooks/useManagementHooks";

interface EditUserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: UserType | null;
}

export default function EditUserForm({ isOpen, onClose, onSuccess, initialData }: EditUserFormProps) {
  const [form, setForm] = useState({
    password: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = initialData?.roles?.includes('admin') || initialData?.roles?.includes('Admin') || initialData?.roles?.includes('ADMIN');

  useEffect(() => {
    if (isOpen && initialData) {
      let formattedDate = "";
      if (Array.isArray(initialData.birthDate)) {
        const [y, m, d] = initialData.birthDate;
        formattedDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      } else if (typeof initialData.birthDate === "string") {
        formattedDate = initialData.birthDate.substring(0, 10);
      }

      setForm({
        password: "",
        email: initialData.email || "",
        phoneNumber: initialData.phoneNumber || "",
        birthDate: formattedDate,
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id) return;
    if (!form.email.trim()) return alert("Email bắt buộc");

    // Kiểm tra mật khẩu: bắt buộc 8 ký tự trở lên trừ admin
    const isAdmin = initialData.roles?.includes('admin') || initialData.roles?.includes('Admin') || initialData.roles?.includes('ADMIN');
    if (!isAdmin) {
      if (!form.password.trim()) {
        return alert("Mật khẩu bắt buộc cho user không phải admin");
      }
      if (form.password.length < 8) {
        return alert("Mật khẩu phải có ít nhất 8 ký tự");
      }
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        birthDate: form.birthDate ? new Date(form.birthDate) : null
      };
      await updateUser(initialData.id, payload);
      alert("Cập nhật thành công!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Update failed", err);
      alert(err?.response?.data?.message || "Cập nhật thất bại");
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
        
        <div style={headerStyle}>
          <h3 style={{ margin: 0, fontSize: '18px', color: '#111827' }}>Cập Nhật Người Dùng</h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={20} color="#6b7280" />
          </button>
        </div>

        <div style={bodyStyle}>
          <form onSubmit={handleSubmit}>
            <div>
              <label style={labelStyle}><Lock size={16} color="#f59e0b"/> Mật Khẩu Mới{!isAdmin && ' *'}</label>
              <input type="password" style={inputStyle} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!isAdmin} />
            </div>

            <div>
              <label style={labelStyle}><Mail size={16} color="#ef4444"/> Email *</label>
              <input type="email" style={inputStyle} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Phone size={16} color="#22c55e"/> SĐT</label>
                <input style={inputStyle} value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}><Calendar size={16} color="#a855f7"/> Ngày Sinh</label>
                <input type="date" style={inputStyle} value={form.birthDate} onChange={(e) => setForm({ ...form, birthDate: e.target.value })} />
              </div>
            </div>
          </form>
        </div>

        <div style={footerStyle}>
          <button onClick={onClose} style={btnCancelStyle}>Hủy</button>
          <button onClick={handleSubmit} disabled={isSubmitting} style={btnPrimaryStyle}>
            {isSubmitting ? "Đang lưu..." : <><Save size={18}/> Lưu Thay Đổi</>}
          </button>
        </div>

      </div>
    </div>
  );
}
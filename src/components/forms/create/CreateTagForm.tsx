import React, { useState } from "react";
import { X } from "lucide-react";
import { createTag } from "../../../api/apiService";
import "../../../styles/Admin/admin-modal.css"; 

interface CreateTagFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateTagForm({ isOpen, onClose, onSuccess }: CreateTagFormProps) {
  const [form, setForm] = useState({ tagName: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.tagName.trim()) return alert("Tên tag bắt buộc");
    
    setIsSubmitting(true);
    try {
      await createTag(form);
      alert("Tạo tag thành công!");
      onSuccess();
      setForm({ tagName: "", description: "" });
      onClose();
    } catch (err) {
      console.error("Create tag failed", err);
      alert("Tạo tag thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Tạo Tag Mới</h3>
          <button className="admin-btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Tên Tag *</label>
            <input
              className="admin-form-input"
              value={form.tagName}
              onChange={(e) => setForm({ ...form, tagName: e.target.value })}
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Mô Tả</label>
            <textarea
              className="admin-form-input admin-form-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Tag"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
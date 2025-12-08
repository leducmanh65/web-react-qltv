import React, { useState } from "react";
import { X } from "lucide-react";
import { createCategory } from "../../../api/apiService";
import "../../../styles/Admin/admin-modal.css"; 

interface CreateCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCategoryForm({ isOpen, onClose, onSuccess }: CreateCategoryFormProps) {
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.categoryName.trim()) return alert("Tên danh mục bắt buộc");
    
    setIsSubmitting(true);
    try {
      await createCategory(form);
      alert("Tạo danh mục thành công!");
      onSuccess();
      setForm({ categoryName: "", description: "" });
      onClose();
    } catch (err) {
      console.error("Create category failed", err);
      alert("Tạo danh mục thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Tạo Danh Mục Mới</h3>
          <button className="admin-btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-form-label">Tên Danh Mục *</label>
            <input
              className="admin-form-input"
              value={form.categoryName}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
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
              {isSubmitting ? "Đang tạo..." : "Tạo Danh Mục"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateCategory } from "../../../api/apiService";
import type { Category } from "../../../hooks/useManagementHooks";
import "../../../styles/Admin/admin-modal.css"; // Import CSS chung

interface EditCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: Category | null;
}

export default function EditCategoryForm({ isOpen, onClose, onSuccess, initialData }: EditCategoryFormProps) {
  const [form, setForm] = useState({ categoryName: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        categoryName: initialData.categoryName || "",
        description: initialData.description || "",
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id) return;
    if (!form.categoryName.trim()) return alert("Tên danh mục bắt buộc");

    setIsSubmitting(true);
    try {
      await updateCategory(initialData.id, form);
      alert("Cập nhật danh mục thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update category failed", err);
      alert("Cập nhật danh mục thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Cập Nhật Danh Mục: ID{initialData?.id}</h3>
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
              {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
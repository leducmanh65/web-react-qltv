import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateTag } from "../../../api/apiService";
import type { Tag } from "../../../hooks/useManagementHooks";
import "../../../styles/Admin/admin-modal.css"; // Import CSS chung

interface EditTagFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: Tag | null;
}

export default function EditTagForm({ isOpen, onClose, onSuccess, initialData }: EditTagFormProps) {
  const [form, setForm] = useState({ tagName: "", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        tagName: initialData.tagName || "",
        description: initialData.description || "",
      });
    }
  }, [isOpen, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id) return;
    if (!form.tagName.trim()) return alert("Tên tag bắt buộc");

    setIsSubmitting(true);
    try {
      await updateTag(initialData.id, form);
      alert("Cập nhật Tag thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update tag failed", err);
      alert("Cập nhật Tag thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Cập Nhật Tag: ID{initialData?.id}</h3>
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
              {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
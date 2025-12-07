import { useState } from "react";
import { X } from "lucide-react";
import { createCategory } from "../../../api/apiService";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Danh Mục Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên Danh Mục *</label>
            <input
              className="form-input"
              value={form.categoryName}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mô Tả</label>
            <textarea
              className="form-input form-textarea"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={4}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Danh Mục"}
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

import { useState } from "react";
import { X } from "lucide-react";
import { createTag } from "../../../api/apiService";

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
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Tag Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên Tag *</label>
            <input
              className="form-input"
              value={form.tagName}
              onChange={(e) => setForm({ ...form, tagName: e.target.value })}
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
              {isSubmitting ? "Đang tạo..." : "Tạo Tag"}
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

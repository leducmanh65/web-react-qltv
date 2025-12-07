import { useState } from "react";
import { X } from "lucide-react";
import { createAuthor } from "../../../api/apiService";

interface CreateAuthorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateAuthorForm({ isOpen, onClose, onSuccess }: CreateAuthorFormProps) {
  const [form, setForm] = useState({ authorName: "", biography: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.authorName.trim()) return alert("Tên tác giả bắt buộc");
    
    setIsSubmitting(true);
    try {
      await createAuthor(form);
      onSuccess();
      setForm({ authorName: "", biography: "" });
      onClose();
    } catch (err) {
      console.error("Create author failed", err);
      alert("Tạo tác giả thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Tác Giả Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Tên Tác Giả *</label>
            <input
              className="form-input"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Tiểu Sử</label>
            <textarea
              className="form-input form-textarea"
              value={form.biography}
              onChange={(e) => setForm({ ...form, biography: e.target.value })}
              rows={4}
            />
          </div>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 12 }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Tác Giả"}
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

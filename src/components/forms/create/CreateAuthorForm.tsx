import { useState } from "react";
import { X } from "lucide-react";
import { createAuthor } from "../../../api/apiService";
import "../../../styles/Admin/author.css"; 

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
      alert("Tạo tác giả thành công!");
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
    <div className="author-modal-overlay" onClick={onClose}>
      <div className="author-modal-content" onClick={(e) => e.stopPropagation()}>
        
        <div className="author-modal-header">
          <h3 className="author-modal-title">Tạo Tác Giả Mới</h3>
          <button className="author-btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="author-form-group">
            <label className="author-form-label">Tên Tác Giả *</label>
            <input
              className="author-form-input"
              value={form.authorName}
              onChange={(e) => setForm({ ...form, authorName: e.target.value })}
              placeholder="Nhập tên tác giả..."
              required
            />
          </div>

          <div className="author-form-group">
            <label className="author-form-label">Tiểu Sử</label>
            <textarea
              className="author-form-input author-form-textarea"
              value={form.biography}
              onChange={(e) => setForm({ ...form, biography: e.target.value })}
              rows={4}
              placeholder="Nhập tiểu sử (nếu có)..."
            />
          </div>

          <div className="author-modal-footer">
            <button type="button" className="author-btn author-btn-cancel" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="author-btn author-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Tác Giả"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
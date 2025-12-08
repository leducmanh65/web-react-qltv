import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { updateAuthor } from "../../../api/apiService";
import type { Author } from "../../../hooks/useManagementHooks";
import "../../../styles/Admin/author.css"; 

interface EditAuthorFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: Author | null;
}

export default function EditAuthorForm({
    isOpen,
    onClose,
    onSuccess,
    initialData
}: EditAuthorFormProps) {
    const [form, setForm] = useState({ authorName: "", biography: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen && initialData) {
            setForm({
                authorName: initialData.authorName || "",
                biography: initialData.biography || ""
            });
        }
    }, [isOpen, initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!initialData?.id) return;
        if (!form.authorName.trim()) return alert("Tên tác giả bắt buộc");

        setIsSubmitting(true);
        try {
            await updateAuthor(initialData.id, form);
            alert("Cập nhật tác giả thành công!");
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Update author failed", err);
            alert("Cập nhật tác giả thất bại");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="author-modal-overlay" onClick={onClose}>
            <div className="author-modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div className="author-modal-header">
                    <h3 className="author-modal-title">Cập Nhật Tác Giả: ID{initialData?.id}</h3>
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
                            required
                        />
                    </div>

                    <div className="author-form-group">
                        <label className="author-form-label">Tiểu Sử</label>
                        <textarea
                            className="author-form-input author-form-textarea"
                            value={form.biography}
                            onChange={(e) => setForm({ ...form, biography: e.target.value })}
                            rows={5}
                        />
                    </div>

                    <div className="author-modal-footer">
                        <button type="button" className="author-btn author-btn-cancel" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="author-btn author-btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
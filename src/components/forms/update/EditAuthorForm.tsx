import { useState, useEffect } from "react";
import { X } from "lucide-react";
// Đảm bảo bạn đã có hàm updateAuthor trong apiService
import { updateAuthor } from "../../../api/apiService";
import type { Author } from "../../../hooks/useManagementHooks";

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

    // Khi modal mở hoặc data thay đổi, điền dữ liệu cũ vào form
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
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 500 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3>Cập Nhật Tác Giả: ID{initialData?.id}</h3>
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
                            rows={5}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
                        <button type="submit" className="btn-primary" disabled={isSubmitting}>
                            {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
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
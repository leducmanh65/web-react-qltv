import { useState, useEffect } from "react";
import { X } from "lucide-react";
// Import hàm updateCategory từ apiService
import { updateCategory } from "../../../api/apiService";
import type { Category } from "../../../hooks/useManagementHooks";

interface EditCategoryFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    initialData: Category | null;
}

export default function EditCategoryForm({
    isOpen,
    onClose,
    onSuccess,
    initialData,
}: EditCategoryFormProps) {
    const [form, setForm] = useState({ categoryName: "", description: "" });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load dữ liệu cũ khi mở modal
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
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ width: 500 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <h3>Cập Nhật Danh Mục: ID{initialData?.id}</h3>
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
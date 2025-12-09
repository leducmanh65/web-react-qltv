import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createBook, getAllAuthors, getAllCategories, getAllTags } from "../../../api/apiService";
import type { Author, Category, Tag } from "../../../hooks/useManagementHooks";
import "../../../styles/Admin/admin-modal.css"; 

interface CreateBookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  onRefetchAuthors?: () => void;     
  onRefetchCategories?: () => void;
  onRefetchTags?: () => void;
}

export default function CreateBookForm({
  isOpen,onClose,onSuccess,authors,categories,tags,
}: CreateBookFormProps) {

  const [bookForm, setBookForm] = useState({
    title: "",
    bookCode: "",
    publishYear: new Date().getFullYear(),
    price: 0,
    totalQuantity: 1,
    isbn: "",
    description: "",
    categoryId: 0,
    authorIds: [] as number[],
    tagIds: [] as number[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  // Local Data
  const [localAuthors, setLocalAuthors] = useState<Author[]>([]);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  // Load Data
  useEffect(() => {
    if (isOpen) {
      if (authors.length > 0) setLocalAuthors(authors);
      else getAllAuthors().then((res: any) => setLocalAuthors(res?.data || res || []));

      if (categories.length > 0) setLocalCategories(categories);
      else getAllCategories().then((res: any) => setLocalCategories(res?.data || res || []));

      if (tags.length > 0) setLocalTags(tags);
      else getAllTags().then((res: any) => setLocalTags(res?.data || res || []));
    }
  }, [isOpen, authors, categories, tags]);

  const handleBookInput = (k: string, v: any) => setBookForm((prev) => ({ ...prev, [k]: v }));

  // Filters
  const filteredCategories = (localCategories || []).filter((c) =>
    categorySearch === "" || c.categoryName.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredAuthors = (localAuthors || []).filter((a) =>
    authorSearch === "" || a.authorName.toLowerCase().includes(authorSearch.toLowerCase())
  );
  const filteredTags = (localTags || []).filter((t) =>
    tagSearch === "" || t.tagName.toLowerCase().includes(tagSearch.toLowerCase())
  );

  const submitCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: any = {
        title: bookForm.title,
        bookCode: bookForm.bookCode,
        publishYear: bookForm.publishYear,
        price: bookForm.price,
        totalQuantity: bookForm.totalQuantity,
        isbn: bookForm.isbn,
        description: bookForm.description,
        authorIds: bookForm.authorIds,
        tagIds: bookForm.tagIds,
      };

      if (bookForm.categoryId > 0) payload.categoryId = bookForm.categoryId;

      await createBook(payload);
      alert("Tạo sách thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Create failed", err);
      alert("Tạo sách thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 800, maxWidth: '95%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div className="admin-modal-header">
          <h3 className="admin-modal-title">Tạo Sách Mới</h3>
          <button className="admin-btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={submitCreateBook}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {/* Cột trái */}
            <div>
              <div className="admin-form-group">
                <label className="admin-form-label">Tiêu Đề *</label>
                <input className="admin-form-input" value={bookForm.title} onChange={(e) => handleBookInput("title", e.target.value)} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Mã Sách</label>
                <input className="admin-form-input" value={bookForm.bookCode} onChange={(e) => handleBookInput("bookCode", e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Năm Xuất Bản</label>
                <input type="number" className="admin-form-input" value={bookForm.publishYear} onChange={(e) => handleBookInput("publishYear", parseInt(e.target.value))} />
              </div>
              
              {/* Dropdown Category */}
              <div className="admin-form-group">
                <label className="admin-form-label">Danh Mục</label>
                <input className="admin-form-input" placeholder="Tìm..." value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} />
                {filteredCategories.length > 0 && (
                  <div style={{ maxHeight: 100, overflowY: "auto", border: "1px solid #ddd", marginTop: 4 }}>
                    {filteredCategories.map((c) => (
                      <div key={c.id} style={{ padding: 8, cursor: "pointer", background: bookForm.categoryId === c.id ? "#e3f2fd" : "#fff" }} onClick={() => handleBookInput("categoryId", c.id)}>{c.categoryName}</div>
                    ))}
                  </div>
                )}
                {bookForm.categoryId > 0 && <div style={{ fontSize: 12, marginTop: 4 }}>Đã chọn: <b>{localCategories.find(c => c.id === bookForm.categoryId)?.categoryName}</b></div>}
              </div>
            </div>

            {/* Cột phải */}
            <div>
              <div className="admin-form-group">
                <label className="admin-form-label">Số Lượng</label>
                <input type="number" className="admin-form-input" value={bookForm.totalQuantity} onChange={(e) => handleBookInput("totalQuantity", parseInt(e.target.value))} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">ISBN</label>
                <input className="admin-form-input" value={bookForm.isbn} onChange={(e) => handleBookInput("isbn", e.target.value)} />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Giá</label>
                <input type="number" className="admin-form-input" value={bookForm.price} onChange={(e) => handleBookInput("price", parseFloat(e.target.value))} />
              </div>

              {/* Dropdown Author */}
              <div className="admin-form-group">
                <label className="admin-form-label">Tác Giả</label>
                <input className="admin-form-input" placeholder="Tìm..." value={authorSearch} onChange={(e) => setAuthorSearch(e.target.value)} />
                {filteredAuthors.length > 0 && (
                  <div style={{ maxHeight: 100, overflowY: "auto", border: "1px solid #ddd", marginTop: 4 }}>
                    {filteredAuthors.map((a) => (
                      <div key={a.id} style={{ padding: 8, cursor: "pointer", background: bookForm.authorIds.includes(a.id) ? "#c8e6c9" : "#fff", display: 'flex', gap: 5 }} onClick={() => {
                        const newIds = bookForm.authorIds.includes(a.id) ? bookForm.authorIds.filter((id) => id !== a.id) : [...bookForm.authorIds, a.id];
                        handleBookInput("authorIds", newIds);
                      }}>
                        <input type="checkbox" checked={bookForm.authorIds.includes(a.id)} readOnly /> {a.authorName}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Full width rows */}
            <div style={{ gridColumn: "1 / -1" }}>

              <div className="admin-form-group">
                <label className="admin-form-label">Tags</label>
                <input className="admin-form-input" placeholder="Tìm tag..." value={tagSearch} onChange={(e) => setTagSearch(e.target.value)} />
                {filteredTags.length > 0 && (
                  <div style={{ maxHeight: 100, overflowY: "auto", border: "1px solid #ddd", marginTop: 4 }}>
                    {filteredTags.map((t) => (
                      <div key={t.id} style={{ padding: 8, cursor: "pointer", background: bookForm.tagIds.includes(t.id) ? "#fff9c4" : "#fff", display: "flex", gap: 5 }} onClick={() => {
                        const newIds = bookForm.tagIds.includes(t.id) ? bookForm.tagIds.filter((id) => id !== t.id) : [...bookForm.tagIds, t.id];
                        handleBookInput("tagIds", newIds);
                      }}>
                        <input type="checkbox" checked={bookForm.tagIds.includes(t.id)} readOnly /> {t.tagName}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Mô Tả</label>
                <textarea className="admin-form-input admin-form-textarea" value={bookForm.description} onChange={(e) => handleBookInput("description", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="admin-btn admin-btn-cancel" onClick={onClose}>Hủy</button>
            <button type="submit" className="admin-btn admin-btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang xử lý..." : "Tạo Sách"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
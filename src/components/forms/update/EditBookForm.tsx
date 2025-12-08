import React, { useState, useEffect } from "react";
import { X, Book as BookIcon } from "lucide-react";
import { 
  updateBook, 
  getAllAuthors, getAllCategories, getAllTags 
} from "../../../api/apiService";
import type { Book, Author, Category, Tag } from "../../../hooks/useManagementHooks";

interface EditBookFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData: Book | null;
  authors: Author[];
  categories: Category[];
  tags: Tag[];
  onRefetchAuthors?: () => void;
  onRefetchCategories?: () => void;
  onRefetchTags?: () => void;
}

export default function EditBookForm({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  authors,
  categories,
  tags,
}: EditBookFormProps) {
  
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
    isEbook: false,
    ebookUrl: "",
    ebookContent: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search states
  const [categorySearch, setCategorySearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [tagSearch, setTagSearch] = useState(""); // Đã được sử dụng bên dưới

  const [localAuthors, setLocalAuthors] = useState<Author[]>([]);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  // Load danh sách dữ liệu
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

  // Load dữ liệu sách vào form
  useEffect(() => {
    if (isOpen && initialData) {
      // Kiểm tra tag EBOOK
      const hasEbookTag = initialData.tags?.some((t: any) => t.tagName && t.tagName.toUpperCase() === 'EBOOK');

      setBookForm({
        title: initialData.title || "",
        bookCode: initialData.bookCode || "",
        publishYear: Number(initialData.publishYear) || new Date().getFullYear(),
        price: Number(initialData.price) || 0,
        totalQuantity: Number(initialData.totalQuantity) || 0,
        isbn: initialData.isbn || "",
        description: initialData.description || "",
        categoryId: initialData.category?.id || 0,
        authorIds: initialData.authors ? initialData.authors.map(a => a.id) : [],
        tagIds: initialData.tags ? initialData.tags.map((t: any) => t.id) : [],
        isEbook: !!hasEbookTag,
        ebookUrl: initialData.ebookUrl || "",
        ebookContent: initialData.ebookContent || "",
      });
    }
  }, [isOpen, initialData]);

  const handleBookInput = (k: string, v: any) => {
    setBookForm((prev) => ({ ...prev, [k]: v }));
  };

  // Logic Submit
  const submitUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData?.id) return;
    
    setIsSubmitting(true);
    try {
      // Tìm ID của Tag "EBOOK"
      const ebookTagObj = localTags.find(t => t.tagName.toUpperCase() === 'EBOOK');
      let finalTagIds = [...bookForm.tagIds];

      if (ebookTagObj) {
        if (bookForm.isEbook) {
          if (!finalTagIds.includes(ebookTagObj.id)) finalTagIds.push(ebookTagObj.id);
        } else {
          finalTagIds = finalTagIds.filter(id => id !== ebookTagObj.id);
        }
      }

      const payload: any = {
        title: bookForm.title,
        bookCode: bookForm.bookCode,
        publishYear: Number(bookForm.publishYear),
        price: Number(bookForm.price),
        totalQuantity: Number(bookForm.totalQuantity),
        isbn: bookForm.isbn,
        description: bookForm.description,
        authorIds: bookForm.authorIds,
        tagIds: finalTagIds,
      };

      if (bookForm.categoryId > 0) {
        payload.categoryId = bookForm.categoryId;
      }

      await updateBook(initialData.id, payload);
      alert("Cập nhật sách thành công!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Update failed", err);
      alert(err?.response?.data?.message || "Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter helpers
  const filteredCategories = (localCategories || []).filter((c) =>
    categorySearch === "" || c.categoryName.toLowerCase().includes(categorySearch.toLowerCase())
  );
  const filteredAuthors = (localAuthors || []).filter((a) =>
    authorSearch === "" || a.authorName.toLowerCase().includes(authorSearch.toLowerCase())
  );
  const filteredTags = (localTags || []).filter((t) =>
    tagSearch === "" || t.tagName.toLowerCase().includes(tagSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 800, maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Cập Nhật Sách: ID{initialData?.id}</h3>
          <button className="btn-cancel" onClick={onClose} type="button"><X size={20} /></button>
        </div>

        <form onSubmit={submitUpdateBook}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div><label className="form-label">Tiêu Đề *</label><input className="form-input" value={bookForm.title} onChange={(e) => handleBookInput("title", e.target.value)} required /></div>
            <div><label className="form-label">Mã Sách</label><input className="form-input" value={bookForm.bookCode} onChange={(e) => handleBookInput("bookCode", e.target.value)} /></div>
            <div><label className="form-label">Năm Xuất Bản</label><input type="number" className="form-input" value={bookForm.publishYear} onChange={(e) => handleBookInput("publishYear", parseInt(e.target.value || "0"))} /></div>
            <div><label className="form-label">Giá</label><input type="number" className="form-input" value={bookForm.price} onChange={(e) => handleBookInput("price", parseFloat(e.target.value || "0"))} /></div>
            <div><label className="form-label">Số Lượng</label><input type="number" className="form-input" value={bookForm.totalQuantity} onChange={(e) => handleBookInput("totalQuantity", parseInt(e.target.value || "0"))} /></div>
            <div><label className="form-label">ISBN</label><input className="form-input" value={bookForm.isbn} onChange={(e) => handleBookInput("isbn", e.target.value)} /></div>
            <div style={{ gridColumn: "1 / -1" }}><label className="form-label">Mô Tả</label><textarea className="form-input form-textarea" value={bookForm.description} onChange={(e) => handleBookInput("description", e.target.value)} /></div>

            {/* --- DROPDOWN CATEGORY --- */}
            <div>
              <label className="form-label">Danh Mục</label>
              <input className="form-input" placeholder="Tìm..." value={categorySearch} onChange={(e) => setCategorySearch(e.target.value)} style={{ marginBottom: 8 }} />
              {filteredCategories.length > 0 && (
                <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", marginBottom: 8 }}>
                  {filteredCategories.map((c) => (
                    <div key={c.id} style={{ padding: 8, cursor: "pointer", background: bookForm.categoryId === c.id ? "#e3f2fd" : "#fff" }} onClick={() => handleBookInput("categoryId", c.id)}>{c.categoryName}</div>
                  ))}
                </div>
              )}
              {bookForm.categoryId > 0 && <div style={{ marginBottom: 8, fontSize: 12 }}>Đã chọn: <b>{localCategories.find(c => c.id === bookForm.categoryId)?.categoryName}</b></div>}
            </div>

            {/* --- DROPDOWN AUTHOR --- */}
            <div>
              <label className="form-label">Tác Giả</label>
              <input className="form-input" placeholder="Tìm..." value={authorSearch} onChange={(e) => setAuthorSearch(e.target.value)} style={{ marginBottom: 8 }} />
              {filteredAuthors.length > 0 && (
                <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", marginBottom: 8 }}>
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

            {/* --- DROPDOWN TAGS --- */}
            <div>
              <label className="form-label">Tags</label>
              <input className="form-input" placeholder="Tìm tag..." value={tagSearch} onChange={(e) => setTagSearch(e.target.value)} style={{ marginBottom: 8 }} />
              {filteredTags.length > 0 && (
                <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", marginBottom: 8 }}>
                  {filteredTags.map((t) => (
                    <div key={t.id} style={{ padding: 8, cursor: "pointer", background: bookForm.tagIds.includes(t.id) ? "#fff9c4" : "#fff", display: "flex", gap: 5 }}
                      onClick={() => {
                        const newIds = bookForm.tagIds.includes(t.id) ? bookForm.tagIds.filter((id) => id !== t.id) : [...bookForm.tagIds, t.id];
                        handleBookInput("tagIds", newIds);
                      }}>
                      <input type="checkbox" checked={bookForm.tagIds.includes(t.id)} readOnly /> {t.tagName}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* --- EBOOK CHECKBOX --- */}
            <div style={{ gridColumn: "1 / -1", marginTop: 10 }}>
              <label 
                style={{ 
                  display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
                  padding: "10px", border: "1px solid #e0e0e0", borderRadius: "8px",
                  backgroundColor: bookForm.isEbook ? "#f0fdf4" : "#fff" 
                }}
              >
                <input
                  type="checkbox"
                  checked={bookForm.isEbook}
                  onChange={(e) => handleBookInput("isEbook", e.target.checked)}
                  style={{ width: 18, height: 18 }}
                />
                <div>
                  <div style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <BookIcon size={18} color={bookForm.isEbook ? "green" : "gray"} />
                    Đánh dấu là Ebook
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    (Hệ thống sẽ tự động gán Tag "EBOOK" cho sách này)
                  </div>
                </div>
              </label>
            </div>

          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>Lưu Thay Đổi</button>
            <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
          </div>
        </form>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { createBook, createAuthor, createCategory, createTag, getAllAuthors, getAllCategories, getAllTags } from "../../../api/apiService";
import type { Author, Category, Tag } from "../../../hooks/useManagementHooks";

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
  isOpen,
  onClose,
  onSuccess,
  authors,
  categories,
  tags,
  onRefetchAuthors,
  onRefetchCategories,
  onRefetchTags,
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
    isEbook: false,
    ebookUrl: "",
    ebookContent: "",
  });

  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorBio, setNewAuthorBio] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDesc, setNewCategoryDesc] = useState("");
  const [newTagName, setNewTagName] = useState("");
  const [newTagDesc, setNewTagDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Search filter state
  const [categorySearch, setCategorySearch] = useState("");
  const [authorSearch, setAuthorSearch] = useState("");
  const [tagSearch, setTagSearch] = useState("");

  // Modal states for create dialogs
  const [showCreateAuthorDialog, setShowCreateAuthorDialog] = useState(false);
  const [showCreateCategoryDialog, setShowCreateCategoryDialog] = useState(false);
  const [showCreateTagDialog, setShowCreateTagDialog] = useState(false);

  // Local state to fetch and cache all items for searching
  const [localAuthors, setLocalAuthors] = useState<Author[]>([]);
  const [localCategories, setLocalCategories] = useState<Category[]>([]);
  const [localTags, setLocalTags] = useState<Tag[]>([]);

  // Fetch all data when modal opens
  useEffect(() => {
    if (isOpen && localAuthors.length === 0) {
      Promise.all([
        getAllAuthors(),
        getAllCategories(),
        getAllTags()
      ])
        .then(([authorsRes, categoriesRes, tagsRes]: any) => {
          setLocalAuthors(authorsRes?.data || authorsRes || []);
          setLocalCategories(categoriesRes?.data || categoriesRes || []);
          setLocalTags(tagsRes?.data || tagsRes || []);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          // Fall back to props data
          setLocalAuthors(authors || []);
          setLocalCategories(categories || []);
          setLocalTags(tags || []);
        });
    }
  }, [isOpen]);

  const handleBookInput = (k: string, v: any) =>
    setBookForm((prev) => ({ ...prev, [k]: v }));

  // Filter functions for suggestions - search across all fields like SearchingItem
  const filteredCategories = (localCategories || []).filter((c) =>
    categorySearch === "" ||
    c.categoryName.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.id.toString().includes(categorySearch)
  );

  const filteredAuthors = (localAuthors || []).filter((a) =>
    authorSearch === "" ||
    a.authorName.toLowerCase().includes(authorSearch.toLowerCase()) ||
    a.id.toString().includes(authorSearch)
  );

  const filteredTags = (localTags || []).filter((t) =>
    tagSearch === "" ||
    t.tagName.toLowerCase().includes(tagSearch.toLowerCase()) ||
    t.id.toString().includes(tagSearch)
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
        categoryId: bookForm.categoryId || undefined,
        authorIds: bookForm.authorIds || [],
        tagIds: bookForm.tagIds || [],
      };

      if (bookForm.isEbook) {
        payload.isEbook = true;
        payload.ebookUrl = bookForm.ebookUrl;
        payload.ebookContent = bookForm.ebookContent;
      }

      await createBook(payload);
      onSuccess();
      resetForm();
      onClose();
    } catch (err) {
      console.error("Create book failed", err);
      alert("Tạo sách thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitCreateAuthor = async () => {
    if (!newAuthorName.trim()) return alert("Tên tác giả bắt buộc");
    try {
      const res: any = await createAuthor({
        authorName: newAuthorName,
        biography: newAuthorBio,
      });
      onRefetchAuthors?.();
      const createdId = res?.id || res?.data?.id;
      if (createdId)
        handleBookInput("authorIds", [...bookForm.authorIds, createdId]);
      setNewAuthorName("");
      setNewAuthorBio("");
    } catch (err) {
      console.error("Create author", err);
      alert("Tạo tác giả thất bại");
    }
  };

  const submitCreateCategory = async () => {
    if (!newCategoryName.trim()) return alert("Tên danh mục bắt buộc");
    try {
      const res: any = await createCategory({
        categoryName: newCategoryName,
        description: newCategoryDesc,
      });
      onRefetchCategories?.();
      const createdId = res?.id || res?.data?.id;
      if (createdId) handleBookInput("categoryId", createdId);
      setNewCategoryName("");
      setNewCategoryDesc("");
    } catch (err) {
      console.error("Create category", err);
      alert("Tạo danh mục thất bại");
    }
  };

  const submitCreateTag = async () => {
    if (!newTagName.trim()) return alert("Tên tag bắt buộc");
    try {
      const res: any = await createTag({
        tagName: newTagName,
        description: newTagDesc,
      });
      onRefetchTags?.();
      const createdId = res?.id || res?.data?.id;
      if (createdId) handleBookInput("tagIds", [...bookForm.tagIds, createdId]);
      setNewTagName("");
      setNewTagDesc("");
    } catch (err) {
      console.error("Create tag", err);
      alert("Tạo tag thất bại");
    }
  };

  const resetForm = () => {
    setBookForm({
      title: "",
      bookCode: "",
      publishYear: new Date().getFullYear(),
      price: 0,
      totalQuantity: 1,
      isbn: "",
      description: "",
      categoryId: 0,
      authorIds: [],
      tagIds: [],
      isEbook: false,
      ebookUrl: "",
      ebookContent: "",
    });
    setNewAuthorName("");
    setNewAuthorBio("");
    setNewCategoryName("");
    setNewCategoryDesc("");
    setNewTagName("");
    setNewTagDesc("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ width: 800, maxWidth: "95%", maxHeight: "90vh", overflowY: "auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3>Tạo Sách Mới</h3>
          <button className="btn-cancel" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submitCreateBook}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label className="form-label">Tiêu Đề *</label>
              <input
                className="form-input"
                value={bookForm.title}
                onChange={(e) => handleBookInput("title", e.target.value)}
                required
              />
            </div>
            <div>
              <label className="form-label">Mã Sách</label>
              <input
                className="form-input"
                value={bookForm.bookCode}
                onChange={(e) => handleBookInput("bookCode", e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Năm Xuất Bản</label>
              <input
                type="number"
                className="form-input"
                value={bookForm.publishYear}
                onChange={(e) => handleBookInput("publishYear", parseInt(e.target.value || "0"))}
              />
            </div>
            <div>
              <label className="form-label">Giá</label>
              <input
                type="number"
                className="form-input"
                value={bookForm.price}
                onChange={(e) => handleBookInput("price", parseFloat(e.target.value || "0"))}
              />
            </div>

            <div>
              <label className="form-label">Số Lượng</label>
              <input
                type="number"
                className="form-input"
                value={bookForm.totalQuantity}
                onChange={(e) => handleBookInput("totalQuantity", parseInt(e.target.value || "0"))}
              />
            </div>
            <div>
              <label className="form-label">ISBN</label>
              <input
                className="form-input"
                value={bookForm.isbn}
                onChange={(e) => handleBookInput("isbn", e.target.value)}
              />
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Mô Tả</label>
              <textarea
                className="form-input form-textarea"
                value={bookForm.description}
                onChange={(e) => handleBookInput("description", e.target.value)}
              />
            </div>

            <div>
              <label className="form-label">Danh Mục</label>
              <input
                className="form-input"
                placeholder="Tìm danh mục theo tên hoặc ID..."
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                onFocus={() => setCategorySearch("")}
                style={{ marginBottom: 8 }}
              />
              {categorySearch !== null && (filteredCategories.length > 0 || localCategories?.length === 0) && (
                <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4, marginBottom: 8, backgroundColor: "#fff" }}>
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((c) => (
                      <div
                        key={c.id}
                        style={{
                          padding: "10px 12px",
                          cursor: "pointer",
                          backgroundColor: bookForm.categoryId === c.id ? "#e3f2fd" : "transparent",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                        onClick={() => {
                          handleBookInput("categoryId", c.id);
                          setCategorySearch("");
                        }}
                      >
                        <div>
                          <strong>ID{c.id}</strong> - {c.categoryName}
                        </div>
                        {bookForm.categoryId === c.id && <span style={{ color: "#4CAF50", fontWeight: "bold" }}>✓</span>}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px 12px", color: "#999", textAlign: "center" }}>
                      Không tìm thấy danh mục
                    </div>
                  )}
                </div>
              )}
              {bookForm.categoryId > 0 && (
                <div style={{ marginBottom: 8, padding: 8, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
                  ✓ Đã chọn: ID{bookForm.categoryId} - {localCategories?.find(c => c.id === bookForm.categoryId)?.categoryName || categories?.find(c => c.id === bookForm.categoryId)?.categoryName}
                  <button
                    type="button"
                    style={{
                      marginLeft: 8,
                      padding: "2px 6px",
                      backgroundColor: "#ff6b6b",
                      color: "#fff",
                      border: "none",
                      borderRadius: 3,
                      cursor: "pointer",
                      fontSize: 12
                    }}
                    onClick={() => handleBookInput("categoryId", 0)}
                  >
                    Xoá
                  </button>
                </div>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowCreateCategoryDialog(true)}
                style={{ width: "100%" }}
              >
                + Tạo Danh Mục Mới
              </button>
            </div>

            <div>
              <label className="form-label">Tác Giả</label>
              <input
                className="form-input"
                placeholder="Tìm tác giả theo tên hoặc ID..."
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                onFocus={() => setAuthorSearch("")}
                style={{ marginBottom: 8 }}
              />
              {authorSearch !== null && (filteredAuthors.length > 0 || localAuthors?.length === 0) && (
                <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4, marginBottom: 8, backgroundColor: "#fff" }}>
                  {filteredAuthors.length > 0 ? (
                    filteredAuthors.map((a) => (
                      <div
                        key={a.id}
                        style={{
                          padding: "10px 12px",
                          cursor: "pointer",
                          backgroundColor: bookForm.authorIds.includes(a.id) ? "#c8e6c9" : "transparent",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                        onClick={() => {
                          const updated = bookForm.authorIds.includes(a.id)
                            ? bookForm.authorIds.filter(id => id !== a.id)
                            : [...bookForm.authorIds, a.id];
                          handleBookInput("authorIds", updated);
                        }}
                      >
                        <div>
                          <input
                            type="checkbox"
                            checked={bookForm.authorIds.includes(a.id)}
                            readOnly
                            style={{ marginRight: 8 }}
                          />
                          <strong>ID{a.id}</strong> - {a.authorName}
                        </div>
                        {bookForm.authorIds.includes(a.id) && <span style={{ color: "#4CAF50", fontWeight: "bold" }}>✓</span>}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px 12px", color: "#999", textAlign: "center" }}>
                      Không tìm thấy tác giả
                    </div>
                  )}
                </div>
              )}
              {bookForm.authorIds.length > 0 && (
                <div style={{ marginBottom: 8, padding: 8, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>✓ Đã chọn:</div>
                  {bookForm.authorIds.map(id => {
                    const author = localAuthors?.find(a => a.id === id) || authors?.find(a => a.id === id);
                    return (
                      <div key={id} style={{ fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>• ID{id} - {author?.authorName}</span>
                        <button
                          type="button"
                          style={{
                            padding: "2px 6px",
                            backgroundColor: "#ff6b6b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 3,
                            cursor: "pointer",
                            fontSize: 10
                          }}
                          onClick={() => handleBookInput("authorIds", bookForm.authorIds.filter(aid => aid !== id))}
                        >
                          Xoá
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowCreateAuthorDialog(true)}
                style={{ width: "100%" }}
              >
                + Tạo Tác Giả Mới
              </button>
            </div>

            <div>
              <label className="form-label">Tag</label>
              <input
                className="form-input"
                placeholder="Tìm tag theo tên hoặc ID..."
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                onFocus={() => setTagSearch("")}
                style={{ marginBottom: 8 }}
              />
              {tagSearch !== null && (filteredTags.length > 0 || localTags?.length === 0) && (
                <div style={{ maxHeight: 150, overflowY: "auto", border: "1px solid #ddd", borderRadius: 4, marginBottom: 8, backgroundColor: "#fff" }}>
                  {filteredTags.length > 0 ? (
                    filteredTags.map((t) => (
                      <div
                        key={t.id}
                        style={{
                          padding: "10px 12px",
                          cursor: "pointer",
                          backgroundColor: bookForm.tagIds.includes(t.id) ? "#fff9c4" : "transparent",
                          borderBottom: "1px solid #eee",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                        onClick={() => {
                          const updated = bookForm.tagIds.includes(t.id)
                            ? bookForm.tagIds.filter(id => id !== t.id)
                            : [...bookForm.tagIds, t.id];
                          handleBookInput("tagIds", updated);
                        }}
                      >
                        <div>
                          <input
                            type="checkbox"
                            checked={bookForm.tagIds.includes(t.id)}
                            readOnly
                            style={{ marginRight: 8 }}
                          />
                          <strong>ID{t.id}</strong> - {t.tagName}
                        </div>
                        {bookForm.tagIds.includes(t.id) && <span style={{ color: "#4CAF50", fontWeight: "bold" }}>✓</span>}
                      </div>
                    ))
                  ) : (
                    <div style={{ padding: "10px 12px", color: "#999", textAlign: "center" }}>
                      Không tìm thấy tag
                    </div>
                  )}
                </div>
              )}
              {bookForm.tagIds.length > 0 && (
                <div style={{ marginBottom: 8, padding: 8, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>✓ Đã chọn:</div>
                  {bookForm.tagIds.map(id => {
                    const tag = localTags?.find(t => t.id === id) || tags?.find(t => t.id === id);
                    return (
                      <div key={id} style={{ fontSize: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span>• ID{id} - {tag?.tagName}</span>
                        <button
                          type="button"
                          style={{
                            padding: "2px 6px",
                            backgroundColor: "#ff6b6b",
                            color: "#fff",
                            border: "none",
                            borderRadius: 3,
                            cursor: "pointer",
                            fontSize: 10
                          }}
                          onClick={() => handleBookInput("tagIds", bookForm.tagIds.filter(tid => tid !== id))}
                        >
                          Xoá
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              <button
                type="button"
                className="btn-primary"
                onClick={() => setShowCreateTagDialog(true)}
                style={{ width: "100%" }}
              >
                + Tạo Tag Mới
              </button>
            </div>

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
                    Đánh dấu là Ebook
                  </div>
                  <div style={{ fontSize: 12, color: "#666" }}>
                    (Sách này sẽ hiển thị bên menu Ebook Management để upload nội dung)
                  </div>
                </div>
              </label>
            </div>

          </div>

          <div style={{ marginTop: 20, display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? "Đang tạo..." : "Tạo Sách"}
            </button>
            <button type="button" className="btn-cancel" onClick={onClose}>
              Hủy
            </button>
          </div>
        </form>
      </div>

      {/* Create Author Dialog */}
      {showCreateAuthorDialog && (
        <div className="modal-overlay" onClick={() => setShowCreateAuthorDialog(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 400, maxWidth: "95%" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3>Tạo Tác Giả Mới</h3>
              <button
                className="btn-cancel"
                onClick={() => setShowCreateAuthorDialog(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <label className="form-label">Tên Tác Giả *</label>
              <input
                className="form-input"
                value={newAuthorName}
                onChange={(e) => setNewAuthorName(e.target.value)}
                placeholder="Nhập tên tác giả"
                style={{ marginBottom: 12 }}
              />
              <label className="form-label">Tiểu Sử</label>
              <textarea
                className="form-input form-textarea"
                value={newAuthorBio}
                onChange={(e) => setNewAuthorBio(e.target.value)}
                placeholder="Nhập tiểu sử tác giả"
                style={{ marginBottom: 12 }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={submitCreateAuthor}
              >
                Tạo Tác Giả
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowCreateAuthorDialog(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Category Dialog */}
      {showCreateCategoryDialog && (
        <div className="modal-overlay" onClick={() => setShowCreateCategoryDialog(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 400, maxWidth: "95%" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3>Tạo Danh Mục Mới</h3>
              <button
                className="btn-cancel"
                onClick={() => setShowCreateCategoryDialog(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <label className="form-label">Tên Danh Mục *</label>
              <input
                className="form-input"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                placeholder="Nhập tên danh mục"
                style={{ marginBottom: 12 }}
              />
              <label className="form-label">Mô Tả</label>
              <textarea
                className="form-input form-textarea"
                value={newCategoryDesc}
                onChange={(e) => setNewCategoryDesc(e.target.value)}
                placeholder="Nhập mô tả danh mục"
                style={{ marginBottom: 12 }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={submitCreateCategory}
              >
                Tạo Danh Mục
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowCreateCategoryDialog(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Tag Dialog */}
      {showCreateTagDialog && (
        <div className="modal-overlay" onClick={() => setShowCreateTagDialog(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ width: 400, maxWidth: "95%" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h3>Tạo Tag Mới</h3>
              <button
                className="btn-cancel"
                onClick={() => setShowCreateTagDialog(false)}
              >
                <X size={20} />
              </button>
            </div>
            <div>
              <label className="form-label">Tên Tag *</label>
              <input
                className="form-input"
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                placeholder="Nhập tên tag"
                style={{ marginBottom: 12 }}
              />
              <label className="form-label">Mô Tả</label>
              <textarea
                className="form-input form-textarea"
                value={newTagDesc}
                onChange={(e) => setNewTagDesc(e.target.value)}
                placeholder="Nhập mô tả tag"
                style={{ marginBottom: 12 }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button
                type="button"
                className="btn-primary"
                onClick={submitCreateTag}
              >
                Tạo Tag
              </button>
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setShowCreateTagDialog(false)}
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

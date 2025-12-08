import { useState } from "react";
import TopBar from "../components/TopBar";
import { searchItems } from "../service/SearchingItem";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";
import { deleteBook, deleteAuthor, deleteCategory, deleteTag } from "../api/apiService"

// --- IMPORT CÁC FORM CREATE ---
import CreateBookForm from "../components/forms/create/CreateBookForm";
import CreateAuthorForm from "../components/forms/create/CreateAuthorForm";
import CreateCategoryForm from "../components/forms/create/CreateCategoryForm";
import CreateTagForm from "../components/forms/create/CreateTagForm";

// --- IMPORT CÁC FORM UPDATE (Đã đầy đủ) ---
import EditBookForm from "../components/forms/update/EditBookForm";
import EditAuthorForm from "../components/forms/update/EditAuthorForm";
import EditCategoryForm from "../components/forms/update/EditCategoryForm";
import EditTagForm from "../components/forms/update/EditTagForm";

import {
  useBookData, useAuthorData, useCategoryData, useTagData
} from '../hooks/useManagementHooks';
import type { Book, Author, Category, Tag } from '../hooks/useManagementHooks';

const getStatusBadge = (book: Book) => {
  if (!book.isActive) return <span className="status-badge badge-gray">Inactive (Ngừng KD)</span>;
  if (book.availableQuantity === 0) return <span className="status-badge badge-danger">Out of Stock (Hết hàng)</span>;
  if (book.availableQuantity < 10) return <span className="status-badge badge-warning">Low Stock (Sắp hết)</span>;
  return <span className="status-badge badge-success">Available (Sẵn có)</span>;
};

export default function BookManagement() {
  const [activeTab, setActiveTab] = useState("books");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const tabs = ["books", "authors", "categories", "tags"];

  // --- Modal States: Create ---
  const [isCreateBookModalOpen, setIsCreateBookModalOpen] = useState(false);
  const [isCreateAuthorModalOpen, setIsCreateAuthorModalOpen] = useState(false);
  const [isCreateCategoryModalOpen, setIsCreateCategoryModalOpen] = useState(false);
  const [isCreateTagModalOpen, setIsCreateTagModalOpen] = useState(false);

  // --- Modal States: Edit ---
  const [isEditBookModalOpen, setIsEditBookModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [isEditAuthorModalOpen, setIsEditAuthorModalOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isEditTagModalOpen, setIsEditTagModalOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // --- Hooks lấy dữ liệu ---
  // Tự động load lại khi mở form sửa/tạo
  const shouldFetchAll = isEditBookModalOpen || isCreateBookModalOpen;

  const { data: books, loading: loadingBooks, refetch: refetchBooks } = useBookData(activeTab === 'books');
  const { data: authors, loading: loadingAuthors, refetch: refetchAuthors } = useAuthorData(activeTab === 'authors' || shouldFetchAll);
  const { data: categories, loading: loadingCategories, refetch: refetchCategories } = useCategoryData(activeTab === 'categories' || shouldFetchAll);
  const { data: tags, loading: loadingTags, refetch: refetchTags } = useTagData(activeTab === 'tags' || shouldFetchAll);

  const loading = loadingBooks || loadingAuthors || loadingCategories || loadingTags || isSearching;

  let currentData: any[] = [];
  if (activeTab === 'books') currentData = searchResults !== null ? searchResults : (books as Book[]);
  else if (activeTab === 'authors') currentData = searchResults !== null ? searchResults : (authors as Author[]);
  else if (activeTab === 'categories') currentData = searchResults !== null ? searchResults : (categories as Category[]);
  else if (activeTab === 'tags') currentData = searchResults !== null ? searchResults : (tags as Tag[]);

  // --- Handlers ---

  const handleAddNew = () => {
    if (activeTab === 'books') setIsCreateBookModalOpen(true);
    else if (activeTab === 'authors') setIsCreateAuthorModalOpen(true);
    else if (activeTab === 'categories') setIsCreateCategoryModalOpen(true);
    else if (activeTab === 'tags') setIsCreateTagModalOpen(true);
  };

  // --- Edit Handlers ---
  const handleEditBookClick = (book: Book) => {
    setSelectedBook(book);
    setIsEditBookModalOpen(true);
  };

  const handleEditAuthorClick = (author: Author) => {
    setSelectedAuthor(author);
    setIsEditAuthorModalOpen(true);
  };

  const handleEditCategoryClick = (category: Category) => {
    setSelectedCategory(category);
    setIsEditCategoryModalOpen(true);
  };

  const handleEditTagClick = (tag: Tag) => {
    setSelectedTag(tag);
    setIsEditTagModalOpen(true);
  };

  // --- Common Success Handler ---
  const handleSuccess = () => {
    if (activeTab === 'books') refetchBooks && refetchBooks();
    else if (activeTab === 'authors') refetchAuthors && refetchAuthors();
    else if (activeTab === 'categories') refetchCategories && refetchCategories();
    else if (activeTab === 'tags') refetchTags && refetchTags();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchItems(query, activeTab, { authors, categories, tags });
      setSearchResults(results);
    } catch (err) {
      console.error('Lỗi tìm kiếm:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = (id: number) => {
    return window.confirm(`Bạn có chắc chắn muốn xóa ${activeTab} với ID: ${id}?`);
  };

  // --- Render Table ---
  const renderTableBody = () => {
    if (currentData.length === 0) {
      return <tr><td colSpan={7} className="empty-state">Không tìm thấy dữ liệu {activeTab}.</td></tr>;
    }

    // A. Sách
    if (activeTab === 'books') {
      return (currentData as Book[]).map((book) => (
        <tr key={book.id}>
          <td>
            <div style={{ color: '#0040ffff', fontWeight: 7 }}>{book.id}</div>
            <div style={{ fontSize: '12px', color: '#A3AED0' }}>{book.bookCode}</div>
          </td>
          <td><div style={{ fontWeight: 700 }}>{book.title}</div></td>
          <td>
            <div style={{ color: '#006796ff', fontWeight: 7 }}>
              {book.authors?.map((a) => a.authorName).join(", ") || 'N/A'}
            </div>
          </td>
          <td>{book.category?.categoryName || 'N/A'}</td>
          <td>
            <span className={`stock-info ${book.availableQuantity < 10 ? 'stock-low' : ''}`}>
              {book.availableQuantity} / {book.totalQuantity}
            </span>
          </td>
          <td>{getStatusBadge(book)}</td>
          <td>
            <div className="table-actions">
              <button className="action-btn icon-edit" title="Sửa" onClick={() => handleEditBookClick(book)}>
                <Edit size={18} />
              </button>
              <button className="action-btn icon-delete" title="Xóa" onClick={() => {
                if (handleDelete(book.id)) {
                  deleteBook(book.id).then(() => refetchBooks && refetchBooks())
                }
              }}>
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
      ));
    }

    // B. Tác Giả
    if (activeTab === 'authors') {
      return (currentData as Author[]).map((author) => (
        <tr key={author.id}>
          <td>{author.id}</td>
          <td style={{ fontWeight: 700 }}>{author.authorName}</td>
          <td>{author.biography?.substring(0, 50)}...</td>
          <td>
            <div className="table-actions">
              <button className="action-btn icon-edit" title="Sửa" onClick={() => handleEditAuthorClick(author)}>
                <Edit size={18} />
              </button>
              <button className="action-btn icon-delete" title="Xóa" onClick={() => {
                if (handleDelete(author.id)) { deleteAuthor(author.id).then(() => refetchAuthors && refetchAuthors()) }
              }}><Trash2 size={18} /></button>
            </div>
          </td>
        </tr>
      ));
    }

    // C. Danh Mục
    if (activeTab === 'categories') {
      return (currentData as Category[]).map((category) => (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td style={{ fontWeight: 700 }}>{category.categoryName}</td>
          <td>{category.description?.substring(0, 50)}...</td>
          <td>
            <div className="table-actions">
              <button className="action-btn icon-edit" title="Sửa" onClick={() => handleEditCategoryClick(category)}>
                <Edit size={18} />
              </button>
              <button
                className="action-btn icon-delete"
                title="Xóa"
                onClick={async () => {
                  if (handleDelete(category.id)) {
                    try {
                      await deleteCategory(category.id);
                      // Nếu xóa thành công thì load lại dữ liệu
                      if (refetchCategories) refetchCategories();
                      alert("Xóa danh mục thành công!");
                    } catch (error: any) {
                      console.error("Lỗi xóa danh mục:", error);
                      // Hiển thị thông báo lỗi từ backend hoặc lỗi mặc định
                      // Giả sử backend trả về lỗi ở error.response.data.message
                      const message = error?.response?.data?.message || "Không thể xóa danh mục này. Có thể danh mục đang chứa sách!";
                      alert(message);
                    }
                  }
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </td>
        </tr>
      ));
    }

    // D. Tags (CẬP NHẬT)
    if (activeTab === 'tags') {
      return (currentData as Tag[]).map((tag) => (
        <tr key={tag.id}>
          <td>{tag.id}</td>
          <td style={{ fontWeight: 700 }}>{tag.tagName}</td>
          <td>{tag.description?.substring(0, 50)}...</td>
          <td>
            <div className="table-actions">
              <button className="action-btn icon-edit" title="Sửa" onClick={() => handleEditTagClick(tag)}>
                <Edit size={18} />
              </button>
              <button className="action-btn icon-delete" title="Xóa" onClick={() => {
                if (handleDelete(tag.id)) { deleteTag(tag.id).then(() => refetchTags && refetchTags()) }
              }}><Trash2 size={18} /></button>
            </div>
          </td>
        </tr>
      ));
    }

    return null;
  };

  return (
    <div>
      <TopBar title="Book Management" />

      <div className="tabs-container">
        {tabs.map((tab) => (
          <div key={tab} onClick={() => setActiveTab(tab)} className={`tab-item ${activeTab === tab ? "active" : ""}`}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div className="card" style={{ minHeight: '400px', padding: "20px" }}>

        <div className="section-header" style={{ padding: '24px 24px 0 24px' }}>
          <h3 className="section-title">Danh sách {activeTab}</h3>
          <button className="btn-primary" onClick={handleAddNew}>
            <Plus size={18} /> Thêm Mới
          </button>
        </div>

        <div className="search-wrapper" style={{ marginBottom: 30 }}>
          <Search size={18} color="#A3AED0" />
          <input
            placeholder="Tìm kiếm..."
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        {/* --- CÁC FORM CREATE --- */}
        <CreateBookForm
          isOpen={isCreateBookModalOpen}
          onClose={() => setIsCreateBookModalOpen(false)}
          onSuccess={handleSuccess}
          authors={authors || []}
          categories={categories || []}
          tags={tags || []}
          onRefetchAuthors={refetchAuthors}
          onRefetchCategories={refetchCategories}
          onRefetchTags={refetchTags}
        />
        <CreateAuthorForm isOpen={isCreateAuthorModalOpen} onClose={() => setIsCreateAuthorModalOpen(false)} onSuccess={handleSuccess} />
        <CreateCategoryForm isOpen={isCreateCategoryModalOpen} onClose={() => setIsCreateCategoryModalOpen(false)} onSuccess={handleSuccess} />
        <CreateTagForm isOpen={isCreateTagModalOpen} onClose={() => setIsCreateTagModalOpen(false)} onSuccess={handleSuccess} />

        {/* --- CÁC FORM UPDATE --- */}
        <EditBookForm
          isOpen={isEditBookModalOpen}
          onClose={() => { setIsEditBookModalOpen(false); setSelectedBook(null); }}
          onSuccess={() => { refetchBooks && refetchBooks(); }}
          initialData={selectedBook}
          authors={authors || []}
          categories={categories || []}
          tags={tags || []}
          onRefetchAuthors={refetchAuthors}
          onRefetchCategories={refetchCategories}
          onRefetchTags={refetchTags}
        />

        <EditAuthorForm
          isOpen={isEditAuthorModalOpen}
          onClose={() => { setIsEditAuthorModalOpen(false); setSelectedAuthor(null); }}
          onSuccess={() => { refetchAuthors && refetchAuthors(); }}
          initialData={selectedAuthor}
        />

        <EditCategoryForm
          isOpen={isEditCategoryModalOpen}
          onClose={() => { setIsEditCategoryModalOpen(false); setSelectedCategory(null); }}
          onSuccess={() => { refetchCategories && refetchCategories(); }}
          initialData={selectedCategory}
        />

        <EditTagForm
          isOpen={isEditTagModalOpen}
          onClose={() => { setIsEditTagModalOpen(false); setSelectedTag(null); }}
          onSuccess={() => { refetchTags && refetchTags(); }}
          initialData={selectedTag}
        />

        {loading && <div className="empty-state"><Loader2 className="animate-spin" size={30} /><p>Đang tải dữ liệu...</p></div>}

        {!loading && (
          <table className="table-container">
            <thead>
              {activeTab === 'books' && <tr><th>ID / Mã</th><th>Tiêu đề</th><th>Tác giả</th><th>Danh mục</th><th>Kho</th><th>Trạng thái</th><th>Thao tác</th></tr>}
              {activeTab === 'authors' && <tr><th>ID</th><th>Tên</th><th>Tiểu sử</th><th>Thao tác</th></tr>}
              {activeTab === 'categories' && <tr><th>ID</th><th>Tên</th><th>Mô tả</th><th>Thao tác</th></tr>}
              {activeTab === 'tags' && <tr><th>ID</th><th>Tên</th><th>Mô tả</th><th>Thao tác</th></tr>}
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
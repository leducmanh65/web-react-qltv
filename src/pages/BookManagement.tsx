import { useState } from "react";
import TopBar from "../components/TopBar";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import AddBookModal from "../components/AddBookModal";
import type { BookFormData } from "../components/AddBookModal";

import {
  useBookData, useAuthorData, useCategoryData, useTagData
} from '../hooks/useManagementHooks';
import type  { Book, Author, Category, Tag } from '../hooks/useManagementHooks';


const getStatusBadge = (book: Book) => {
  if (!book.isActive) return <span className="status-badge badge-gray">Inactive</span>;
  if (book.availableQuantity === 0) return <span className="status-badge badge-danger">Out of Stock</span>;
  if (book.availableQuantity < 10) return <span className="status-badge badge-warning">Low Stock</span>;
  return <span className="status-badge badge-success">Available</span>;
};

export default function BookManagement() {
  const [activeTab, setActiveTab] = useState("books");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const tabs = ["books", "authors", "categories", "tags"];

  //(loading, refetch tự động)
  const { data: books, loading: loadingBooks, refetch: refetchBooks } = useBookData(activeTab === 'books');
  const { data: authors, loading: loadingAuthors } = useAuthorData(activeTab === 'authors');
  const { data: categories, loading: loadingCategories } = useCategoryData(activeTab === 'categories');
  const { data: tags, loading: loadingTags } = useTagData(activeTab === 'tags');

  //xác định trạng thái loading và data hiện tại
  const loading = loadingBooks || loadingAuthors || loadingCategories || loadingTags;

  let currentData: any[] = [];
  if (activeTab === 'books') currentData = books as Book[];
  else if (activeTab === 'authors') currentData = authors as Author[];
  else if (activeTab === 'categories') currentData = categories as Category[];
  else if (activeTab === 'tags') currentData = tags as Tag[];

  //nuts them
  const handleAddNew = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleFormSubmit = async (bookData: BookFormData) => {
    console.log('Submitting book data:', bookData);
    
    // TODO: Gọi API POST để thêm sách mới
    // try {
    //   const response = await fetch('YOUR_API_ENDPOINT', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(bookData)
    //   });
    //   
    //   if (response.ok) {
    //     refetchBooks(); // Refresh danh sách sau khi thêm thành công
    //     setIsModalOpen(false);
    //   }
    // } catch (error) {
    //   console.error('Error adding book:', error);
    // }
    
    // Tạm thời đóng modal
    setIsModalOpen(false);
  };

  // xoas
  const handleDelete = (id: number) => {
    if (window.confirm(`Are you sure you want to delete ${activeTab} with ID: ${id}?`)) {
      // Logic gọi API DELETE
      // Sau khi xóa thành công, gọi refetch tương ứng
      if (activeTab === 'books') refetchBooks();
    }
  };

  // xoá các phần tử khi chọn nút khác
  const renderTableBody = () => {
    if (currentData.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="empty-state">No {activeTab} found.</td>
        </tr>
      );
    }

    // bôk
    if (activeTab === 'books') {
      return (currentData as Book[]).map((book) => (
        <tr key={book.id}>
          <td>
            <div style={{ fontWeight: 700 }}>{book.title}</div>
            <div style={{ fontSize: '12px', color: '#A3AED0' }}>{book.bookCode}</div>
          </td>

          <td>{book.authors.map((a: { authorName: string }) => a.authorName).join(", ")}</td>
          <td>{book.category?.categoryName}</td>
          <td><span className={`stock-info ${book.availableQuantity < 10 ? 'stock-low' : ''}`}>{book.availableQuantity} / {book.totalQuantity}</span></td>
          <td>{getStatusBadge(book)}</td>
          <td>
            <div className="table-actions">
              <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
              <button className="action-btn icon-delete" title="Delete" onClick={() => handleDelete(book.id)}><Trash2 size={18} /></button>
            </div>
          </td>
        </tr>
      ));
    }

    // tac gia
    if (activeTab === 'authors') {
      return (currentData as Author[]).map((author) => (
        <tr key={author.id}>
          <td>{author.id}</td>
          <td style={{ fontWeight: 700 }}>{author.authorName}</td>
          <td>{author.biography.substring(0, 50)}...</td>
          <td><div className="table-actions">
            <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
            <button className="action-btn icon-delete" title="Delete" onClick={() => handleDelete(author.id)}><Trash2 size={18} /></button>
          </div></td>
        </tr>
      ));
    }

    if (activeTab === 'categories') {
      return (currentData as Category[]).map((category) => (
        <tr key={category.id}>
          <td>{category.id}</td>
          <td style={{ fontWeight: 700 }}>{category.categoryName}</td>
          <td>{category.description.substring(0, 50)}...</td>
          <td><div className="table-actions">
            <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
            <button className="action-btn icon-delete" title="Delete" onClick={() => handleDelete(category.id)}><Trash2 size={18} /></button>
          </div></td>
        </tr>
      ));
    }
    if (activeTab === 'tags') {
      return (currentData as Tag[]).map((tag) => (
        <tr key={tag.id}>
          <td>{tag.id}</td>
          <td style={{ fontWeight: 700 }}>{tag.tagName}</td>
          <td>{tag.description.substring(0, 50)}...</td>
          <td><div className="table-actions">
            <button className="action-btn icon-edit" title="Edit"><Edit size={18} /></button>
            <button className="action-btn icon-delete" title="Delete" onClick={() => handleDelete(tag.id)}><Trash2 size={18} /></button>
          </div></td>
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
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-item ${activeTab === tab ? "active" : ""}`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </div>
        ))}
      </div>

      <div className="card" style={{ minHeight: '400px', padding: 0 }}>

        <div className="section-header" style={{ padding: '24px 24px 0 24px' }}>
          <h3 className="section-title">{activeTab} List</h3>
          <button className="btn-primary" onClick={handleAddNew}>
            <Plus size={18} /> Add New
          </button>
        </div>

     
        {loading && (
          <div className="empty-state">
            <Loader2 className="animate-spin" size={30} />
            <p>Loading {activeTab} data...</p>
          </div>
        )}

     
        {!loading && (
          <table className="table-container">
            <thead>
              {activeTab === 'books' && (
                <tr>
                  <th style={{ width: '30%' }}>Title / Code</th><th>Author</th><th>Category</th><th>Stock</th><th>Status</th><th>Action</th>
                </tr>
              )}
              {activeTab === 'authors' && (
                <tr>
                  <th style={{ width: '10%' }}>ID</th><th>Author Name</th><th>Biography</th><th style={{ width: '15%' }}>Action</th>
                </tr>
              )}
              {activeTab === 'categories' && (
                <tr>
                  <th>ID</th><th>Category Name</th><th>Description</th><th style={{ width: '15%' }}>Action</th>
                </tr>
              )}
              {activeTab === 'tags' && (
                <tr>
                  <th>ID</th><th>Tag Name</th><th>Description</th><th style={{ width: '15%' }}>Action</th>
                </tr>
              )}
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal thêm sách */}
      <AddBookModal 
        isOpen={isModalOpen} 
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}
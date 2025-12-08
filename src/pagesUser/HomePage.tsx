import React from "react";
import "../styles/User/home.css"; // Giữ nguyên CSS
import { Sidebar } from "../components/layoutUser/sidebar";
import { FeaturedSection } from "../components/layoutUser/featured-section";
import EbookViewerModal from "../components/modals/EbookViewerModal";
import CreateBorrowSlipForm from "../components/forms/create/CreateBorrowSlipForm";

// Import các sub-components trong cùng folder
import { useHomeLogic } from "./useHomeLogic";
import { AdvancedSearch } from "./AdvancedSearch";
import { BookFilters } from "./BookFilters";
import { BookGrid } from "./BookGrid";

export const HomePage: React.FC = () => {
  // Lấy toàn bộ data và handler từ Custom Hook
  const {
    // Data & States
    allBooks, displayBooks, loading,
    categories, tags, authors,
    selectedCategory, setSelectedCategory,
    selectedTag, setSelectedTag,
    selectedAuthor, setSelectedAuthor,
    search, setSearch,
    ebookSearch, setEbookSearch,
    bookType, setBookType,
    
    // Modal Data
    ebookModalOpen, borrowFormOpen, selectedBookId, selectedBookTitle, selectedEbookCover,
    
    // Handlers
    handleSmartSearch, handleBookClick, handleNavigate, closeModals, 
    setEbookModalOpen, setBorrowFormOpen, setSelectedBookId
  } = useHomeLogic();

  return (
    <div className="user-home-page">
      <Sidebar onNavigate={handleNavigate} activePage="home" />
      
      <div className="user-main-content">
        <FeaturedSection />
        
        {/* SECTION 1: TÌM KIẾM NÂNG CAO */}
        <AdvancedSearch 
          search={search} setSearch={setSearch}
          allBooks={allBooks}
          categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
          tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag}
          authors={authors} selectedAuthor={selectedAuthor} setSelectedAuthor={setSelectedAuthor}
          onSearch={handleSmartSearch}
        />

        {/* SECTION 2: BỘ LỌC LOẠI SÁCH & EBOOK SEARCH */}
        <BookFilters 
          bookType={bookType} setBookType={setBookType}
          ebookSearch={ebookSearch} setEbookSearch={setEbookSearch}
        />

        {/* SECTION 3: KẾT QUẢ HIỂN THỊ */}
        <BookGrid 
          loading={loading}
          bookType={bookType}
          displayBooks={displayBooks}
          onBookClick={handleBookClick}
        />
      </div>

      {/* --- MODALS --- */}
      {ebookModalOpen && selectedBookId && (
        <EbookViewerModal
          bookId={selectedBookId}
          bookTitle={selectedBookTitle}
          coverUrl={selectedEbookCover}
          onClose={closeModals}
        />
      )}

      {borrowFormOpen && selectedBookId && (
        <CreateBorrowSlipForm
          isOpen={borrowFormOpen}
          onClose={() => {
            setBorrowFormOpen(false);
            setSelectedBookId(null);
          }}
          onSuccess={() => {
            setBorrowFormOpen(false);
            setSelectedBookId(null);
            alert("Thành công!");
          }}
        />
      )}
    </div>
  );
};

export default HomePage;
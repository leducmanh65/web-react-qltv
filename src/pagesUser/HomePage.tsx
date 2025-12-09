import React from "react";
import { useOutletContext } from "react-router-dom";
import "../styles/User/home.css"; 
import { FeaturedSection } from "../components/layoutUser/featured-section";
import EbookViewerModal from "../components/modals/EbookViewerModal";
import CreateBorrowSlipForm from "../components/forms/create/CreateBorrowSlipForm";

// Import các sub-components
import { useHomeLogic } from "./useHomeLogic";
import { AdvancedSearch } from "./AdvancedSearch";
import { BookFilters } from "./BookFilters";
import { BookGrid } from "./BookGrid";

interface UserLayoutContext {
  bookType: string;
  setBookType: (type: string) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const HomePage: React.FC = () => {
  // Lấy shared state từ UserLayout
  const { bookType, setBookType } = useOutletContext<UserLayoutContext>();
  
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
    
    // Modal Data
    ebookModalOpen, borrowFormOpen, selectedBookId, selectedBookTitle, selectedEbookCover,
    
    // Handlers
    handleSmartSearch, handleBookClick, closeModals, 
    setBorrowFormOpen, setSelectedBookId
  } = useHomeLogic(bookType);

  return (
    <div className="user-layout">
      <div className="user-layout__content">
        <FeaturedSection />
        
        {/* SECTION 1: BỘ LỌC LOẠI SÁCH */}
        <BookFilters 
          bookType={bookType} setBookType={setBookType}
          ebookSearch={ebookSearch} setEbookSearch={setEbookSearch}
        />
        
        {/* SECTION 2: TÌM KIẾM NÂNG CAO - Chỉ hiện khi không phải Ebook */}
        {bookType !== "Ebook" && (
          <AdvancedSearch 
            search={search} setSearch={setSearch}
            allBooks={allBooks}
            categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
            tags={tags} selectedTag={selectedTag} setSelectedTag={setSelectedTag}
            authors={authors} selectedAuthor={selectedAuthor} setSelectedAuthor={setSelectedAuthor}
            onSearch={handleSmartSearch}
          />
        )}

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
          isUserMode={true}
          preselectedBookId={selectedBookId}
        />
      )}
    </div>
  );
};

export default HomePage;
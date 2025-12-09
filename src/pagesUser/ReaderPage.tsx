import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { getEbookContent, saveReadingProgress } from "../api/apiService";
import "../styles/User/reader.css";

interface Page {
  id?: number;
  bookId?: number;
  pageNumber?: number;
  imageUrl?: string;
  contentText?: string;
}

export const ReaderPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  const navigate = useNavigate();
  
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());
  const saveProgressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fetch ebook content pages
  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    getEbookContent(parseInt(bookId)).then((res: any) => {
      const arr = Array.isArray(res) ? res : (res?.data || []);
      // Sort pages by pageNumber
      arr.sort((a: any, b: any) => (a.pageNumber || 0) - (b.pageNumber || 0));
      setPages(arr);
      setCurrentPageIndex(0);
    }).finally(() => setLoading(false));
  }, [bookId]);

  // Preload 7 pages ahead
  useEffect(() => {
    if (pages.length === 0) return;
    
    for (let i = currentPageIndex + 1; i <= Math.min(currentPageIndex + 7, pages.length - 1); i++) {
      const pageUrl = pages[i]?.imageUrl;
      if (pageUrl && !preloadedImages.has(pageUrl)) {
        const img = new Image();
        img.src = pageUrl;
        setPreloadedImages(prev => new Set([...prev, pageUrl]));
      }
    }
  }, [currentPageIndex, pages, preloadedImages]);

  // Save reading progress with debouncing (every 5 seconds or page change)
  useEffect(() => {
    const saveProgress = async () => {
      if (!bookId || pages.length === 0) return;
      
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        await saveReadingProgress({
          userId: parseInt(userId),
          bookId: parseInt(bookId),
          currentPage: currentPageIndex + 1,
          totalPages: pages.length,
          lastRead: new Date().toISOString(),
        });
        console.log(`Reading progress saved: Page ${currentPageIndex + 1}/${pages.length}`);
      } catch (err) {
        console.error("Failed to save reading progress:", err);
      }
    };

    // Debounce: save after 5 seconds of no page changes
    if (saveProgressTimeoutRef.current) {
      clearTimeout(saveProgressTimeoutRef.current);
    }

    saveProgressTimeoutRef.current = setTimeout(() => {
      saveProgress();
    }, 5000);

    return () => {
      if (saveProgressTimeoutRef.current) {
        clearTimeout(saveProgressTimeoutRef.current);
      }
    };
  }, [currentPageIndex, bookId, pages]);

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handleClose = () => {
    navigate("/user/ebook-history");
  };

  const currentPage = pages[currentPageIndex];

  if (!bookId) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
        <p>Không có ebook để đọc</p>
      </div>
    );
  }

  return (
    <div className="ebook-viewer-overlay">
      <div className="ebook-viewer-container">
        <div className="ebook-viewer-header">
          <div className="ebook-viewer-header-left">
            <strong>Đang đọc Ebook</strong>
            <div className="ebook-viewer-page-count">
              Trang {currentPageIndex + 1}/{pages.length}
            </div>
          </div>
          <button className="ebook-viewer-close-btn" onClick={handleClose}>
            <X />
          </button>
        </div>
        
        <div className="ebook-viewer-content">
          {loading && <div className="ebook-viewer-loading">Đang tải...</div>}
          {!loading && currentPage && (
            <div className="ebook-viewer-page-display">
              <div className="ebook-viewer-page-number">Trang {currentPageIndex + 1}</div>
              <div className="ebook-viewer-image-container">
                {currentPage.imageUrl ? (
                  <img src={currentPage.imageUrl} className="ebook-viewer-image" alt={`Page ${currentPageIndex + 1}`} />
                ) : (
                  <div className="ebook-viewer-text-placeholder">
                    <span className="ebook-viewer-text-placeholder-text">{currentPage.contentText || "Không có nội dung"}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {!loading && !currentPage && (
            <div className="ebook-viewer-empty" style={{ padding: "12px", textAlign: "center" }}>
              Không có trang để hiển thị
            </div>
          )}
        </div>

        <div className="ebook-viewer-controls">
          <button 
            className="ebook-viewer-btn" 
            disabled={currentPageIndex === 0} 
            onClick={handlePreviousPage}
          >
            <ChevronsLeft />
          </button>
          <button 
            className="ebook-viewer-btn" 
            disabled={currentPageIndex === pages.length - 1} 
            onClick={handleNextPage}
          >
            <ChevronsRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReaderPage;

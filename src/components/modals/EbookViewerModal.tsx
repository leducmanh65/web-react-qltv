import { useEffect, useState } from "react";
import { X, ChevronsLeft, ChevronsRight } from "lucide-react";
import { getEbookContent } from "../../api/apiService";
import "./EbookViewerModal.css";

// Tạo file css EbookViewerModal.css nếu chưa có:
// .ebook-viewer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 2000; display: flex; align-items: center; justify-content: center; }
// .ebook-viewer-container { width: 90%; height: 90%; background: #fff; display: flex; flex-direction: column; }
// .ebook-viewer-image { max-width: 100%; max-height: 80vh; object-fit: contain; }

interface Page {
  id?: number;
  bookId?: number;
  pageNumber?: number;
  imageUrl?: string;
  contentText?: string;
}

interface Props {
  bookId: number;
  bookTitle?: string;
  onClose: () => void;
}

export default function EbookViewerModal({ bookId, bookTitle, onClose }: Props) {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(false);
  const [index, setIndex] = useState(0);
  const [preloadedImages, setPreloadedImages] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!bookId) return;
    setLoading(true);
    getEbookContent(bookId).then((res: any) => {
        const arr = Array.isArray(res) ? res : (res?.data || []);
        // Sort trang theo thứ tự
        arr.sort((a: any, b: any) => (a.pageNumber || 0) - (b.pageNumber || 0));
        setPages(arr);
    }).finally(() => setLoading(false));
  }, [bookId]);

  // Preload 7 trang tiếp theo khi thay đổi trang hiện tại
  useEffect(() => {
    if (pages.length === 0) return;
    
    // Preload 7 trang phía sau
    for (let i = index + 1; i <= Math.min(index + 7, pages.length - 1); i++) {
      const pageUrl = pages[i]?.imageUrl;
      if (pageUrl && !preloadedImages.has(pageUrl)) {
        const img = new Image();
        img.src = pageUrl;
        setPreloadedImages(prev => new Set([...prev, pageUrl]));
      }
    }
  }, [index, pages, preloadedImages]);

  const curr = pages[index];

  if (!bookId) return null;

  return (
    <div className="ebook-viewer-overlay" onClick={onClose}>
      <div className="ebook-viewer-container" onClick={e => e.stopPropagation()}>
        <div className="ebook-viewer-header">
          <div className="ebook-viewer-header-left">
            <strong>{bookTitle || 'Ebook'}</strong>
            <div className="ebook-viewer-page-count">Trang {curr?.pageNumber || index + 1}/{pages.length}</div>
          </div>
          <button className="ebook-viewer-close-btn" onClick={onClose}><X /></button>
        </div>
        
        <div className="ebook-viewer-content">
            {loading && <div className="ebook-viewer-loading">Loading...</div>}
            {!loading && curr && (
              <div className="ebook-viewer-page-display">
                <div className="ebook-viewer-page-number">Trang {curr.pageNumber || index + 1}</div>
                <div className="ebook-viewer-image-container">
                  {curr.imageUrl ? (
                    <img src={curr.imageUrl} className="ebook-viewer-image" />
                  ) : (
                    <div className="ebook-viewer-text-placeholder">
                      <span className="ebook-viewer-text-placeholder-text">{curr.contentText || 'No content'}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            {!loading && !curr && <div className="ebook-viewer-empty">Khong co trang</div>}
        </div>

        <div className="ebook-viewer-controls">
            <button className="ebook-viewer-btn" disabled={index === 0} onClick={() => setIndex(i => i-1)}><ChevronsLeft /></button>
            <button className="ebook-viewer-btn" disabled={index === pages.length - 1} onClick={() => setIndex(i => i+1)}><ChevronsRight /></button>
        </div>
      </div>
    </div>
  );
}
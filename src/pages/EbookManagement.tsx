import { useState } from "react";
import TopBar from "../components/TopBar";
import { Search, Loader2, Plus, FileImage, ExternalLink, Eye } from "lucide-react";
import { useBookData } from "../hooks/useManagementHooks";
import CreateEbookForm from "../components/forms/create/CreateEbookForm";
import EbookViewerModal from "../components/modals/EbookViewerModal";
import type { Book } from "../hooks/useManagementHooks";

export default function EbookManagement() {
  const { data: books, loading, refetch } = useBookData(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number>(0);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewBookData, setViewBookData] = useState<{id: number, title: string} | null>(null);
  
  // --- SỬA LOGIC LỌC TẠI ĐÂY ---
  // Lọc những cuốn sách có chứa Tag tên là "EBOOK" (không phân biệt hoa thường)
  // @ts-ignore
  const ebookList = (books as Book[] || []).filter(b => 
    b.tags && b.tags.some((t: any) => t.tagName && t.tagName.toUpperCase() === 'EBOOK')
  );

  const filteredEbooks = ebookList.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (b.bookCode && b.bookCode.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleOpenUpload = (bookId: number = 0) => {
    setSelectedBookId(bookId);
    setIsUploadModalOpen(true);
  };

  const handleOpenView = (book: Book) => {
    setViewBookData({ id: book.id, title: book.title });
    setIsViewModalOpen(true);
  };

  const handleSuccess = () => {
    refetch(); 
  };

  return (
    <div>
      <TopBar title="Ebook Management" />

      <div className="card" style={{ padding: "20px", minHeight: "400px" }}>
        <div className="section-header" style={{ padding: '0 0 20px 0' }}>
          <h3 className="section-title">Kho Sách Điện Tử (eBooks)</h3>
          <button className="btn-primary" onClick={() => handleOpenUpload(0)}>
            <Plus size={18} /> Upload Trang Mới
          </button>
        </div>

        <div className="search-wrapper" style={{ marginBottom: 30 }}>
          <Search size={18} color="#A3AED0" />
          <input
            placeholder="Tìm kiếm eBook..."
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading && (
          <div className="empty-state">
            <Loader2 className="animate-spin" size={30} />
            <p>Đang tải dữ liệu...</p>
          </div>
        )}

        {!loading && (
          <table className="table-container">
            <thead>
              <tr>
                <th style={{width: '10%'}}>ID</th>
                <th style={{width: '30%'}}>Tên Sách</th>
                <th>URL Gốc</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredEbooks.length === 0 ? (
                <tr>
                  <td colSpan={4} className="empty-state">
                    Chưa có eBook nào.<br/>
                    <span style={{fontSize: 12, color: '#888'}}>
                      (Hãy chắc chắn bạn đã tạo Tag "EBOOK" và gán nó cho sách)
                    </span>
                  </td>
                </tr>
              ) : (
                filteredEbooks.map((book: any) => (
                  <tr key={book.id}>
                    <td><b style={{color: '#4318FF'}}>ID{book.id}</b></td>
                    <td>
                        <div style={{fontWeight: 600}}>{book.title}</div>
                        <div style={{fontSize: 12, color: '#888'}}>{book.bookCode}</div>
                    </td>
                    <td>
                        {/* URL Ebook tạm thời dùng Placeholder vì backend ko có trường này */}
                        <span style={{color:'#999'}}>--</span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          className="btn-outline-primary"
                          onClick={() => handleOpenView(book)}
                          title="Xem nội dung các trang"
                          style={{fontSize: 12, padding: "4px 8px", display: 'flex', alignItems: 'center', gap: 4}}
                        >
                          <Eye size={16}/> Xem
                        </button>

                        <button 
                          className="btn-outline-primary"
                          onClick={() => handleOpenUpload(book.id)}
                          title="Thêm trang"
                          style={{fontSize: 12, padding: "4px 8px", display: 'flex', alignItems: 'center', gap: 4}}
                        >
                          <FileImage size={16}/> + Trang
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {isUploadModalOpen && (
        <CreateEbookForm 
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={handleSuccess}
          books={ebookList}
          initialBookId={selectedBookId} 
        />
      )}

      {isViewModalOpen && viewBookData && (
        <EbookViewerModal
          bookId={viewBookData.id}
          bookTitle={viewBookData.title}
          onClose={() => setIsViewModalOpen(false)}
        />
      )}
    </div>
  );
}
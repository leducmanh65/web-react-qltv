import TopBar from "../components/TopBar";
import { Search, CheckCircle, AlertCircle, Clock, Plus, Loader2, Edit, Trash2 } from "lucide-react"; // Thêm icon Edit, Trash2
import { useState } from "react";
import { useBorrowSlipData, useUserData, useBookData } from '../hooks/useManagementHooks';
import type { BorrowSlip } from '../hooks/useManagementHooks';
import { searchItems } from "../service/SearchingItem";
import CreateBorrowSlipForm from "../components/forms/create/CreateBorrowSlipForm";
import EditBorrowSlipForm from "../components/forms/update/EditBorrowSlipForm"; // Import Form Sửa

// Import API
import { returnBorrowSlipDetail, deleteBorrowSlip } from "../api/apiService";

export default function CirculationManagement() {
  const { data: borrowSlips, loading, refetch: refetchBorrowSlips } = useBorrowSlipData(true);
  const { data: users } = useUserData(false);
  const { data: books } = useBookData(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BorrowSlip[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // State Modal
  const [isCreateBorrowSlipModalOpen, setIsCreateBorrowSlipModalOpen] = useState(false);
  const [isEditBorrowSlipModalOpen, setIsEditBorrowSlipModalOpen] = useState(false);
  const [selectedSlip, setSelectedSlip] = useState<BorrowSlip | null>(null);

  // --- XỬ LÝ TÌM KIẾM ---
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults(null); return; }
    setIsSearching(true);
    try {
      const results = await searchItems(query, "borrow-slips", { borrowSlips });
      setSearchResults((results as BorrowSlip[]) || []);
    } catch (err) {
      console.error('Error searching:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- XỬ LÝ TRẢ SÁCH ---
  const handleReturnBook = async (detailId: number, bookTitle: string) => {
    if (!window.confirm(`Xác nhận trả sách: "${bookTitle}"?`)) return;
    try {
      await returnBorrowSlipDetail(detailId);
      alert("Đã trả sách thành công!");
      if (refetchBorrowSlips) refetchBorrowSlips();
    } catch (error: any) {
      alert(error?.response?.data?.message || "Lỗi trả sách!");
    }
  };

  // --- XỬ LÝ XÓA PHIẾU ---
  const handleDeleteSlip = async (id: number) => {
    if (!window.confirm("Bạn chắc chắn muốn xóa phiếu mượn này?")) return;
    try {
      await deleteBorrowSlip(id);
      alert("Xóa thành công!");
      if (refetchBorrowSlips) refetchBorrowSlips();
    } catch (error: any) {
      alert("Xóa thất bại: " + (error?.response?.data?.message || "Lỗi server"));
    }
  };

  // --- MỞ FORM SỬA ---
  const handleEditClick = (slip: BorrowSlip) => {
    setSelectedSlip(slip);
    setIsEditBorrowSlipModalOpen(true);
  };

  const formatDate = (dateArray: number[] | null | undefined) => {
    if (!dateArray || dateArray.length < 3) return 'N/A';
    // Fix timezone: Tạo date string chuẩn ISO để tránh bị trừ lùi 1 ngày
    const [y, m, d] = dateArray;
    return `${d.toString().padStart(2, '0')}/${m.toString().padStart(2, '0')}/${y}`;
  };

  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BORROWED": return { className: "badge-active", icon: <Clock size={14} />, label: "BORROWED" };
      case "OVERDUE": return { className: "badge-overdue", icon: <AlertCircle size={14} />, label: "OVERDUE" };
      case "RETURNED": return { className: "badge-returned", icon: <CheckCircle size={14} />, label: "RETURNED" };
      default: return { className: "", icon: null, label: status };
    }
  };

  const displaySlips = searchResults !== null ? searchResults : (borrowSlips as BorrowSlip[]);

  return (
    <div style={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <TopBar title="Circulation Management" />

      {/* Loading */}
      {(loading || isSearching) && (
        <div className="empty-state"><Loader2 className="animate-spin" size={30} /><p>Loading...</p></div>
      )}

      {/* Filter Bar */}
      <div className="card filter-bar">
        <div className="search-wrapper">
          <Search size={18} color="#A3AED0" />
          <input 
            placeholder="Tìm theo người dùng, mã phiếu..." 
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <button className="btn-primary" onClick={() => setIsCreateBorrowSlipModalOpen(true)}>
          <Plus size={18} /> Thêm mới
        </button>
      </div>

      {/* Table */}
      {!loading && !isSearching && (
        <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table className="table-container">
            <thead>
              <tr>
                <th>Mã Phiếu</th>
                <th>Người Mượn</th>
                <th>Sách</th>
                <th>Ngày Mượn</th>
                <th>Hạn Trả</th>
                <th>Trạng Thái</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {displaySlips.length === 0 ? (
                <tr><td colSpan={7} className="empty-state">Không có dữ liệu.</td></tr>
              ) : (
                displaySlips.map((item: any) => {
                  const firstDetail = item.details?.[0];
                  if (!firstDetail) return null;
                  const status = firstDetail.returnDate ? "RETURNED" : item.status;
                  const config = getStatusConfig(status);

                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 700, color: '#0040ffff' }}>{item.slipCode}</td>
                      <td style={{ fontWeight: 600 }}>{item.reader?.username || 'N/A'}</td>
                      <td>{firstDetail?.book?.title || 'N/A'}</td>
                      <td>{formatDate(firstDetail?.borrowDate)}</td>
                      <td>{formatDate(firstDetail?.dueDate)}</td>
                      <td>
                        <span className={`status-badge ${config.className}`}>
                          {config.icon} {config.label}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {/* Nút Trả Sách */}
                          {status !== "RETURNED" && (
                            <button
                              className="btn-outline-primary"
                              onClick={() => handleReturnBook(firstDetail.id, firstDetail?.book?.title)}
                              style={{ fontSize: '11px', padding: '4px 8px' }}
                              title="Trả Sách"
                            >
                              Return
                            </button>
                          )}

                          {/* Nút Sửa (Mới thêm) */}
                          <button 
                            className="action-btn icon-edit"
                            onClick={() => handleEditClick(item)}
                            title="Sửa / Gia Hạn"
                          >
                            <Edit size={16} />
                          </button>

                          {/* Nút Xóa (Mới thêm) */}
                          <button 
                            className="action-btn icon-delete"
                            onClick={() => handleDeleteSlip(item.id)}
                            title="Xóa Phiếu"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      <CreateBorrowSlipForm
        isOpen={isCreateBorrowSlipModalOpen}
        onClose={() => setIsCreateBorrowSlipModalOpen(false)}
        onSuccess={() => { refetchBorrowSlips && refetchBorrowSlips(); setIsCreateBorrowSlipModalOpen(false); }}
        users={users || []}
        books={books || []}
      />

      {/* Edit Modal (Mới thêm) */}
      <EditBorrowSlipForm 
        isOpen={isEditBorrowSlipModalOpen}
        onClose={() => { setIsEditBorrowSlipModalOpen(false); setSelectedSlip(null); }}
        onSuccess={() => { refetchBorrowSlips && refetchBorrowSlips(); }}
        initialData={selectedSlip}
      />
    </div>
  );
}
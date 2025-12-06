import TopBar from "../components/TopBar";
import { Search, CheckCircle, AlertCircle, Clock, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useBorrowSlipData, useUserData, useBookData } from '../hooks/useManagementHooks';
import type { BorrowSlip } from '../hooks/useManagementHooks';
import { searchItems } from "../service/SearchingItem";
import CreateBorrowSlipForm from "../components/forms/create/CreateBorrowSlipForm";

// 1. Import API trả sách
import { returnBorrowSlipDetail } from "../api/apiService";

export default function CirculationManagement() {
  const { data: borrowSlips, loading, refetch: refetchBorrowSlips } = useBorrowSlipData(true);
  const { data: users } = useUserData(false);
  const { data: books } = useBookData(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BorrowSlip[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isCreateBorrowSlipModalOpen, setIsCreateBorrowSlipModalOpen] = useState(false);

  // --- XỬ LÝ TÌM KIẾM ---
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchItems(query, "borrow-slips", { borrowSlips });
      setSearchResults((results as BorrowSlip[]) || []);
    } catch (err) {
      console.error('Error searching borrow slips:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // --- HÀM XỬ LÝ TRẢ SÁCH ---
  const handleReturnBook = async (detailId: number, bookTitle: string) => {
    if (!detailId) {
      alert("Detail ID not found!");
      return;
    }

    if (!window.confirm(`Confirm return book: "${bookTitle}"?`)) {
      return;
    }

    try {
      await returnBorrowSlipDetail(detailId);
      alert("Return book successfully!");
      // Tải lại dữ liệu sau khi trả
      if (refetchBorrowSlips) refetchBorrowSlips();
    } catch (error: any) {
      console.error("Return Book Error:", error);
      const message = error?.response?.data?.message || "Return failed!";
      alert(message);
    }
  };

  // Helper format ngày tháng
  const formatDate = (dateArray: number[] | null | undefined) => {
    if (!dateArray || dateArray.length < 3) return 'N/A';
    return `${dateArray[2].toString().padStart(2, '0')}/${dateArray[1].toString().padStart(2, '0')}/${dateArray[0]}`;
  };

  // Helper hiển thị trạng thái (Giữ nguyên tiếng Anh)
  const getStatusConfig = (status: string) => {
    switch (status?.toUpperCase()) {
      case "BORROWED":
        return { className: "badge-active", icon: <Clock size={14} />, label: "BORROWED" };
      case "OVERDUE":
        return { className: "badge-overdue", icon: <AlertCircle size={14} />, label: "OVERDUE" };
      case "RETURNED":
        return { className: "badge-returned", icon: <CheckCircle size={14} />, label: "RETURNED" };
      default:
        return { className: "", icon: null, label: status };
    }
  };

  const displaySlips = searchResults !== null ? searchResults : (borrowSlips as BorrowSlip[]);

  return (
    <div>
      <TopBar title="Circulation Management" />

      {/* Filter / Search Bar */}
      <div className="card filter-bar">
        <div className="search-wrapper">
          <Search size={18} color="#A3AED0" />
          <input
            placeholder="Search by user or book..."
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <button className="btn-primary" onClick={() => setIsCreateBorrowSlipModalOpen(true)}>
          <Plus size={18} /> Create Slip
        </button>
      </div>

      {/* Loading State */}
      {(loading || isSearching) && (
        <div className="empty-state">
          <Loader2 className="animate-spin" size={30} />
          <p>Loading circulation data...</p>
        </div>
      )}

      {/* Table */}
      {!loading && !isSearching && (
        <div className="card" style={{ padding: 0 }}>
          <table className="table-container">
            <thead>
              <tr>
                <th>Slip Code</th>
                <th>Borrower</th>
                <th>Book Title</th>
                <th>Borrow Date</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {displaySlips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-state">No borrow slips found.</td>
                </tr>
              ) : (
                displaySlips.map((item: any) => {
                  const firstDetail = item.details?.[0];

                  if (!firstDetail) return null;

                  // Xác định trạng thái
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
                        {/* Nút Return Book (Text, không Icon) */}
                        {status !== "RETURNED" && (
                          <button
                            className="btn-outline-primary"
                            onClick={() => handleReturnBook(firstDetail.id, firstDetail?.book?.title)}
                            style={{ fontSize: '12px', padding: '4px 10px' }}
                          >
                            Return Book
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Borrow Slip Form */}
      <CreateBorrowSlipForm
        isOpen={isCreateBorrowSlipModalOpen}
        onClose={() => setIsCreateBorrowSlipModalOpen(false)}
        onSuccess={() => {
          refetchBorrowSlips && refetchBorrowSlips();
          setIsCreateBorrowSlipModalOpen(false);
        }}
        users={users || []}
        books={books || []}
      />
    </div>
  );
}
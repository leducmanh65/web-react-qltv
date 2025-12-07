import TopBar from "../components/TopBar";
import { Plus, Search, Mail, Phone, Edit, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import type { User } from '../hooks/useManagementHooks';
import { useUserData } from '../hooks/useManagementHooks';
import { deleteUser, deleteBorrowSlipUser, getBorrowSlipsByUserId } from "../api/apiService";
import { searchItems } from "../service/SearchingItem";

// Import Form
import CreateUserForm from "../components/forms/create/CreateUserForm";
import EditUserForm from "../components/forms/update/EditUserForm"; // Import mới

// Map API user response to display format
const formatUserForDisplay = (user: User) => ({
  id: user.id,
  userCode: user.userCode,
  name: user.username,
  role: user.roles?.[0] || 'Member',
  email: user.email,
  phone: user.phoneNumber,
  birthDate: user.birthDate, // Thêm trường này để truyền vào form sửa
  avatar: (user.username?.charAt(0) || 'U').toUpperCase(),
  bg: `hsl(${user.id * 60}, 70%, 60%)`,
  status: user.status || 'ACTIVE',
  bookQuota: user.bookQuota || 0,
  originalData: user // Giữ lại data gốc để truyền vào form sửa
});

export default function UserManagement() {
  const { data: users, loading, refetch: refetchUsers } = useUserData(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<User[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  
  // --- Modal States ---
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  
  // State cho Edit User (MỚI THÊM)
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // --- Handlers ---

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }

    setIsSearching(true);
    try {
      const results = await searchItems(query, "users", { users });
      setSearchResults((results as User[]) || []);
    } catch (err) {
      console.error('Error searching users:', err);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleDelete = (id: number) => {
    return window.confirm(`Bạn có chắc chắn muốn xóa user ID: ${id}?`);
  };

  // Hàm mở form sửa (MỚI THÊM)
  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsEditUserModalOpen(true);
  };

  const displayUsers = searchResults !== null ? searchResults : (users as User[]);
  const displayData = displayUsers.map(formatUserForDisplay);

  return (
    <div>
      <TopBar title="User Management" />
      {/* Filter / Search Bar */}
      <div className="card filter-bar">
        <div className="search-wrapper">
          <Search size={18} color="#A3AED0" />
          <input 
            placeholder="Tìm theo tên hoặc email..." 
            className="search-input-field"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        
        <button className="btn-primary" onClick={() => setIsCreateUserModalOpen(true)}>
          <Plus size={18} /> Thêm Mới
        </button>
      </div>

      {/* Loading State */}
      {(loading || isSearching) && (
        <div className="empty-state">
          <Loader2 className="animate-spin" size={30} />
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Grid Layout */}
      {!loading && !isSearching && (
        <div className="user-grid">
          {displayData.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
              <p>Không tìm thấy người dùng nào.</p>
            </div>
          ) : (
            displayData.map((item) => (
              <div key={item.id} className="card user-card" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', alignItems: 'start' }}>
                {/* Left Section: Avatar & Info */}
                <div>
                  <div className="user-avatar" style={{ background: item.bg }}>
                    {item.avatar}
                  </div>
                  
                  <h3 className="user-name">{item.name}</h3>
                  <p className="user-role">{item.role}</p>
                  <p style={{ fontSize: '12px', color: '#000000ff', marginBottom: '8px' }}>{item.userCode}</p>
                </div>
                
                {/* Right Section: Contact & Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Contact List */}
                  <div className="contact-list">
                    <div className="contact-item">
                      <Mail size={18} /> <span title={item.email} style={{overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{item.email}</span>
                    </div>
                    <div className="contact-item">
                      <Phone size={18} /> {item.phone || 'N/A'}
                    </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="card-footer" style={{ gap: '8px', flexDirection: 'column' }}>
                    {/* Nút Sửa: Đã gắn sự kiện onClick */}
                    <button 
                      className="btn-link" 
                      style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleEditClick(item.originalData)}
                    >
                      <Edit size={16} /> Sửa
                    </button>
                    
                    <button 
                      className="btn-link" 
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#E74C3C' }}
                      onClick={async () => { 
                        if (handleDelete(item.id)) { 
                          try {
                            // Thử kiểm tra xem user có BorrowSlip không
                            try {
                              const borrowSlips = await getBorrowSlipsByUserId(item.id);
                              const hasBorrowSlips = (borrowSlips?.data && Array.isArray(borrowSlips.data) && borrowSlips.data.length > 0) || 
                                                     (Array.isArray(borrowSlips) && borrowSlips.length > 0);
                              
                              // Nếu có BorrowSlip, xóa trước
                              if (hasBorrowSlips) {
                                await deleteBorrowSlipUser(item.id);
                              }
                            } catch (checkErr) {
                              // Nếu lỗi khi check, bỏ qua - vẫn xóa user
                              console.warn("Không thể kiểm tra BorrowSlip, vẫn tiếp tục xóa user", checkErr);
                            }
                            
                            // Xóa user
                            await deleteUser(item.id);
                            alert("Xóa người dùng thành công");
                            if(refetchUsers) refetchUsers();
                          } catch (e: any) {
                            alert("Xóa thất bại: " + (e?.message || "Lỗi không xác định"));
                          }
                        } 
                      }}
                    >
                      <Trash2 size={16} /> Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Create User Form */}
      <CreateUserForm
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSuccess={() => {
          refetchUsers && refetchUsers();
          setIsCreateUserModalOpen(false);
        }}
      />

      {/* Edit User Form (MỚI THÊM) */}
      <EditUserForm
        isOpen={isEditUserModalOpen}
        onClose={() => { 
          setIsEditUserModalOpen(false); 
          setSelectedUser(null); 
        }}
        onSuccess={() => {
          refetchUsers && refetchUsers();
        }}
        initialData={selectedUser}
      />
    </div>
  );
}
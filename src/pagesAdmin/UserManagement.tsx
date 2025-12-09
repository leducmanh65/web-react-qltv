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
  birthDate: user.birthDate, 
  avatar: (user.username?.charAt(0) || 'U').toUpperCase(),
  bg: `hsl(${user.id * 60}, 70%, 60%)`,
  status: user.status || 'ACTIVE',
  bookQuota: user.bookQuota || 0,
  originalData: user 
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
  // Sắp xếp: Admin user lên đầu, sau đó sắp xếp theo tên
  const sortedUsers = displayUsers.sort((a, b) => {
    const aIsAdmin = a.roles?.includes('admin') || a.roles?.includes('Admin') || a.roles?.includes('ADMIN');
    const bIsAdmin = b.roles?.includes('admin') || b.roles?.includes('Admin') || b.roles?.includes('ADMIN');

    if (aIsAdmin && !bIsAdmin) return -1;
    if (!aIsAdmin && bIsAdmin) return 1;
    return a.username.localeCompare(b.username);
  });
  const displayData = sortedUsers.map(formatUserForDisplay);

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
            displayData.map((item) => {
              const isAdmin = item.originalData?.roles?.includes('admin') || item.originalData?.roles?.includes('Admin') || item.originalData?.roles?.includes('ADMIN');
        return (
  <div 
    key={item.id} 
    className={`ad-usr-card ${isAdmin ? 'ad-usr-card--admin' : ''}`}
  >
    {/* 1. Phần Header: Avatar, Tên, Role */}
    <div className="ad-usr-header">
      <div className="ad-usr-avatar" style={{ background: item.bg }}>
        {item.avatar}
      </div>
      
      <h3 className="ad-usr-name">{item.name}</h3>
      
      <div className="ad-usr-badges">
        <span className="ad-usr-role">{item.role}</span>
        {isAdmin && <span className="ad-usr-tag-admin">ADMIN</span>}
      </div>
      
      <p className="ad-usr-code">{item.userCode}</p>
    </div>

    {/* 2. Phần Body: Thông tin liên hệ */}
    <div className="ad-usr-body">
      <div className="ad-usr-contact-row" title={item.email}>
        <div className="ad-usr-icon-box">
          <Mail size={14} />
        </div>
        <span className="ad-usr-text-truncate">{item.email}</span>
      </div>
      
      <div className="ad-usr-contact-row">
        <div className="ad-usr-icon-box">
          <Phone size={14} />
        </div>
        <span>{item.phone || 'N/A'}</span>
      </div>
    </div>

    {/* 3. Phần Footer: Nút bấm */}
    <div className="ad-usr-footer">
      <button 
        className="ad-usr-btn ad-usr-btn--edit"
        onClick={() => handleEditClick(item.originalData)}
      >
        <Edit size={14} /> Sửa
      </button>
      
      <button 
        className="ad-usr-btn ad-usr-btn--delete"
        onClick={async () => { 
          if (handleDelete(item.id)) { 
            try {
              // Logic kiểm tra và xóa cũ của bạn
              try {
                const borrowSlips = await getBorrowSlipsByUserId(item.id);
                const hasBorrowSlips = (borrowSlips?.data && Array.isArray(borrowSlips.data) && borrowSlips.data.length > 0) || 
                                       (Array.isArray(borrowSlips) && borrowSlips.length > 0);
                if (hasBorrowSlips) {
                  await deleteBorrowSlipUser(item.id);
                }
              } catch (checkErr) {
                console.warn("Lỗi check borrow slip", checkErr);
              }
              await deleteUser(item.id);
              alert("Xóa thành công");
              if(refetchUsers) refetchUsers();
            } catch (e: any) {
              alert("Xóa thất bại: " + (e?.message || "Lỗi"));
            }
          } 
        }}
      >
        <Trash2 size={14} /> Xóa
      </button>
    </div>
  </div>
);
            })
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
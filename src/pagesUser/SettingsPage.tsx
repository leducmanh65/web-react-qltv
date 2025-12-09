import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 1. Thêm import này
import { Edit, Settings, LogOut, User, Mail, Phone, Calendar, Shield } from "lucide-react";
import "../styles/User/home.css";
import { getUserById } from "../api/apiService";
import EditUserForm from "../components/forms/update/EditUserForm";

export const SettingsPage: React.FC = () => {
  const navigate = useNavigate(); // 2. Khởi tạo navigate
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const loadUserInfo = async () => {
    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setLoading(false);
        return;
      }

      const response: any = await getUserById(userId);
      const userData = response?.data || response;
      setUserInfo(userData);
    } catch (err) {
      console.error("Failed to load user info:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserInfo();
  }, []);

  const handleLogout = () => {
    if(window.confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      localStorage.clear();
      window.location.href = "/login"; // Logout thì reload trang là hợp lý để clear state
    }
  };

  const getRoleLabel = () => {
    const roleField = userInfo?.roles?.[0]?.name || userInfo?.role?.name || userInfo?.role || "Thành viên thư viện";
    // Nếu role là object (ví dụ {id:1, name: 'USER'}), lấy name, nếu string thì giữ nguyên
    return typeof roleField === 'object' ? roleField.name : roleField;
  };

  // 3. Sửa lại hàm isAdmin cho an toàn hơn
  const isAdmin = () => {
    if (!userInfo) return false;
    
    // Gom tất cả các khả năng role vào 1 mảng string để kiểm tra
    const rolesToCheck: string[] = [];

    // Trường hợp 1: userInfo.roles (Mảng)
    if (Array.isArray(userInfo.roles)) {
      userInfo.roles.forEach((r: any) => rolesToCheck.push(r?.name || r));
    }
    
    // Trường hợp 2: userInfo.role (Object hoặc String)
    if (userInfo.role) {
      rolesToCheck.push(userInfo.role.name || userInfo.role);
    }

    // Kiểm tra xem có từ khóa "ADMIN" không (không phân biệt hoa thường)
    return rolesToCheck.some(r => 
      typeof r === 'string' && r.toUpperCase().includes("ADMIN")
    );
  };

  const formatDate = (value: any) => {
    if (!value) return "Chưa cập nhật";
    if (typeof value === "string") return value.substring(0, 10);
    if (Array.isArray(value)) {
      const [y, m, d] = value;
      const pad = (n: number) => String(n).padStart(2, "0");
      return `${pad(d)}/${pad(m)}/${y}`;
    }
    return "Chưa cập nhật";
  };

  return (
    <div className="user-layout">
      <div className="user-layout__content">
        
        {/* Header */}
        <div className="user-section__header">
          <h2 className="user-section__title">
            <Settings size={24} color="var(--user-primary)" />
            Cài đặt tài khoản
          </h2>
        </div>
        
        {loading ? (
          <div className="user-state--loading">
            <p>⏳ Đang tải thông tin...</p>
          </div>
        ) : (
          <div className="user-filter__card" style={{ maxWidth: "700px", margin: "0 auto" }}>
            
            {/* Card Header */}
            <div className="user-settings__header">
              <h3 className="user-settings__title">Thông tin cá nhân</h3>
              <button
                className="user-filter__btn"
                onClick={() => setIsEditModalOpen(true)}
                style={{ height: "40px", fontSize: "13px" }}
              >
                <Edit size={16} style={{ marginRight: "6px" }} />
                Chỉnh sửa
              </button>
            </div>
            
            {/* Form Fields - Read Only */}
            <div className="user-settings__grid">
              
              {/* Username */}
              <div className="user-settings__group">
                <label className="user-settings__label">Tên đăng nhập</label>
                <div className="user-input-group">
                  <User size={18} className="user-input-icon" />
                  <input 
                    type="text" 
                    className="user-filter__input user-input-with-icon" 
                    value={userInfo?.username || ""} 
                    disabled 
                  />
                </div>
              </div>

              {/* Email */}
              <div className="user-settings__group">
                <label className="user-settings__label">Email</label>
                <div className="user-input-group">
                  <Mail size={18} className="user-input-icon" />
                  <input 
                    type="email" 
                    className="user-filter__input user-input-with-icon" 
                    value={userInfo?.email || ""} 
                    disabled 
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="user-settings__group">
                <label className="user-settings__label">Số điện thoại</label>
                <div className="user-input-group">
                  <Phone size={18} className="user-input-icon" />
                  <input 
                    type="text" 
                    className="user-filter__input user-input-with-icon" 
                    value={userInfo?.phoneNumber || "Chưa cập nhật"}
                    disabled 
                  />
                </div>
              </div>

              {/* Birth Date */}
              <div className="user-settings__group">
                <label className="user-settings__label">Ngày sinh</label>
                <div className="user-input-group">
                  <Calendar size={18} className="user-input-icon" />
                  <input 
                    type="text" 
                    className="user-filter__input user-input-with-icon" 
                    value={formatDate(userInfo?.birthDate)}
                    disabled 
                  />
                </div>
              </div>

              {/* Role (Optional) */}
              <div className="user-settings__group">
                <label className="user-settings__label">Vai trò</label>
                <div className="user-input-group">
                  <Shield size={18} className="user-input-icon" />
                  <input 
                    type="text" 
                    className="user-filter__input user-input-with-icon" 
                    value={getRoleLabel()}
                    disabled 
                  />
                </div>
              </div>

            </div>

            {/* Logout Section */}
            {/* 4. Thêm gap: "12px" vào đây để 2 nút không dính nhau */}
            <div className="user-settings__footer" style={{ gap: "12px" }}>
              {isAdmin() && (
                <button 
                  className="user-filter__btn"
                  style={{ backgroundColor: "#2563eb", color: "white" }}
                  // 5. Dùng navigate thay vì window.location để chuyển trang Admin mượt hơn
                  onClick={() => navigate("/admin")}
                >
                  <Shield size={16} style={{marginRight: 8}}/>
                  Vào trang Admin
                </button>
              )}
              <button 
                className="user-btn--danger"
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Đăng xuất
              </button>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        <EditUserForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => {
            setIsEditModalOpen(false);
            loadUserInfo();
          }}
          initialData={userInfo}
        />
      </div>
    </div>
  );
};

export default SettingsPage;
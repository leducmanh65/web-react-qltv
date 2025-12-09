import { createUser, loginAuthentication } from '../api/apiService';
import type { LoginDto } from '../api/apiService';
import { useState } from "react"; 
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();
  
  // State điều khiển việc trượt qua lại giữa Login/Register
  const [isActive, setIsActive] = useState(false);
  
  // State quan trọng: Chỉ bật lên TRUE sau khi API trả về Role ADMIN
  const [showAdminSelection, setShowAdminSelection] = useState(false);

  // Input states
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [birthDate, setBirthDate] = useState<string>(""); 
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [location, setLocation] = useState<string>("");

  const handleRegisterClick = () => {
    setIsActive(true);
    setShowAdminSelection(false); // Reset nếu chuyển tab
  };

  const handleLoginClick = () => {
    setIsActive(false);
    setShowAdminSelection(false); // Reset nếu chuyển tab
  };

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault(); 

    const loginDto: LoginDto = {
      username: username,
      password: password,
    };

    try {
      // 1. Gọi API
      const response = await loginAuthentication(loginDto);
      
      // 2. Lấy Role từ response
      let role = "";
      try {
        role = (response as any)?.user?.roles?.[0] || "";
      } catch (err) {
        console.warn("Lỗi đọc role:", err);
      }

      // Lưu userId để dùng cho các trang user (lịch sử mượn/đọc, reader)
      const userId = (response as any)?.user?.id ?? (response as any)?.id ?? (response as any)?.userId;
      if (userId !== undefined && userId !== null) {
        localStorage.setItem("userId", String(userId));
      }

      const normalizedRole = role?.toString().toUpperCase() || "";

      // Lưu storage để dùng cho các request sau
      if (normalizedRole) {
        localStorage.setItem("userRole", normalizedRole);
      } else {
        alert("Không xác định được quyền!");
        return;
      }

      // 3. Xử lý điều hướng dựa trên Role
      if (normalizedRole === "ADMIN") {
        // --- KEY POINT: Kích hoạt hoạt ảnh ---
        // Không navigate ngay, mà đổi state để UI biến đổi
        setShowAdminSelection(true); 
      } else if (normalizedRole === "USER") {
        // User thường thì đi luôn
        alert("Đăng nhập thành công!");
        navigate("/user");
      } else {
        alert(`Quyền ${normalizedRole} chưa được hỗ trợ.`);
      }

    } catch (error: any) {
      console.error("Login Error:", error);
      alert("Đăng nhập thất bại, vui lòng kiểm tra lại!");
    }
  };

  const handleSubmitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
     const registerDto = {
      username, password, birthDate: new Date(birthDate), 
      email, phoneNumber, location,
    };

    try {
      await createUser(registerDto);
      alert("Đăng ký thành công!");
      setIsActive(false); 
    } catch (error: any) {
      alert("Đăng ký thất bại");
    }
  }

  // Giao diện 2 nút cho Admin (sẽ xuất hiện sau khi login thành công)
  const AdminSelectionPanel = () => (
    <div className="admin-selection-box">
      <h1>Hello Admin!</h1>
      <p>Vui lòng chọn trang bạn muốn truy cập:</p>
      <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "10px" }}>
        <button 
          className="ghost" 
          style={{ border: "2px solid white", backgroundColor: "rgba(255,255,255,0.2)" }} 
          onClick={() => navigate('/admin')}
        >
          Vào Admin
        </button>
        <button 
          className="ghost" 
          style={{ border: "2px solid white" }} 
          onClick={() => navigate('/user')}
        >
          Vào User
        </button>
      </div>
    </div>
  );

  return (
    <div className={`auth-container ${isActive ? "right-panel-active" : ""}`} id="container">
      
      {/* FORM ĐĂNG KÝ (Giữ nguyên) */}
      <div className="form-container register-container">
        <form onSubmit={handleSubmitRegister}>
          <h1 style={{color:"black"}}>Register</h1> 
          <input type="text" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="text" placeholder="Phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
          <button type="submit">Register</button>
        </form>
      </div>

      {/* FORM ĐĂNG NHẬP */}
      <div className="form-container login-container">
        <form onSubmit={handleSubmitLogin}>
          <h1 style={{color:"black"}}>Login</h1>
          <input type="text" placeholder="Name" value={username} onChange={(e) => setUsername(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          
          {/* Ẩn nút Login sau khi Admin đăng nhập thành công để tránh bấm lại */}
          {!showAdminSelection ? (
            <button type="submit">Login</button>
          ) : (
             <p style={{ color: '#00ca6fff', fontWeight: 'bold', marginTop: 10 }}>
               Xác thực thành công
             </p>
          )}
        </form>
      </div>

      {/* OVERLAY CONTAINER */}
      <div className="overlay-container">
        <div className="overlay">
          <video autoPlay muted loop playsInline className="video-background">
            <source src="/1203.mp4" type="video/mp4" />
          </video>
          
          {/* PANEL TRÁI: Dành cho lúc đang ở Tab Register */}
          <div className="overlay-panel overlay-left">
            <h1>Hello Friends</h1>
            <p>If you already have an account login here</p>
            <button className="ghost" onClick={handleLoginClick}>Login</button>
          </div>

          {/* PANEL PHẢI: Dành cho lúc đang ở Tab Login */}
          <div className="overlay-panel overlay-right">
            {/* Logic hiển thị hoạt ảnh ở đây */}
            {!showAdminSelection ? (
              // 1. Trạng thái bình thường: Chưa đăng nhập hoặc chưa login xong
              <div className="default-content">
                <h1>Start Journey</h1>
                <p>If you don't have an account yet, join us.</p>
                <button className="ghost" onClick={handleRegisterClick}>Register</button>
              </div>
            ) : (
              // 2. Trạng thái Admin: Sau khi Login API trả về "ADMIN"
              // Class 'fade-in-up' tạo hiệu ứng xuất hiện
              <div className="fade-in-up">
                <AdminSelectionPanel />
              </div>
            )}
          </div>

        </div>
      </div>
      
      {/* CSS Animation nhúng trực tiếp */}

    </div>
  )
}
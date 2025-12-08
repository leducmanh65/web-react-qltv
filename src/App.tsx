import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useAdminGuard } from "./hooks/useAdminGuard";
import { useUserGuard } from "./hooks/useUserGuard";

// Components
import Sidebar from "./components/Sidebar";

// Pages (Đảm bảo đã tạo đủ các file này trong thư mục src/pages/)
import Dashboard from "./pagesAdmin/Dashboard";
import BookManagement from "./pagesAdmin/BookManagement";
import UserManagement from "./pagesAdmin/UserManagement";
import CirculationManagement from "./pagesAdmin/CirculationManagement";
import LoginPage from "./loginAndRegis/LoginPage"; // Hoặc đường dẫn tới file Login của bạn
import EbookManagement from "./pagesAdmin/EbookManagement";
import Homepage from "./pagesUser/Homepage";
import ReaderPage from "./pagesUser/reader";

// Admin Layout: Chứa Sidebar và vùng nội dung chính
const AdminLayout = () => {
  useAdminGuard();

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Outlet /> {/* Nơi các trang con hiển thị */}
      </div>
    </div>
  );
};

// User Layout: Bảo vệ các route user
const UserLayout = () => {
  useUserGuard();
  return <Outlet />;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route Public: Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Route Protected: User Pages */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/user/reader/:bookId" element={<ReaderPage />} />
        </Route>



        {/* Route Protected: Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>

          {/* Dashboard (Trang chủ) */}
          <Route index element={<Dashboard />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          {/* Các trang chức năng */}
          <Route path="/admin/books" element={<BookManagement />} />
          <Route path="/admin/circulation" element={<CirculationManagement />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/ebooks" element={<EbookManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
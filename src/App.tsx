import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import { useAdminGuard } from "./hooks/useAdminGuard";

// Components
import Sidebar from "./components/Sidebar";

// Pages Admin
import Dashboard from "./pagesAdmin/Dashboard";
import BookManagement from "./pagesAdmin/BookManagement";
import UserManagement from "./pagesAdmin/UserManagement";
import CirculationManagement from "./pagesAdmin/CirculationManagement";
import EbookManagement from "./pagesAdmin/EbookManagement";

// Pages User
import LoginPage from "./loginAndRegis/LoginPage";
import HomePage from "./pagesUser/HomePage";
import { ReadingHistoryPage } from "./pagesUser/ReadingHistoryPage";
import { EbookHistoryPage } from "./pagesUser/EbookHistoryPage";
import SettingsPage from "./pagesUser/SettingsPage";
import UserLayout from "./pagesUser/UserLayout";
import ReaderPage from "./pagesUser/ReaderPage";

// Admin Layout
const AdminLayout = () => {
  useAdminGuard();
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<LoginPage />} />
        {/* Route Protected: User Pages */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<HomePage />} />
          <Route path="home" element={<HomePage />} />
          <Route path="history" element={<ReadingHistoryPage />} />
          <Route path="ebook-history" element={<EbookHistoryPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="reader/:bookId" element={<ReaderPage />} />
        </Route>

        {/* Route Protected: Admin Dashboard */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="books" element={<BookManagement />} />
          <Route path="circulation" element={<CirculationManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="ebooks" element={<EbookManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
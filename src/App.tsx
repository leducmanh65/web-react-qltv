import { BrowserRouter, Routes, Route } from "react-router-dom";
// Tùy theo bạn đặt tên file là page.tsx hay index.tsx
import AuthPage from "./loginAndRegis/page"; 
// import Layout from "./loginAndRegis/layout"; // Component Layout đã sửa

export default function App() {
  return (
    <BrowserRouter>
      {/* Bọc toàn bộ nội dung trong Layout */}
      {/* <Layout>  */}
        <Routes>
          {/* Đường dẫn mặc định */}
          <Route path="/" element={<AuthPage />} /> 
          {/* Hoặc đường dẫn cụ thể */}
          <Route path="/auth" element={<AuthPage />} /> 
        </Routes>
      {/* </Layout> */}
    </BrowserRouter>
  );
}
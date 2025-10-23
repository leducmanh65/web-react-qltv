import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import ThanhDieuHuong from './components/ThanhDieuHuong';
import TrangChu from './components/TrangChu';
import ThemBaiViet from './components/ThemBaiViet';
import ChiTiet from './components/ChiTiet';
import { BaiViet } from './types/BaiViet';
import { duLieuBaiViet } from './data';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [dsBaiViet, setDsBaiViet] = useState<BaiViet[]>(duLieuBaiViet);

  const themBai = (baiviet: BaiViet) => {
    setDsBaiViet([...dsBaiViet, baiviet]);
  };

  const xoaBai = (id: number) => {
    if(window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
      setDsBaiViet(dsBaiViet.filter(bai => bai.id !== id));
    }
  };

  const suaBai = (baiDaSua: BaiViet) => {
    setDsBaiViet(dsBaiViet.map(bai => 
      bai.id === baiDaSua.id ? baiDaSua : bai
    ));
  };

  return (
    <BrowserRouter>
      <ThanhDieuHuong />
      <div className="container py-4">
        <Routes>
          <Route path="/" element={
            <TrangChu dsBaiViet={dsBaiViet} onXoa={xoaBai} />
          } />
          <Route path="/them-bai" element={
            <ThemBaiViet onThem={themBai} />
          } />
          <Route path="/bai-viet/:id" element={
            <ChiTiet dsBaiViet={dsBaiViet} onXoa={xoaBai} />
          } />
          <Route path="/sua-bai/:id" element={
            <ThemBaiViet dsBaiViet={dsBaiViet} onSua={suaBai} />
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
// src/api/axiosClient.ts
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://okhiepkkkkkkkkkkkkkkhahahahahahahahaha.up.railway.app', // Ví dụ: 'http://localhost:8080/api'
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- THÊM INTERCEPTOR (Người gác cổng) ---
axiosClient.interceptors.response.use(
  (response) => {
    // Nếu phản hồi thành công (2xx), trả về dữ liệu bình thường
    return response.data;
  },
  (error) => {
    // Nếu có lỗi xảy ra
    const { response } = error;

    if (response) {
      // Kiểm tra mã lỗi
      if (response.status === 401) {
        // Lỗi 401: Hết hạn phiên đăng nhập hoặc chưa đăng nhập
        console.warn("Phiên đăng nhập hết hạn, đang chuyển hướng...");
        
        // Xóa token cũ nếu có (ví dụ lưu trong localStorage)
        localStorage.removeItem('accessToken'); 

        // Chuyển hướng về trang login
        // Lưu ý: Dùng window.location để force reload lại trang sạch sẽ
        window.location.href = '/auth'; // Đổi '/auth' thành đường dẫn trang login của bạn
      }

      if (response.status === 400) {
        // Lỗi 400: Dữ liệu gửi lên sai
        // THẬN TRỌNG: Nếu đang ở ngay trang Login mà bị 400 (sai pass) 
        // thì không nên redirect vì sẽ làm f5 lại trang, mất dữ liệu đang nhập.
        
        // Chỉ redirect nếu bạn thực sự muốn:
        // window.location.href = '/auth';
        
        console.error("Dữ liệu không hợp lệ:", response.data);
      }
    }

    return Promise.reject(error);
  }
);
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export default axiosClient;
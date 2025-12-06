import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://okhiepkkkkkkkkkkkkkkhahahahahahahahaha.up.railway.app', 
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    const res = response.data;
    
    // --- ĐOẠN CODE QUAN TRỌNG ĐÃ SỬA ---
    // Backend trả về { code: 1000, message: "...", result: ... }
    
    // 1. Nếu code = 1000 là Thành công
    if (res.code === 1000) {
      // Nếu có biến 'result' (ví dụ lúc lấy danh sách) thì trả về result để giao diện vẽ
      // Nếu 'result' là null/undefined (ví dụ lúc Xóa thành công) thì trả về nguyên cục 'res' để lấy message
      return res.result ? res.result : res;
    }
    
    // 2. Nếu code KHÁC 1000 (Ví dụ 1001: Lỗi nghiệp vụ, 9999: Lỗi không xác định)
    // Ta chủ động NÉM LỖI để hàm catch() bên ngoài bắt được và hiện Alert
    return Promise.reject(new Error(res.message || "Lỗi từ phía Server"));
  },
  
  (error) => {
    // Xử lý lỗi HTTP (401, 403, 500...)
    const { response } = error;
    if (response) {
      if (response.status === 401) {
        console.warn("Phiên đăng nhập hết hạn.");
        localStorage.removeItem('accessToken'); 
        window.location.href = '/auth'; 
      }
      // Log lỗi chi tiết ra console để debug
      console.error("API Error:", response.data);
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
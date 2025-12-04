
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://okhiepkkkkkkkkkkkkkkhahahahahahahahaha.up.railway.app', 
  headers: {
    'Content-Type': 'application/json',
  },
});


axiosClient.interceptors.response.use(
  (response) => {

    return response.data.result;
  },
  (error) => {
  
    const { response } = error;

    if (response) {
    // Kiểm tra mã lỗi
      if (response.status === 401) {
        // Lỗi 401: Hết hạn phiên đăng nhập hoặc chưa đăng nhập
        console.warn("Phiên đăng nhập hết hạn, đang chuyển hướng...");
        
        // Xóa token cũ nếu có
        localStorage.removeItem('accessToken'); 

        
        window.location.href = '/auth'; 
      }

      if (response.status === 400) {
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
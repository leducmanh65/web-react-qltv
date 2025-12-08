import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMyInfo } from "../api/apiService";

/**
 * useUserGuard
 * Kiểm tra authentication cho các route /user
 * Yêu cầu user phải đăng nhập, nếu không sẽ redirect về /login
 */
export function useUserGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ guard khi vào các route /user
    if (!location.pathname.startsWith("/user")) return;

    let isMounted = true;

    const check = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        // Nếu không có token, redirect ngay
        if (!token) {
          if (!isMounted) return;
          navigate("/login", { replace: true });
          return;
        }

        // Gọi API để verify token còn hợp lệ
        const res: any = await getMyInfo();
        if (!isMounted) return;

        // Kiểm tra xem có thông tin user không
        const user = res?.data || res;
        if (!user || !user.id) {
          localStorage.removeItem("accessToken");
          navigate("/login", { replace: true });
        }
        // User đã đăng nhập thành công, cho phép truy cập
      } catch (err) {
        // Nếu lỗi (401, 403, network...), xoá token và redirect
        if (!isMounted) return;
        localStorage.removeItem("accessToken");
        navigate("/login", { replace: true });
      }
    };

    check();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);
}

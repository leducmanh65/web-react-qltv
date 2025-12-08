import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getMyInfo } from "../api/apiService";

/**
 * useAdminGuard
 * Gọi getMyInfo để kiểm tra role. Nếu đang ở /admin và user không phải ADMIN
 * hoặc lỗi khi gọi API, sẽ xoá token và chuyển hướng về /login.
 */
export function useAdminGuard() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Chỉ guard khi vào các route /admin
    if (!location.pathname.startsWith("/admin")) return;

    let isMounted = true;

    const check = async () => {
      try {
        const res: any = await getMyInfo();
        if (!isMounted) return;

        const roles: string[] = res?.data?.roles || res?.roles || [];
        const isAdmin = roles?.includes?.("ADMIN");
        if (!isAdmin) {
          localStorage.removeItem("accessToken");
          navigate("/login", { replace: true });
        }
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

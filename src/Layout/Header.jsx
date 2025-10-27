
import React, { useEffect } from "react";
import { Search, Menu } from "lucide-react"; 
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom"; 
import { useAuth } from "../utils/AuthContext.jsx";


const Header = () => {
  // State lưu tổng số lượng sản phẩm trong giỏ hàng
  // Cart UI removed for admin/public minimal header
  const { admin, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Hàm lấy tổng số lượng sản phẩm từ localStorage
  


  useEffect(() => {
    // Lấy tổng số lượng ban đầu khi trang vừa load
    

    // Hàm xử lý khi giỏ hàng được cập nhật
    
    // Keep legacy event, but noop for admin context
    const handleAuth = () => {};
    window.addEventListener("auth:updated", handleAuth);

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      
      window.removeEventListener("auth:updated", handleAuth);
    };
  }, []);

  const isAdminView = isAuthenticated || location.pathname.startsWith('/admin');

  if (isAdminView) {
    return (
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 py-2">
          <button className="md:hidden">
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
          <Link to="/admin" className="text-xl font-bold text-blue-600">Admin Panel</Link>
          <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-4">
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`
                }
              >Dashboard</NavLink>
              <NavLink
                to="#"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`
                }
              >Đơn hàng</NavLink>
              <NavLink
                to="#"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`
                }
              >Sản phẩm</NavLink>
              <NavLink
                to="/admin/products"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`
                }
              >Người dùng</NavLink>
              <NavLink
                to="#"
                className={({ isActive }) =>
                  `text-sm ${isActive ? 'text-blue-600 font-medium' : 'text-gray-700 hover:text-blue-600'}`
                }
              >Báo cáo</NavLink>
            </nav>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700">{admin?.username}</span>
              <button
                onClick={() => { logout(); navigate('/login'); }}
                className="text-sm text-blue-600 hover:underline"
              >Đăng xuất</button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-4 py-2">
        <button className="md:hidden">
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <Link to={"/"} className="text-xl font-bold text-blue-600">MobileShop</Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">Đăng nhập</Link>
        </div>
      </div>

      <div className="px-4 pb-2">
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
          <Search className="w-5 h-5 text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Tìm sản phẩm..."
            className="bg-transparent outline-none w-full text-sm"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;

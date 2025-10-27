import React from 'react'
import { useAuth } from '../utils/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()

  const handleProductsClick = () => {
    navigate('/admin/products')
  }

  return (
    <div>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Bảng điều khiển quản trị</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Xin chào, {admin?.username}</span>
            <button onClick={logout} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">Đăng xuất</button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded shadow">Tổng doanh thu (demo)</div>
          <div className="p-4 bg-white rounded shadow">Đơn hàng hôm nay (demo)</div>
          <div 
            className="p-4 bg-white rounded shadow cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={handleProductsClick}
          >
            <div className="text-blue-600 font-semibold">Sản phẩm</div>
            <div className="text-sm text-gray-500">Quản lý sản phẩm</div>
          </div>
          <div className="p-4 bg-white rounded shadow">Khách hàng (demo)</div>
        </div>
        <p className="text-gray-600">Đây là trang placeholder, sẽ mở rộng các mục: quản lý sản phẩm, đơn hàng, người dùng và báo cáo.</p>
      </div>
    </div>
  )
}

export default AdminDashboard



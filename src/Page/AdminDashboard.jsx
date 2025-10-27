import React, { useState, useEffect } from 'react'
import { useAuth } from '../utils/AuthContext.jsx'
import { useNavigate } from 'react-router-dom'

const AdminDashboard = () => {
  const { admin, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0
  })

  useEffect(() => {
    // Load stats from localStorage
    const orders = JSON.parse(localStorage.getItem('adminOrders') || '[]')
    const users = JSON.parse(localStorage.getItem('adminUsers') || '[]')
    const products = JSON.parse(localStorage.getItem('adminProducts') || '[]')
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalOrders = orders.length
    const totalUsers = users.length
    const totalProducts = products.length || 0

    setStats({
      totalRevenue,
      totalOrders,
      totalUsers,
      totalProducts
    })
  }, [])

  const handleProductsClick = () => {
    navigate('/admin/products')
  }

  const handleOrdersClick = () => {
    navigate('/admin/orders')
  }

  const handleUsersClick = () => {
    navigate('/admin/users')
  }

  const handleReportsClick = () => {
    navigate('/admin/reports')
  }

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + '₫'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Bảng điều khiển quản trị</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Xin chào, {admin?.username}</span>
              <button onClick={logout} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalRevenue)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-xl">📦</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Tổng đơn hàng</div>
                <div className="text-2xl font-semibold text-gray-900">{stats.totalOrders}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">👥</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Tổng khách hàng</div>
                <div className="text-2xl font-semibold text-gray-900">{stats.totalUsers}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">📱</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Tổng sản phẩm</div>
                <div className="text-2xl font-semibold text-gray-900">{stats.totalProducts}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Management Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-blue-500"
            onClick={handleProductsClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">Quản lý sản phẩm</div>
                <div className="text-sm text-gray-500">Thêm/sửa/xóa sản phẩm</div>
              </div>
              <span className="text-blue-600 text-2xl">📱</span>
            </div>
            <div className="mt-4 text-sm text-blue-600 font-medium">Quản lý →</div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-green-500"
            onClick={handleOrdersClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">Quản lý đơn hàng</div>
                <div className="text-sm text-gray-500">Xem và cập nhật trạng thái</div>
              </div>
              <span className="text-green-600 text-2xl">📦</span>
            </div>
            <div className="mt-4 text-sm text-green-600 font-medium">Quản lý →</div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-purple-500"
            onClick={handleUsersClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">Quản lý người dùng</div>
                <div className="text-sm text-gray-500">Khóa/mở tài khoản</div>
              </div>
              <span className="text-purple-600 text-2xl">👥</span>
            </div>
            <div className="mt-4 text-sm text-purple-600 font-medium">Quản lý →</div>
          </div>

          <div 
            className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-orange-500"
            onClick={handleReportsClick}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-semibold text-gray-800">Báo cáo & Thống kê</div>
                <div className="text-sm text-gray-500">Biểu đồ và phân tích</div>
              </div>
              <span className="text-orange-600 text-2xl">📊</span>
            </div>
            <div className="mt-4 text-sm text-orange-600 font-medium">Xem báo cáo →</div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Hoạt động gần đây</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-green-600 mr-3">✅</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Đơn hàng mới #ORD001</div>
                <div className="text-xs text-gray-500">2 phút trước - Nguyễn Văn A</div>
              </div>
              <span className="text-sm text-gray-500">15,000,000₫</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-blue-600 mr-3">📱</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Sản phẩm mới được thêm</div>
                <div className="text-xs text-gray-500">1 giờ trước - iPhone 15 Pro Max</div>
              </div>
              <span className="text-sm text-gray-500">35,000,000₫</span>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-purple-600 mr-3">👤</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-800">Người dùng mới đăng ký</div>
                <div className="text-xs text-gray-500">3 giờ trước - Trần Thị B</div>
              </div>
              <span className="text-sm text-gray-500">tranthib@email.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard



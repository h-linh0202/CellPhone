import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';

const AdminReports = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');
  const [salesData, setSalesData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  useEffect(() => {
    // Mock data cho demo
    const generateMockData = () => {
      // Sales data by day (last 30 days)
      const salesByDay = [];
      const ordersByDay = [];
      const baseDate = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(baseDate);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        // Random sales data
        const sales = Math.floor(Math.random() * 50000000) + 10000000;
        const orders = Math.floor(Math.random() * 20) + 5;
        
        salesByDay.push({ date: dateStr, amount: sales });
        ordersByDay.push({ date: dateStr, count: orders });
      }

      // Top selling products
      const topProducts = [
        { name: 'iPhone 15 Pro', sales: 45, revenue: 675000000 },
        { name: 'Samsung Galaxy S24', sales: 38, revenue: 456000000 },
        { name: 'iPad Air', sales: 32, revenue: 256000000 },
        { name: 'MacBook Pro', sales: 15, revenue: 375000000 },
        { name: 'AirPods Pro', sales: 28, revenue: 140000000 },
        { name: 'Apple Watch', sales: 22, revenue: 132000000 }
      ];

      return { salesByDay, ordersByDay, topProducts };
    };

    const mockData = generateMockData();
    setSalesData(mockData.salesByDay);
    setOrdersData(mockData.ordersByDay);
    setProductsData(mockData.topProducts);
    setLoading(false);
  }, [timeRange]);

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  const getTotalRevenue = () => {
    return salesData.reduce((sum, day) => sum + day.amount, 0);
  };

  const getTotalOrders = () => {
    return ordersData.reduce((sum, day) => sum + day.count, 0);
  };

  const getAverageOrderValue = () => {
    const totalRevenue = getTotalRevenue();
    const totalOrders = getTotalOrders();
    return totalOrders > 0 ? totalRevenue / totalOrders : 0;
  };

  const getTopSellingProduct = () => {
    return productsData.reduce((top, product) => 
      product.sales > top.sales ? product : top, productsData[0] || { name: 'N/A', sales: 0 }
    );
  };

  const formatCurrency = (amount) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  const getSalesChartData = () => {
    return salesData.map(day => ({
      date: new Date(day.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
      amount: day.amount
    }));
  };

  const getOrdersChartData = () => {
    return ordersData.map(day => ({
      date: new Date(day.date).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric' }),
      count: day.count
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Quay lại Dashboard
              </button>
              <h1 className="text-2xl font-bold text-gray-800">Báo cáo & Thống kê</h1>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 text-sm"
              >
                <option value="7days">7 ngày qua</option>
                <option value="30days">30 ngày qua</option>
                <option value="90days">90 ngày qua</option>
              </select>
              <span className="text-sm text-gray-600">Xin chào, {admin?.username}</span>
              <button onClick={logout} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-xl">💰</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Tổng doanh thu</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(getTotalRevenue())}</div>
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
                <div className="text-2xl font-semibold text-gray-900">{getTotalOrders()}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-xl">📊</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Giá trị đơn hàng TB</div>
                <div className="text-2xl font-semibold text-gray-900">{formatCurrency(getAverageOrderValue())}</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-xl">🏆</span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">Sản phẩm bán chạy</div>
                <div className="text-lg font-semibold text-gray-900">{getTopSellingProduct().name}</div>
                <div className="text-sm text-gray-500">{getTopSellingProduct().sales} đơn</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Doanh thu theo ngày</h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {getSalesChartData().map((data, index) => {
                const maxAmount = Math.max(...salesData.map(d => d.amount));
                const height = (data.amount / maxAmount) * 200;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                      style={{ height: `${height}px` }}
                      title={`${data.date}: ${formatCurrency(data.amount)}`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                      {data.date}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              Doanh thu trung bình: {formatCurrency(getTotalRevenue() / salesData.length)}/ngày
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Số đơn hàng theo ngày</h3>
            <div className="h-64 flex items-end justify-between space-x-1">
              {getOrdersChartData().map((data, index) => {
                const maxCount = Math.max(...ordersData.map(d => d.count));
                const height = (data.count / maxCount) * 200;
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="bg-green-500 rounded-t w-full transition-all duration-300 hover:bg-green-600"
                      style={{ height: `${height}px` }}
                      title={`${data.date}: ${data.count} đơn hàng`}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-left">
                      {data.date}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 text-sm text-gray-500 text-center">
              Đơn hàng trung bình: {(getTotalOrders() / ordersData.length).toFixed(1)}/ngày
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Xếp hạng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số lượng bán</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tỷ lệ</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {productsData.map((product, index) => {
                  const totalSales = productsData.reduce((sum, p) => sum + p.sales, 0);
                  const percentage = ((product.sales / totalSales) * 100).toFixed(1);
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {index + 1}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{product.sales}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">{percentage}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
            <div className="text-sm font-medium opacity-90">Tăng trưởng doanh thu</div>
            <div className="text-2xl font-semibold">+12.5%</div>
            <div className="text-sm opacity-75">So với tháng trước</div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
            <div className="text-sm font-medium opacity-90">Tăng trưởng đơn hàng</div>
            <div className="text-2xl font-semibold">+8.3%</div>
            <div className="text-sm opacity-75">So với tháng trước</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
            <div className="text-sm font-medium opacity-90">Khách hàng mới</div>
            <div className="text-2xl font-semibold">+25</div>
            <div className="text-sm opacity-75">Trong 30 ngày qua</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';

const AdminOrders = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data cho demo
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ORD001',
        customerName: 'Nguyễn Văn A',
        customerEmail: 'nguyenvana@email.com',
        customerPhone: '0123456789',
        orderDate: '2024-01-15',
        status: 'pending',
        totalAmount: 15000000,
        items: [
          { name: 'iPhone 15 Pro', quantity: 1, price: 15000000 },
          { name: 'AirPods Pro', quantity: 1, price: 5000000 }
        ],
        shippingAddress: '123 Đường ABC, Quận 1, TP.HCM',
        notes: 'Giao hàng vào buổi chiều'
      },
      {
        id: 'ORD002',
        customerName: 'Trần Thị B',
        customerEmail: 'tranthib@email.com',
        customerPhone: '0987654321',
        orderDate: '2024-01-14',
        status: 'processing',
        totalAmount: 12000000,
        items: [
          { name: 'Samsung Galaxy S24', quantity: 1, price: 12000000 }
        ],
        shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM',
        notes: ''
      },
      {
        id: 'ORD003',
        customerName: 'Lê Văn C',
        customerEmail: 'levanc@email.com',
        customerPhone: '0369852147',
        orderDate: '2024-01-13',
        status: 'shipped',
        totalAmount: 8000000,
        items: [
          { name: 'iPad Air', quantity: 1, price: 8000000 }
        ],
        shippingAddress: '789 Đường DEF, Quận 3, TP.HCM',
        notes: 'Đã giao thành công'
      },
      {
        id: 'ORD004',
        customerName: 'Phạm Thị D',
        customerEmail: 'phamthid@email.com',
        customerPhone: '0741258963',
        orderDate: '2024-01-12',
        status: 'delivered',
        totalAmount: 25000000,
        items: [
          { name: 'MacBook Pro', quantity: 1, price: 25000000 }
        ],
        shippingAddress: '321 Đường GHI, Quận 4, TP.HCM',
        notes: 'Khách hàng hài lòng'
      },
      {
        id: 'ORD005',
        customerName: 'Hoàng Văn E',
        customerEmail: 'hoangvane@email.com',
        customerPhone: '0852369741',
        orderDate: '2024-01-11',
        status: 'cancelled',
        totalAmount: 6000000,
        items: [
          { name: 'Apple Watch', quantity: 1, price: 6000000 }
        ],
        shippingAddress: '654 Đường JKL, Quận 5, TP.HCM',
        notes: 'Khách hàng hủy đơn'
      }
    ];

    // Load từ localStorage nếu có, không thì dùng mock data
    const savedOrders = localStorage.getItem('adminOrders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
        setOrders(mockOrders);
      }
    } else {
      setOrders(mockOrders);
      localStorage.setItem('adminOrders', JSON.stringify(mockOrders));
    }

    setLoading(false);
  }, []);

  const statusOptions = [
    { value: 'all', label: 'Tất cả', color: 'gray' },
    { value: 'pending', label: 'Chờ xử lý', color: 'yellow' },
    { value: 'processing', label: 'Đang xử lý', color: 'blue' },
    { value: 'shipped', label: 'Đã giao hàng', color: 'purple' },
    { value: 'delivered', label: 'Đã nhận hàng', color: 'green' },
    { value: 'cancelled', label: 'Đã hủy', color: 'red' }
  ];

  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('adminOrders', JSON.stringify(updatedOrders));
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'gray';
  };

  const getStatusLabel = (status) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return statusConfig ? statusConfig.label : status;
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
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
              <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Xin chào, {admin?.username}</span>
              <button onClick={logout} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm theo tên khách hàng, mã đơn hàng, email..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách đơn hàng ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.id}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-500">{order.customerEmail}</div>
                      <div className="text-sm text-gray-500">{order.customerPhone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.orderDate}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.map((item, index) => (
                          <div key={index} className="mb-1">
                            {item.name} x{item.quantity}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.totalAmount.toLocaleString('vi-VN')}₫
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(order.status)}-100 text-${getStatusColor(order.status)}-800`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          {statusOptions.filter(opt => opt.value !== 'all').map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => {
                            const orderDetails = `
Mã đơn hàng: ${order.id}
Khách hàng: ${order.customerName}
Email: ${order.customerEmail}
SĐT: ${order.customerPhone}
Địa chỉ: ${order.shippingAddress}
Ngày đặt: ${order.orderDate}
Trạng thái: ${getStatusLabel(order.status)}
Tổng tiền: ${order.totalAmount.toLocaleString('vi-VN')}₫

Sản phẩm:
${order.items.map(item => `- ${item.name} x${item.quantity} (${item.price.toLocaleString('vi-VN')}₫)`).join('\n')}

Ghi chú: ${order.notes || 'Không có'}
                            `;
                            alert(orderDetails);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Xem chi tiết
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">Không có đơn hàng nào</div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOptions.filter(opt => opt.value !== 'all').map(status => {
            const count = orders.filter(order => order.status === status.value).length;
            return (
              <div key={status.value} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full bg-${status.color}-500 mr-3`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{status.label}</div>
                    <div className="text-lg font-semibold text-gray-800">{count}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;

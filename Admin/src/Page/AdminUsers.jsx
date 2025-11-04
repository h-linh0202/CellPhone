import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';

const AdminUsers = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data cho demo
  useEffect(() => {
    const mockUsers = [
      {
        id: 1,
        username: 'nguyenvana',
        email: 'nguyenvana@email.com',
        fullName: 'Nguyễn Văn A',
        phone: '0123456789',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        joinDate: '2024-01-01',
        status: 'active',
        totalOrders: 5,
        totalSpent: 45000000,
        lastLogin: '2024-01-15 14:30:00'
      },
      {
        id: 2,
        username: 'tranthib',
        email: 'tranthib@email.com',
        fullName: 'Trần Thị B',
        phone: '0987654321',
        address: '456 Đường XYZ, Quận 2, TP.HCM',
        joinDate: '2024-01-05',
        status: 'active',
        totalOrders: 3,
        totalSpent: 25000000,
        lastLogin: '2024-01-14 09:15:00'
      },
      {
        id: 3,
        username: 'levanc',
        email: 'levanc@email.com',
        fullName: 'Lê Văn C',
        phone: '0369852147',
        address: '789 Đường DEF, Quận 3, TP.HCM',
        joinDate: '2024-01-10',
        status: 'suspended',
        totalOrders: 2,
        totalSpent: 15000000,
        lastLogin: '2024-01-12 16:45:00'
      },
      {
        id: 4,
        username: 'phamthid',
        email: 'phamthid@email.com',
        fullName: 'Phạm Thị D',
        phone: '0741258963',
        address: '321 Đường GHI, Quận 4, TP.HCM',
        joinDate: '2023-12-20',
        status: 'active',
        totalOrders: 8,
        totalSpent: 75000000,
        lastLogin: '2024-01-15 11:20:00'
      },
      {
        id: 5,
        username: 'hoangvane',
        email: 'hoangvane@email.com',
        fullName: 'Hoàng Văn E',
        phone: '0852369741',
        address: '654 Đường JKL, Quận 5, TP.HCM',
        joinDate: '2024-01-08',
        status: 'banned',
        totalOrders: 1,
        totalSpent: 5000000,
        lastLogin: '2024-01-10 13:30:00'
      },
      {
        id: 6,
        username: 'vuthif',
        email: 'vuthif@email.com',
        fullName: 'Vũ Thị F',
        phone: '0963258741',
        address: '987 Đường MNO, Quận 6, TP.HCM',
        joinDate: '2024-01-12',
        status: 'active',
        totalOrders: 0,
        totalSpent: 0,
        lastLogin: '2024-01-12 10:00:00'
      }
    ];

    // Load từ localStorage nếu có, không thì dùng mock data
    const savedUsers = localStorage.getItem('adminUsers');
    if (savedUsers) {
      try {
        setUsers(JSON.parse(savedUsers));
      } catch (error) {
        console.error('Error loading users:', error);
        setUsers(mockUsers);
      }
    } else {
      setUsers(mockUsers);
      localStorage.setItem('adminUsers', JSON.stringify(mockUsers));
    }

    setLoading(false);
  }, []);

  const statusOptions = [
    { value: 'all', label: 'Tất cả', color: 'gray' },
    { value: 'active', label: 'Hoạt động', color: 'green' },
    { value: 'suspended', label: 'Tạm khóa', color: 'yellow' },
    { value: 'banned', label: 'Cấm', color: 'red' }
  ];

  const updateUserStatus = (userId, newStatus) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
  };

  const filteredUsers = users.filter(user => {
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
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

  const handleToggleUserStatus = (user) => {
    let newStatus;
    let confirmMessage;
    
    switch (user.status) {
      case 'active':
        newStatus = 'suspended';
        confirmMessage = `Bạn có chắc muốn tạm khóa tài khoản của ${user.fullName}?`;
        break;
      case 'suspended':
        newStatus = 'active';
        confirmMessage = `Bạn có chắc muốn mở khóa tài khoản của ${user.fullName}?`;
        break;
      case 'banned':
        newStatus = 'active';
        confirmMessage = `Bạn có chắc muốn gỡ cấm tài khoản của ${user.fullName}?`;
        break;
      default:
        return;
    }

    if (confirm(confirmMessage)) {
      updateUserStatus(user.id, newStatus);
    }
  };

  const handleBanUser = (user) => {
    if (confirm(`Bạn có chắc muốn cấm tài khoản của ${user.fullName}? Hành động này không thể hoàn tác.`)) {
      updateUserStatus(user.id, 'banned');
    }
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
              <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
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
                placeholder="Tìm theo tên, username, email, số điện thoại..."
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

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">
              Danh sách khách hàng ({filteredUsers.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thông tin</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liên hệ</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tham gia</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thống kê</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                      <div className="text-sm text-gray-500">@{user.username}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.email}</div>
                      <div className="text-sm text-gray-500">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.joinDate}</div>
                      <div className="text-sm text-gray-500">Đăng nhập: {user.lastLogin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.totalOrders} đơn hàng</div>
                      <div className="text-sm text-gray-500">{user.totalSpent.toLocaleString('vi-VN')}₫</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-${getStatusColor(user.status)}-100 text-${getStatusColor(user.status)}-800`}>
                        {getStatusLabel(user.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => handleToggleUserStatus(user)}
                          className={`text-xs px-3 py-1 rounded ${
                            user.status === 'active' 
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {user.status === 'active' ? 'Tạm khóa' : 'Mở khóa'}
                        </button>
                        {user.status !== 'banned' && (
                          <button
                            onClick={() => handleBanUser(user)}
                            className="text-xs px-3 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                          >
                            Cấm tài khoản
                          </button>
                        )}
                        <button
                          onClick={() => {
                            const userDetails = `
Thông tin khách hàng:
- Họ tên: ${user.fullName}
- Username: ${user.username}
- Email: ${user.email}
- SĐT: ${user.phone}
- Địa chỉ: ${user.address}
- Ngày tham gia: ${user.joinDate}
- Đăng nhập cuối: ${user.lastLogin}
- Trạng thái: ${getStatusLabel(user.status)}

Thống kê:
- Tổng đơn hàng: ${user.totalOrders}
- Tổng chi tiêu: ${user.totalSpent.toLocaleString('vi-VN')}₫
                            `;
                            alert(userDetails);
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <div className="text-gray-500">Không có người dùng nào</div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statusOptions.filter(opt => opt.value !== 'all').map(status => {
            const count = users.filter(user => user.status === status.value).length;
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

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm font-medium text-gray-900">Tổng người dùng</div>
            <div className="text-2xl font-semibold text-gray-800">{users.length}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm font-medium text-gray-900">Tổng đơn hàng</div>
            <div className="text-2xl font-semibold text-gray-800">
              {users.reduce((sum, user) => sum + user.totalOrders, 0)}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm font-medium text-gray-900">Tổng doanh thu</div>
            <div className="text-2xl font-semibold text-gray-800">
              {users.reduce((sum, user) => sum + user.totalSpent, 0).toLocaleString('vi-VN')}₫
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;

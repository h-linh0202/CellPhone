// src/Page/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';
import ProductEditor from '../components/ProductEditor';
import { fetchProducts, getCategories, getProductsByCategory } from '../services/api';

const AdminProducts = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Editor
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorProduct, setEditorProduct] = useState(null);
  const [editorIndex, setEditorIndex] = useState(null);

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Kiểm tra localStorage
        const savedData = localStorage.getItem('adminProducts');
        if (savedData) {
          const parsed = JSON.parse(savedData);
          setData(parsed);
          const categoriesData = getCategories(parsed);
          setCategories(categoriesData);

          if (categoriesData.length > 0) {
            setSelectedCategory(categoriesData[0].name);
            setProducts(getProductsByCategory(parsed, categoriesData[0].name) || []);
          }
          setLoading(false);
          return;
        }

        // Nếu localStorage chưa có, gọi API
        const apiData = await fetchProducts();
        const merged = apiData;

        setData(merged);
        const categoriesData = getCategories(merged);
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].name);
          setProducts(getProductsByCategory(merged, categoriesData[0].name) || []);
        }

        // Lưu vào localStorage
        localStorage.setItem('adminProducts', JSON.stringify(merged));

      } catch (err) {
        console.error(err);
        setError(err.message || 'Lỗi không xác định');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Persist data
  const persistData = (newData) => {
    setData(newData);
    localStorage.setItem('adminProducts', JSON.stringify(newData));
  };

  // Category select
  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowAllProducts(false);
    const categoryProducts = getProductsByCategory(data, categoryName) || [];
    setProducts(categoryProducts);
  };

  // Show all products
  const getAllProducts = () => {
    if (!data || !data.phone) return [];
    const allProducts = [];
    Object.keys(data.phone).forEach(categoryName => {
      const categoryProducts = data.phone[categoryName];
      if (Array.isArray(categoryProducts)) {
        allProducts.push(...categoryProducts.map(p => ({ ...p, categoryName })));
      }
    });
    return allProducts;
  };

  const handleShowAllProducts = () => {
    setShowAllProducts(true);
    setSelectedCategory(null);
    setProducts(getAllProducts());
  };

  // Back to dashboard
  const handleBackToDashboard = () => navigate('/admin');

  // Open editor
  const handleOpenAdd = () => {
    setEditorIndex(null);
    setEditorProduct(null);
    setEditorOpen(true);
  };

  const handleOpenEdit = (index) => {
    setEditorIndex(index);
    setEditorProduct(products[index]);
    setEditorOpen(true);
  };

  // Delete product
  const handleDeleteProduct = (index) => {
    if (!selectedCategory) return;
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);

    const newData = { ...data, phone: { ...(data.phone || {}) } };
    newData.phone[selectedCategory] = updated;
    persistData(newData);
  };

  // Save from editor
  const handleSaveFromEditor = (payload) => {
    const newData = { ...data, phone: { ...(data.phone || {}) } };
    const list = [...(products || [])];

    if (editorIndex === null) {
      list.unshift(payload);
    } else {
      list[editorIndex] = payload;
    }

    newData.phone[selectedCategory] = list;
    setProducts(list);
    persistData(newData);
    setEditorOpen(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang tải dữ liệu...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-red-500 text-xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={handleBackToDashboard} className="text-blue-600 hover:text-blue-800 font-medium">
              ← Quay lại Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Xin chào, {admin?.username}</span>
            <button onClick={logout} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">Đăng xuất</button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <div className="flex gap-3 mb-4 flex-wrap">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => handleCategorySelect(cat.name)}
              className={`px-4 py-2 rounded ${
                selectedCategory === cat.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.name}
            </button>
          ))}
          <button
            onClick={handleShowAllProducts}
            className={`px-4 py-2 rounded ${
              showAllProducts
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📋 Tất cả sản phẩm ({getAllProducts().length})
          </button>
          <button onClick={handleOpenAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            ➕ Thêm sản phẩm
          </button>
        </div>

        {/* Product table */}
        <div className="overflow-x-auto bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hình ảnh</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên sản phẩm</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Danh mục</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <img className="h-16 w-16 object-cover rounded" src={p.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={p.name} />
                  </td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{p.name}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">
                    {p.special_price
                      ? p.special_price.toLocaleString('vi-VN') + '₫'
                      : p.old_price
                      ? p.old_price.toLocaleString('vi-VN') + '₫'
                      : 'Chưa có giá'}
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-500">{p.categoryName || selectedCategory}</td>
                  <td className="px-6 py-3 text-center flex justify-center gap-2">
                    <button onClick={() => handleOpenEdit(i)} className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">Sửa</button>
                    <button onClick={() => handleDeleteProduct(i)} className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductEditor
        open={editorOpen}
        product={editorProduct}
        onClose={() => setEditorOpen(false)}
        onSave={handleSaveFromEditor}
      />
    </div>
  );
};

export default AdminProducts;

// src/Page/AdminProducts.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext.jsx';
import CategoryList from '../components/CategoryList';
import CategoryProduct from '../components/CategoryProduct';
import ProductEditor from '../components/ProductEditor';
import { fetchProducts, getCategories, getProductsByCategory, testAPI } from '../services/api';
import { saveProductsToLocal } from '../services/productService';

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

  // product editor state
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorProduct, setEditorProduct] = useState(null);
  const [editorIndex, setEditorIndex] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null); // Reset error state
        console.log('🔄 AdminProducts: Bắt đầu load dữ liệu...');
        
        const apiData = await fetchProducts();
        console.log('📦 AdminProducts: Received API data:', apiData);
        
        // API trả về { phone: {...} } nên không cần merge với localProducts
        const merged = apiData;
        setData(merged);

        const categoriesData = getCategories(merged);
        console.log('📂 AdminProducts: Categories data:', categoriesData);
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].name);
          const firstCategoryProducts = getProductsByCategory(merged, categoriesData[0].name);
          console.log('📱 AdminProducts: First category products:', firstCategoryProducts);
          setProducts(firstCategoryProducts || []);
        } else {
          console.warn('⚠️ AdminProducts: Không có categories nào được tìm thấy');
          setProducts([]);
        }
        
        console.log('✅ AdminProducts: Load dữ liệu thành công');
      } catch (err) {
        const errorMessage = err.message || 'Lỗi không xác định';
        setError(errorMessage);
        console.error('❌ AdminProducts: Error loading data:', err);
        console.error('❌ AdminProducts: Error stack:', err.stack);
        
        // Set fallback data để UI không bị trống
        const fallbackData = {
          phone: {
            'Demo': [
              {
                id: 1,
                name: 'Sản phẩm demo',
                price: 1000000,
                image: 'https://via.placeholder.com/300x200?text=Demo+Product',
                description: 'Sản phẩm demo khi có lỗi API'
              }
            ]
          }
        };
        setData(fallbackData);
        setCategories([{ name: 'Demo', products: fallbackData.phone.Demo }]);
        setSelectedCategory('Demo');
        setProducts(fallbackData.phone.Demo);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Dependency array rỗng để chỉ chạy khi component mount

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setShowAllProducts(false);
    const categoryProducts = getProductsByCategory(data, categoryName) || [];
    setProducts(categoryProducts);
  };

  // Function để lấy tất cả sản phẩm từ tất cả danh mục
  const getAllProducts = () => {
    if (!data || !data.phone) return [];
    
    const allProducts = [];
    Object.keys(data.phone).forEach(categoryName => {
      const categoryProducts = data.phone[categoryName];
      if (Array.isArray(categoryProducts)) {
        // Thêm categoryName vào mỗi sản phẩm để biết thuộc danh mục nào
        const productsWithCategory = categoryProducts.map(product => ({
          ...product,
          categoryName: categoryName
        }));
        allProducts.push(...productsWithCategory);
      }
    });
    
    return allProducts;
  };

  const handleShowAllProducts = () => {
    setShowAllProducts(true);
    setSelectedCategory(null);
    setProducts(getAllProducts());
  };

  const handleBackToDashboard = () => {
    navigate('/admin');
  };

  // Helpers để cập nhật data & lưu local
  const persistData = (newData) => {
    setData(newData);
    saveProductsToLocal(newData);
  };

  // Add product (open editor empty)
  const handleOpenAdd = () => {
    setEditorIndex(null);
    setEditorProduct(null);
    setEditorOpen(true);
  };

  // Edit product at index
  const handleOpenEdit = (index) => {
    const p = products[index];
    setEditorIndex(index);
    setEditorProduct(p);
    setEditorOpen(true);
  };

  const handleDeleteProduct = (index) => {
    if (!selectedCategory) return;
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
    const updated = products.filter((_, i) => i !== index);
    setProducts(updated);

    const newData = { ...data, phone: { ...(data.phone || {}) } };
    newData.phone[selectedCategory] = updated;
    persistData(newData);
  };

  const handleSaveFromEditor = (payload) => {
    // If editorIndex === null -> add, else update
    const newData = { ...data, phone: { ...(data.phone || {}) } };
    const list = [...(products || [])];

    if (editorIndex === null) {
      // add to top
      list.unshift(payload);
    } else {
      list[editorIndex] = payload;
    }

    newData.phone[selectedCategory] = list;
    setProducts(list);
    persistData(newData);
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

  if (error) {
    return (
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
              <h1 className="text-2xl font-bold text-gray-800">Quản lý sản phẩm</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Xin chào, {admin?.username}</span>
              <button onClick={logout} className="px-3 py-1.5 bg-gray-200 rounded hover:bg-gray-300">Đăng xuất</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Categories */}
        <CategoryList
          categories={categories}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {/* Control buttons */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <button onClick={handleOpenAdd} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 mr-3">➕ Thêm sản phẩm</button>
            <button 
              onClick={handleShowAllProducts}
              className={`px-4 py-2 rounded mr-3 ${
                showAllProducts 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              📋 Tất cả sản phẩm ({getAllProducts().length})
            </button>
            <button onClick={async ()=>{
              // Test API endpoints
              console.log('🧪 Testing API endpoints...');
              const result = await testAPI();
              if (result.main) {
                alert('✅ Main API hoạt động tốt!');
              } else if (result.fallback) {
                alert('⚠️ Main API lỗi, nhưng Fallback API hoạt động');
              } else {
                alert('❌ Tất cả API đều lỗi!');
              }
            }} className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 mr-3">🧪 Test API</button>
            <button onClick={async ()=>{
              // Force refresh từ API
              console.log('🔄 Force refresh API...');
              setLoading(true);
              setError(null);
              try {
                const apiData = await fetchProducts();
                setData(apiData);
                saveProductsToLocal(apiData);
                const cats = getCategories(apiData);
                setCategories(cats);
                if(cats.length>0){
                  setSelectedCategory(cats[0].name);
                  setProducts(getProductsByCategory(apiData, cats[0].name) || []);
                }
                console.log('✅ Force refresh thành công');
              } catch (err) {
                setError(err.message || 'Lỗi refresh API');
                console.error('❌ Force refresh lỗi:', err);
              } finally {
                setLoading(false);
              }
            }} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-3">🔄 Refresh API</button>
            <button onClick={()=>{
              // reload from API (bỏ local)
              if(!confirm('Bạn sẽ load lại dữ liệu từ API gốc và ghi đè dữ liệu admin. Tiếp tục?')) return;
              (async ()=>{
                setLoading(true);
                const apiData = await fetchProducts();
                setData(apiData);
                saveProductsToLocal(apiData);
                const cats = getCategories(apiData);
                setCategories(cats);
                if(cats.length>0){
                  setSelectedCategory(cats[0].name);
                  setProducts(getProductsByCategory(apiData, cats[0].name) || []);
                }
                setLoading(false);
              })();
            }} className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">🔁 Load API gốc</button>
          </div>

          <div className="text-sm text-gray-500">
            Lưu: <strong>localStorage</strong> (dùng để demo). Admin chỉnh sửa sẽ ảnh hưởng HomePage/Client.
          </div>
        </div>

        {/* Products */}
        <CategoryProduct
          products={products}
          categoryName={showAllProducts ? 'Tất cả sản phẩm' : selectedCategory}
          showAllProducts={showAllProducts}
        />

        {/* Product list with edit/delete (small grid) */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3">Danh sách sản phẩm (chỉnh sửa nhanh)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <div key={i} className="bg-white border rounded shadow-sm p-3">
                <img src={p.image || 'https://via.placeholder.com/300x200?text=No+Image'} alt={p.name} className="w-full h-36 object-cover rounded mb-2"/>
                <div className="text-sm font-semibold">{p.name}</div>
                {showAllProducts && p.categoryName && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                    {p.categoryName}
                  </div>
                )}
                <div className="text-xs text-gray-500">{p.price ? p.price.toLocaleString('vi-VN') + '₫' : 'Chưa có giá'}</div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleOpenEdit(i)} className="flex-1 px-2 py-1 rounded border hover:bg-gray-100">Sửa</button>
                  <button onClick={() => handleDeleteProduct(i)} className="flex-1 px-2 py-1 rounded border text-red-600 hover:bg-red-50">Xóa</button>
                </div>
              </div>
            ))}
          </div>
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

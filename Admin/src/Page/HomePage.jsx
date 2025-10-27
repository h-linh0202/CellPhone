import React, { useState, useEffect } from 'react';
import CategoryList from '../components/CategoryList';
import CategoryProduct from '../components/CategoryProduct';
import { fetchProducts, getCategories, getProductsByCategory } from '../services/api';

const HomePage = () => {
  const [data, setData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const apiData = await fetchProducts();
        setData(apiData);
        
        const categoriesData = getCategories(apiData);
        setCategories(categoriesData);
        
        // Tự động chọn danh mục đầu tiên
        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].name);
          const firstCategoryProducts = getProductsByCategory(apiData, categoriesData[0].name);
          setProducts(firstCategoryProducts);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    const categoryProducts = getProductsByCategory(data, categoryName);
    setProducts(categoryProducts);
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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Cửa hàng điện thoại</h1>
          <p className="text-gray-600">Khám phá các sản phẩm điện thoại mới nhất</p>
        </div>

        {/* Categories */}
        <CategoryList 
          categories={categories}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {/* Products */}
        <CategoryProduct 
          products={products}
          categoryName={selectedCategory}
        />
      </div>
    </div>
  );
};

export default HomePage;

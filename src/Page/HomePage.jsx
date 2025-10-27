// src/Page/HomePage.jsx
import React, { useState, useEffect } from 'react';
import CategoryList from '../components/CategoryList';
import CategoryProduct from '../components/CategoryProduct';
import { fetchProducts, getCategories, getProductsByCategory } from '../services/api';
import { mergeProductsData } from '../services/productService';

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
        setError(null); // Reset error state
        console.log('🔄 HomePage: Bắt đầu load dữ liệu...');
        
        const apiData = await fetchProducts();
        const localData = JSON.parse(localStorage.getItem('localProducts') || 'null');
        const mergedData = localData ? mergeProductsData(apiData, localData) : apiData; // ưu tiên data admin đã chỉnh (localStorage)
        setData(mergedData);

        const categoriesData = getCategories(mergedData);
        setCategories(categoriesData);

        if (categoriesData.length > 0) {
          setSelectedCategory(categoriesData[0].name);
          const firstCategoryProducts = getProductsByCategory(mergedData, categoriesData[0].name);
          setProducts(firstCategoryProducts);
        }
        
        console.log('✅ HomePage: Load dữ liệu thành công');
      } catch (err) {
        setError(err.message || 'Lỗi không xác định');
        console.error('❌ HomePage: Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []); // Dependency array rỗng để chỉ chạy khi component mount

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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Cửa hàng điện thoại</h1>
          <p className="text-gray-600">Khám phá các sản phẩm điện thoại mới nhất</p>
        </div>

        <CategoryList
          categories={categories}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        <CategoryProduct
          products={products}
          categoryName={selectedCategory}
        />
      </div>
    </div>
  );
};

export default HomePage;

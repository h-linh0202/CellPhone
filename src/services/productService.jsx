// src/services/productService.js

// Giả lập API từ bên ngoài (ví dụ dữ liệu sản phẩm)
const API_URL = 'https://fakestoreapi.com/products'; // hoặc API thật của bạn

// 🟢 Lấy sản phẩm từ API ngoài
export const getProductsFromAPI = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Không thể lấy dữ liệu từ API');
    const data = await response.json();

    // Đảm bảo luôn là mảng
    if (Array.isArray(data)) {
      return data;
    } else if (data && data.products && Array.isArray(data.products)) {
      return data.products; // nếu API trả về { products: [...] }
    } else {
      console.warn('API trả về dữ liệu không phải mảng:', data);
      return [];
    }
  } catch (error) {
    console.error('Lỗi khi lấy sản phẩm:', error);
    return [];
  }
};


// 🟢 Lưu danh sách sản phẩm vào localStorage
export const saveProductsToLocal = (products) => {
  try {
    localStorage.setItem('localProducts', JSON.stringify(products));
  } catch (error) {
    console.error('Lỗi khi lưu localStorage:', error);
  }
};

// 🟢 Lấy danh sách sản phẩm từ localStorage
export const getProductsFromLocal = () => {
  try {
    const data = localStorage.getItem('localProducts');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Lỗi khi đọc localStorage:', error);
    return [];
  }
};

// 🟢 Hợp nhất dữ liệu API và dữ liệu local (ưu tiên local)
export const mergeProductsData = (apiProducts, localProducts) => {
  // Nếu apiProducts không phải là mảng, trả về apiProducts gốc
  if (!Array.isArray(apiProducts)) {
    console.warn('apiProducts không phải là mảng:', apiProducts);
    return apiProducts;
  }

  // Nếu localProducts không phải là mảng, trả về apiProducts
  if (!Array.isArray(localProducts)) {
    console.warn('localProducts không phải là mảng:', localProducts);
    return apiProducts;
  }

  const merged = [...apiProducts];

  localProducts.forEach((localProduct) => {
    const index = merged.findIndex((p) => p.id === localProduct.id);
    if (index !== -1) {
      merged[index] = localProduct; // cập nhật nếu trùng id
    } else {
      merged.push(localProduct); // thêm mới nếu chưa có
    }
  });

  return merged;
};

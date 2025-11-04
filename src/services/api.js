// src/services/api.js

const API_URL = 'https://api.apify.com/v2/key-value-stores/Dk3WYwoH9GqWLc6Cm/records/LATEST';

/**
 * Fetch với timeout
 * @param {string} url 
 * @param {object} options 
 * @param {number} timeout 
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), timeout);
    fetch(url, options)
      .then(res => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch(err => {
        clearTimeout(timer);
        reject(err);
      });
  });
};

/**
 * Fetch products từ API + cache + retry
 * @returns {Promise<Object>}
 */
export const fetchProducts = async () => {
  // 1. Check localStorage cache trước
  const cached = localStorage.getItem('products');
  if (cached) return JSON.parse(cached);

  // 2. Nếu chưa có cache, gọi API với retry
  const retries = 3;
  const delay = 2000; // 2s
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetchWithTimeout(API_URL, {}, 10000);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      // Lưu cache
      localStorage.setItem('products', JSON.stringify(data));
      return data;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`Fetch products failed, retrying in ${delay}ms... (${i + 1})`);
      await new Promise(r => setTimeout(r, delay));
    }
  }
};

/**
 * Lấy danh sách categories từ data API
 * @param {Object} data 
 * @returns {Array<{name: string, products: Array}>}
 */
export const getCategories = (data) => {
  if (!data || !data.phone) return [];
  return Object.keys(data.phone).map(key => ({
    name: key,
    products: data.phone[key] || []
  }));
};

/**
 * Lọc products theo category
 * @param {Object} data 
 * @param {string} categoryName 
 * @returns {Array}
 */
export const getProductsByCategory = (data, categoryName) => {
  if (!data || !data.phone || !categoryName) return [];
  return data.phone[categoryName] || [];
};

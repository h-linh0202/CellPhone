const API_BASE_URL = 'https://api.apify.com/v2/key-value-stores/Dk3WYwoH9GqWLc6Cm/records/LATEST';
const FALLBACK_API_URL = 'https://fakestoreapi.com/products';

export const fetchProducts = async () => {
  try {
    // Thêm cache busting để đảm bảo luôn gọi API mới
    const timestamp = Date.now();
    const urlWithCacheBust = `${API_BASE_URL}?t=${timestamp}`;
    
    console.log('🔄 Đang gọi API sản phẩm...', urlWithCacheBust);
    console.log('📡 Request headers:', {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    });
    
    const response = await fetch(urlWithCacheBust, {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      mode: 'cors' // Explicitly set CORS mode
    });
    
    console.log('📊 Response status:', response.status, response.statusText);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Response error text:', errorText);
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}. Details: ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ API sản phẩm đã load thành công');
    console.log('📦 Data structure:', {
      hasPhone: !!data.phone,
      phoneKeys: data.phone ? Object.keys(data.phone) : [],
      dataKeys: Object.keys(data)
    });
    return data;
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    // Thêm fallback data để app không crash
    console.log('🔄 Using fallback data...');
    return {
      phone: {
        'iPhone': [
          {
            id: 1,
            name: 'iPhone 15 Pro',
            price: 29990000,
            image: 'https://via.placeholder.com/300x200?text=iPhone+15+Pro',
            description: 'Sản phẩm demo'
          }
        ],
        'Samsung': [
          {
            id: 2,
            name: 'Samsung Galaxy S24',
            price: 24990000,
            image: 'https://via.placeholder.com/300x200?text=Galaxy+S24',
            description: 'Sản phẩm demo'
          }
        ]
      }
    };
  }
};

export const getCategories = (data) => {
  if (!data || !data.phone) return [];
  
  const categories = [];
  Object.keys(data.phone).forEach(category => {
    if (Array.isArray(data.phone[category])) {
      categories.push({
        name: category,
        products: data.phone[category]
      });
    }
  });
  
  return categories;
};

export const getProductsByCategory = (data, categoryName) => {
  if (!data || !data.phone || !data.phone[categoryName]) return [];
  return data.phone[categoryName];
};

// Test function để kiểm tra API có hoạt động không
export const testAPI = async () => {
  console.log('🧪 Testing API endpoints...');
  
  // Test main API
  try {
    console.log('🔍 Testing main API:', API_BASE_URL);
    const response = await fetch(API_BASE_URL);
    console.log('📊 Main API status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Main API works! Data keys:', Object.keys(data));
      return { main: true, data };
    }
  } catch (error) {
    console.error('❌ Main API failed:', error.message);
  }
  
  // Test fallback API
  try {
    console.log('🔍 Testing fallback API:', FALLBACK_API_URL);
    const response = await fetch(FALLBACK_API_URL);
    console.log('📊 Fallback API status:', response.status);
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Fallback API works! Products count:', data.length);
      return { fallback: true, data };
    }
  } catch (error) {
    console.error('❌ Fallback API failed:', error.message);
  }
  
  console.log('❌ All APIs failed');
  return { main: false, fallback: false };
};

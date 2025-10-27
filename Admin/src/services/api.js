const API_BASE_URL = 'https://api.apify.com/v2/key-value-stores/Dk3WYwoH9GqWLc6Cm/records/LATEST';

export const fetchProducts = async () => {
  try {
    const response = await fetch(API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
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

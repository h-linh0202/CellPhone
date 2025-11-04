import React, { useState } from 'react';

// 🧱 Định nghĩa cấu trúc dữ liệu cho 1 sản phẩm
interface Product {
  name: string;
  image: string;
  price?: number;
  special_price?: number;
  old_price?: number;
  tskt?: { name: string; value: string }[];
  capacities?: {
    capacity: string;
    price: number;
    color?: { color: string; price: number }[];
  }[];
}

// 🧩 Định nghĩa props cho component hiển thị sản phẩm theo danh mục
interface CategoryProductProps {
  products: Product[];
  categoryName: string | null;
  loading?: boolean;
  showAllProducts?: boolean;
}

// 🔧 Định nghĩa các tùy chọn sắp xếp
type SortOption = 'name' | 'price' | 'special_price';
type SortOrder = 'asc' | 'desc';

// 💡 Component hiển thị danh sách sản phẩm trong danh mục
const CategoryProduct: React.FC<CategoryProductProps> = ({ 
  products, 
  categoryName, 
  loading = false,
  showAllProducts = false
}) => {
  // State cho sắp xếp và lọc
  const [sortBy] = useState<SortOption>('name');
  const [sortOrder] = useState<SortOrder>('asc');
  const [searchTerm] = useState('');

  // 🔍 Hàm sắp xếp sản phẩm
  const sortProducts = (products: Product[]) => {
    return [...products].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.special_price || a.price || 0;
          bValue = b.special_price || b.price || 0;
          break;
        case 'special_price':
          aValue = a.special_price || 0;
          bValue = b.special_price || 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  // 🔍 Hàm lọc sản phẩm theo tên
  const filterProducts = (products: Product[]) => {
    if (!searchTerm) return products;
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  // Xử lý sản phẩm đã được sắp xếp và lọc
  const processedProducts = sortProducts(filterProducts(products));

  // Hiển thị loading
  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-5 gap-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Nếu không có sản phẩm thì hiển thị thông báo
  if (!products?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Không có sản phẩm nào trong danh mục này.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Tiêu đề danh mục */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Sản phẩms  {categoryName ? `- ${categoryName.replace(/([A-Z])/g, ' $1').trim()}` : ''}
      </h2>

      {/* Lưới hiển thị sản phẩm */}
       <div className="grid grid-cols-5 gap-4">
        {processedProducts.map((product, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-200 cursor-pointer"
          >
            <div className="p-3">
              {/* Ảnh sản phẩm */}
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-32 object-cover rounded-lg mb-3"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://via.placeholder.com/300x200?text=No+Image';
                }}
              />

              {/* Thông tin sản phẩm */}
              <h3 className="text-sm font-semibold text-gray-800 line-clamp-2">{product.name}</h3>
              
              {/* Hiển thị danh mục nếu đang xem tất cả sản phẩm */}
              {showAllProducts && (product as any).categoryName && (
                <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                  {(product as any).categoryName}
                </div>
              )}

              {/* Giá sản phẩm */}
              <div className="flex flex-col space-y-1 mt-1">
                {product.special_price && (
                  <span className="text-sm font-bold text-red-600">
                    {product.special_price.toLocaleString('vi-VN')}₫
                  </span>
                )}
                {product.old_price && (
                  <span className="text-xs text-gray-500 line-through">
                    {product.old_price.toLocaleString('vi-VN')}₫
                  </span>
                )}
                {product.price && (
                  <span className="text-sm font-bold text-blue-600">
                    {product.price.toLocaleString('vi-VN')}₫
                  </span>
                )}
              </div>

              {/* Thông số kỹ thuật (hiển thị rút gọn) */}
              {product.tskt?.length ? (
                <div className="text-xs text-gray-500 mt-1">{product.tskt.length} thông số</div>
              ) : null}

              {/* Phiên bản (dung lượng / màu sắc) */}
              {product.capacities?.length ? (
                <div className="text-xs text-gray-500">{product.capacities.length} phiên bản</div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default CategoryProduct;

import React from 'react';

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
}

// 💡 Component hiển thị danh sách sản phẩm trong danh mục
const CategoryProduct: React.FC<CategoryProductProps> = ({ products, categoryName }) => {
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
        Sản phẩm {categoryName ? `- ${categoryName.replace(/([A-Z])/g, ' $1').trim()}` : ''}
      </h2>

      {/* Lưới hiển thị sản phẩm */}
      <div className="grid grid-cols-5 gap-4">
        {products.map((product, index) => (
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

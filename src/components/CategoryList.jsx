import React from 'react';

const CategoryList = ({ categories, onCategorySelect, selectedCategory }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Danh mục sản phẩm</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <button
            key={index}
            onClick={() => onCategorySelect(category.name)}
            className={`p-1 rounded-lg border-2 transition-all duration-200 hover:shadow-md ${
              selectedCategory === category.name
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-blue-300 text-gray-700'
            }`}
          >
            <div className="text-center">
              <div className="text-lg font-semibold capitalize">
                {category.name.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {category.products.length} sản phẩm
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryList;

# Hướng dẫn sử dụng ứng dụng quản lý sản phẩm

## Tính năng chính

### 1. Trang đăng nhập (`/`)
- Đăng nhập với tài khoản: `admin` / mật khẩu: `admin123`
- Hoặc click "Xem sản phẩm (không cần đăng nhập)" để truy cập trang sản phẩm công khai

### 2. Trang sản phẩm công khai (`/home`)
- Hiển thị tất cả danh mục sản phẩm từ API
- Click vào danh mục để xem sản phẩm của danh mục đó
- Hiển thị thông tin chi tiết sản phẩm: hình ảnh, tên, giá, thông số kỹ thuật

### 3. Dashboard Admin (`/admin`)
- Chỉ dành cho người dùng đã đăng nhập
- Hiển thị thông tin tổng quan
- Click vào card "Sản phẩm" để quản lý sản phẩm

### 4. Trang quản lý sản phẩm Admin (`/admin/products`)
- Hiển thị tất cả danh mục và sản phẩm
- Giao diện tương tự trang công khai nhưng có thêm header admin
- Có nút "Quay lại Dashboard"

## API được sử dụng

- **Endpoint**: `https://api.apify.com/v2/key-value-stores/Dk3WYwoH9GqWLc6Cm/records/LATEST`
- **Dữ liệu**: Thông tin điện thoại từ các nhà cung cấp khác nhau
- **Cấu trúc**: 
  - `phone.apple`: Sản phẩm Apple
  - `phone.samsung`: Sản phẩm Samsung
  - Và các danh mục khác...

## Cách chạy ứng dụng

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy ứng dụng:
```bash
npm run dev
```

3. Truy cập: `http://localhost:5173`

## Cấu trúc dự án

```
src/
├── components/
│   ├── CategoryList.jsx      # Component hiển thị danh sách danh mục
│   ├── CategoryProduct.tsx  # Component hiển thị sản phẩm
│   └── ProtectedRoute.jsx    # Component bảo vệ route
├── Page/
│   ├── HomePage.jsx         # Trang sản phẩm công khai
│   ├── Login.jsx           # Trang đăng nhập
│   ├── AdminDashboard.jsx  # Dashboard admin
│   └── AdminProducts.jsx   # Trang quản lý sản phẩm admin
├── services/
│   └── api.js              # Service gọi API
└── utils/
    └── AuthContext.jsx     # Context xác thực
```

## Tính năng nổi bật

- ✅ Gọi API và hiển thị dữ liệu real-time
- ✅ Phân loại sản phẩm theo danh mục
- ✅ Giao diện responsive với Tailwind CSS
- ✅ Xác thực người dùng
- ✅ Bảo vệ route admin
- ✅ Loading states và error handling
- ✅ TypeScript support cho components

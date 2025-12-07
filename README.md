# 📚 Quản Lý Thư Viện - Frontend User Interface

Giao diện người dùng cho hệ thống quản lý thư viện - **Frontend Only**

## 🚀 Chạy Dự Án

```bash
npm install
npm start
```

Truy cập: **http://localhost:3000/user**

## 📁 Cấu Trúc Thư Mục

```
src/
├── components/
│   ├── UserProfile.js          # Component quản lý thư viện
│   ├── UserProfile.css         # Styling
│   └── StatusBadge.js          # Badge component
├── pages/
│   └── UserProfilePage.js      # Trang user
├── styles/
│   ├── UserProfilePage.css
│   └── StatusBadge.css
├── data/
│   └── sampleBooks.js          # Dữ liệu mẫu
├── App.js                       # Router
└── index.js
```

## ✨ Tính Năng

- ✅ Danh sách sách (Grid/List view)
- ✅ Tìm kiếm real-time
- ✅ Thêm sách mới
- ✅ Sửa thông tin sách
- ✅ Xóa sách
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Giao diện đẹp với gradient colors

## 🔗 Kết Nối API Backend

Khi backend hoàn thành, thay đổi phần fetch data trong `src/components/UserProfile.js`:

```javascript
// Line ~25-30: Thay localStorage bằng API call
useEffect(() => {
  // TODO: Thay thế URL backend của bạn
  fetch('YOUR_API_URL/api/books')
    .then(res => res.json())
    .then(data => {
      setBooks(data);
      setFilteredBooks(data);
    });
}, []);
```

## 📝 Các Phần Cần Thay Đổi Khi Có API

### 1. **handleSubmit** - Thêm/Sửa sách (Line ~80-120)
```javascript
// Thay localStorage.setItem() bằng API POST/PUT
const response = await fetch('YOUR_API_URL/api/books', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
const newBook = await response.json();
```

### 2. **handleDelete** - Xóa sách (Line ~140-150)
```javascript
// Thay localStorage.removeItem() bằng API DELETE
const response = await fetch('YOUR_API_URL/api/books/${id}', {
  method: 'DELETE'
});
```

## ⚠️ Lưu Ý Quan Trọng

1. **API Base URL**: Thay `YOUR_API_URL` bằng URL backend thực tế
2. **CORS**: Đảm bảo backend enable CORS
3. **Response Format**: API phải return object với fields: `id, title, author, category, publishYear, description, quantity, imageUrl`
4. **Error Handling**: Hiện chưa có error handling, có thể thêm sau
5. **Dữ liệu mẫu**: File `src/data/sampleBooks.js` là data test, xóa sau khi kết nối API

## 🎨 Tùy Chỉnh Màu Sắc

File: `src/components/UserProfile.css`

```css
/* Thay đổi gradient colors */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.x.x"
}
```

## 🐛 Troubleshooting

- **Module not found**: Chạy `npm install`
- **Port 3000 already in use**: Dùng `PORT=3001 npm start`
- **CORS error**: Kiểm tra backend CORS config

---

**Made with ❤️ - Frontend Only**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

# 🔌 Hướng Dẫn Kết Nối API Backend

## 📌 Các Phần Cần Thay Đổi

### 1️⃣ **Load Dữ Liệu Ban Đầu**

**File**: `src/components/UserProfile.js`  
**Line**: ~25-35

**Hiện tại (sử dụng localStorage)**:
```javascript
useEffect(() => {
  initializeSampleData();
  
  const savedBooks = localStorage.getItem("books");
  if (savedBooks) {
    const booksData = JSON.parse(savedBooks);
    setBooks(booksData);
    setFilteredBooks(booksData);
  }
}, []);
```

**Thay đổi thành (sử dụng API)**:
```javascript
useEffect(() => {
  // TODO: Thay YOUR_API_URL bằng URL backend thực tế
  // VD: http://localhost:5000/api hoặc https://api.example.com
  
  fetch('YOUR_API_URL/books')
    .then(res => res.json())
    .then(data => {
      setBooks(data);
      setFilteredBooks(data);
    })
    .catch(error => {
      console.error('Lỗi khi tải sách:', error);
      alert('Không thể tải danh sách sách!');
    });
}, []);
```

---

### 2️⃣ **Thêm Sách Mới**

**File**: `src/components/UserProfile.js`  
**Line**: ~80-120

**Hiện tại (localStorage)**:
```javascript
const handleSubmit = (e) => {
  e.preventDefault();

  if (editingBook) {
    const updatedBooks = books.map((book) =>
      book.id === editingBook.id ? { ...formData, id: book.id } : book
    );
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
    setEditingBook(null);
  } else {
    const newBook = {
      ...formData,
      id: Date.now(),
    };
    const updatedBooks = [...books, newBook];
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  }
  // ...reset form
};
```

**Thay đổi thành (API)**:
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingBook) {
      // TODO: Thay YOUR_API_URL/books/{id}
      const response = await fetch(`YOUR_API_URL/books/${editingBook.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedBook = await response.json();
        const updatedBooks = books.map(book =>
          book.id === editingBook.id ? updatedBook : book
        );
        setBooks(updatedBooks);
        setEditingBook(null);
      } else {
        alert('Lỗi cập nhật sách!');
      }
    } else {
      // TODO: Thay YOUR_API_URL/books
      const response = await fetch('YOUR_API_URL/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newBook = await response.json();
        setBooks([...books, newBook]);
      } else {
        alert('Lỗi thêm sách mới!');
      }
    }

    // Reset form
    setFormData({
      title: "",
      author: "",
      category: "",
      publishYear: "",
      description: "",
      quantity: "",
      imageUrl: "",
    });
    setShowForm(false);
  } catch (error) {
    console.error('Lỗi:', error);
    alert('Có lỗi xảy ra! Kiểm tra console.');
  }
};
```

---

### 3️⃣ **Xóa Sách**

**File**: `src/components/UserProfile.js`  
**Line**: ~155-165

**Hiện tại (localStorage)**:
```javascript
const handleDelete = (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
    const updatedBooks = books.filter((book) => book.id !== id);
    setBooks(updatedBooks);
    localStorage.setItem("books", JSON.stringify(updatedBooks));
  }
};
```

**Thay đổi thành (API)**:
```javascript
const handleDelete = async (id) => {
  if (window.confirm("Bạn có chắc chắn muốn xóa sách này?")) {
    try {
      // TODO: Thay YOUR_API_URL/books/{id}
      const response = await fetch(`YOUR_API_URL/books/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedBooks = books.filter((book) => book.id !== id);
        setBooks(updatedBooks);
      } else {
        alert('Không thể xóa sách!');
      }
    } catch (error) {
      console.error('Lỗi khi xóa:', error);
      alert('Lỗi khi xóa sách!');
    }
  }
};
```

---

## 🎯 Ví Dụ API URLs

### Nếu Backend chạy trên máy cục bộ:
```
YOUR_API_URL = http://localhost:5000/api
YOUR_API_URL = http://localhost:3001/api
```

### Nếu Backend chạy trên server:
```
YOUR_API_URL = https://api.example.com
YOUR_API_URL = https://your-domain.com/api
```

---

## 📊 Response Format Yêu Cầu

Backend phải return data theo format này:

### GET /books (lấy danh sách)
```json
[
  {
    "id": 1,
    "title": "Tên sách",
    "author": "Tác giả",
    "category": "Thể loại",
    "publishYear": 2023,
    "description": "Mô tả",
    "quantity": 5,
    "imageUrl": "http://..."
  }
]
```

### POST /books (thêm sách)
**Request**:
```json
{
  "title": "Tên sách",
  "author": "Tác giả",
  "category": "Thể loại",
  "publishYear": 2023,
  "description": "Mô tả",
  "quantity": 5,
  "imageUrl": "http://..."
}
```

**Response** (trả về sách vừa tạo với id):
```json
{
  "id": 123,
  "title": "Tên sách",
  ...
}
```

### PUT /books/{id} (sửa sách)
**Request**: Giống POST

**Response**: Object sách đã cập nhật

### DELETE /books/{id}
**Response**: 200 OK

---

## ⚙️ Cách Tạo Config File (Tùy Chọn)

Để dễ quản lý URL, tạo file `src/config/api.js`:

```javascript
// src/config/api.js
export const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API = {
  BOOKS: {
    LIST: `${API_BASE_URL}/books`,
    GET: (id) => `${API_BASE_URL}/books/${id}`,
    CREATE: `${API_BASE_URL}/books`,
    UPDATE: (id) => `${API_BASE_URL}/books/${id}`,
    DELETE: (id) => `${API_BASE_URL}/books/${id}`,
  }
};
```

Rồi sử dụng trong UserProfile.js:
```javascript
import { API } from '../config/api';

// Thay vì:
fetch('YOUR_API_URL/books')

// Dùng:
fetch(API.BOOKS.LIST)
```

---

## 📝 .env File (Tùy Chọn)

Tạo file `.env` tại root project:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

---

## ⚠️ Lưu Ý Quan Trọng

### 1. **CORS Configuration**
Backend phải enable CORS để frontend có thể kết nối:

```javascript
// Node.js/Express example
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
```

### 2. **Content-Type Header**
Luôn thêm:
```javascript
headers: {
  'Content-Type': 'application/json',
}
```

### 3. **Xóa Dữ Liệu Mẫu**
Khi kết nối API, xóa dòng:
```javascript
// Xóa dòng này
initializeSampleData();
```

### 4. **Error Handling**
Hiện code chỉ có `alert()`. Có thể cải thiện bằng:
- Toast notifications
- Modal error messages
- Console logging

### 5. **Loading States**
Có thể thêm loading spinner:
```javascript
const [loading, setLoading] = useState(false);

// Trong fetch
setLoading(true);
fetch(...)
  .finally(() => setLoading(false));
```

---

## 🧪 Testing API Bằng Postman

1. Mở Postman
2. **GET** `YOUR_API_URL/books` → Lấy danh sách
3. **POST** `YOUR_API_URL/books` → Thêm sách
4. **PUT** `YOUR_API_URL/books/1` → Sửa sách
5. **DELETE** `YOUR_API_URL/books/1` → Xóa sách

---

## 🔍 Debugging Tips

1. **Mở DevTools** (F12) → Console tab
2. **Xem Network tab** khi fetch API
3. **Kiểm tra response** từ server
4. **Kiểm tra error messages** trong console

---

**Khi hoàn tất, xóa hết comments `// TODO` ✅**

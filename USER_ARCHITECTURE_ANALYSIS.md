# 📚 Phân tích Kiến trúc /USER Module

## 🏗️ Cấu trúc Tổng quát

```
/user/
├── pagesUser/              # Pages (Trang chính)
├── components/layoutUser/  # UI Components (Thành phần tái sử dụng)
└── styles/User/            # CSS Styles (Định dạng)
```

---

## 📄 CHI TIẾT CÁC FILE

### **1. Pages (src/pagesUser/)**

#### **UserLayout.tsx** - Layout chứa đựng
- **Tác dụng:** Container chính cho tất cả trang /user, quản lý shared state
- **Chức năng chính:**
  - Render Sidebar một lần duy nhất
  - Quản lý state: `bookType` (Book/Ebook), `activePage` (home/history/settings/...)
  - Xử lý navigation qua `handleNavigate()`
  - Phát hiện thay đổi URL để cập nhật `activePage`
  - Cung cấp context cho child routes qua `<Outlet context={...} />`
- **Key Props:** Không nhận props từ parent
- **State Management:**
  - `bookType`: "Book" | "Ebook" (mặc định "Book")
  - `activePage`: "home" | "history" | "ebook-history" | "settings"
- **Hook:** `useUserGuard()` (bảo vệ route, redirect nếu chưa login)

---

#### **HomePage.tsx** - Trang chủ
- **Tác dụng:** Trang hiển thị danh sách sách và ebook
- **Chức năng chính:**
  - Lấy `bookType` từ UserLayout context
  - Sử dụng `useHomeLogic(bookType)` để quản lý logic search/filter
  - Render 4 sections:
    1. **Featured Section** - Sách nổi bật
    2. **Book Filters** - Nút chọn loại sách (Book/Ebook) + search Ebook
    3. **Advanced Search** - Tìm kiếm nâng cao (chỉ hiện khi không phải Ebook)
    4. **Book Grid** - Hiển thị danh sách sách dưới dạng grid
  - Quản lý modal: Ebook Viewer + Borrow Slip Form
- **Key Features:**
  - Adaptive UI: Advanced Search ẩn/hiện tùy theo bookType
  - Modal động: Click sách → mở Ebook Viewer (Ebook) hoặc Borrow Form (Book)

---

#### **ReadingHistoryPage.tsx** - Lịch sử mượn sách
- **Tác dụng:** Hiển thị danh sách sách đã mượn của user
- **Chức năng chính:**
  - Fetch dữ liệu từ API: `getBorrowSlipsByUserId()`
  - Transform dữ liệu phiếu mượn thành danh sách sách
  - Hiển thị dưới dạng bảng với cột:
    - Mã phiếu, Tên sách, Tác giả, Ngày đọc, Trạng thái, Hành động
  - Nút "Đọc tiếp" → điều hướng đến trang reader
- **Data Transform:** Flatten phiếu mượn có details thành danh sách phẳng
- **Error Handling:** Hiển thị error message nếu fetch thất bại

---

#### **EbookHistoryPage.tsx** - Lịch sử đọc Ebook
- **Tác dụng:** Hiển thị danh sách Ebook đã đọc với tiến độ
- **Chức năng chính:**
  - Fetch dữ liệu từ API: `getReadingHistoryByUserId()`
  - Hiển thị dưới dạng grid cards với:
    - Ảnh bìa sách
    - Tiêu đề, tác giả
    - Tiến độ đọc (progress bar + phần trăm)
    - Trang hiện tại / tổng số trang
    - Nút "Đọc tiếp"
  - Click card → mở trang reader
- **Progress Tracking:** Tính % tiến độ = currentPage / totalPages * 100

---

#### **SettingsPage.tsx** - Cài đặt
- **Tác dụng:** Trang tài khoản user
- **Chức năng chính:**
  - Hiển thị thông tin user (username, email, fullName)
  - Fetch từ localStorage (chưa có API riêng)
  - Nút **Đăng xuất** - clear localStorage + redirect `/login`
- **Security:** Disabled input fields (read-only)

---

#### **useHomeLogic.ts** - Custom Hook
- **Tác dụng:** Logic tập trung cho HomePage
- **Chức năng chính:**
  - Nhận `bookType` như parameter
  - Quản lý states:
    - Data: `allBooks`, `displayBooks`, `categories`, `tags`, `authors`
    - Selections: `selectedCategory`, `selectedTag`, `selectedAuthor`, `search`
    - Modal: `ebookModalOpen`, `borrowFormOpen`, `selectedBookId`, ...
  - **3 Effects chính:**
    1. **Fetch Autocomplete**: Load categories/tags/authors khi mount
    2. **Fetch Books**: Load books khi `bookType` thay đổi
    3. **Filter Logic**: useMemo để filter Ebook theo `ebookSearch`
  - **Handlers:**
    - `handleSmartSearch()`: Search theo author/category/title
    - `handleBookClick()`: Xử lý click sách → mở modal
    - `closeModals()`: Đóng tất cả modal
  - Return object với tất cả state và handlers
- **Optimization:** Dùng `useMemo` để tránh re-render không cần thiết

---

### **2. Components (src/components/layoutUser/)**

#### **sidebar.tsx** - Thanh điều hướng
- **Tác dụng:** Navigation menu cho /user
- **Chức năng chính:**
  - Render 4 nav items:
    - 🏠 Trang chủ
    - 📚 Lịch sử mượn sách
    - 📖 Lịch sử đọc Ebook
    - ⚙️ Cài đặt
  - Highlight active page
  - Mở rộng full width (250px) + hiển thị label
- **Props:**
  - `onNavigate`: callback khi click nav item
  - `activePage`: trang hiện tại để highlight

---

#### **featured-section.tsx** - Phần nổi bật
- **Tác dụng:** Hiển thị sách/Ebook nổi bật ở đầu trang
- **Chức năng:** Load từ API + render slides/cards

---

#### **book-card.tsx** - Card sách
- **Tác dụng:** Thành phần hiển thị thông tin 1 cuốn sách
- **Chức năng:** Render ảnh, tiêu đề, tác giả, rating, nút hành động

---

### **3. Styles (src/styles/User/)**

#### **globals.css** - CSS chung
- **Tác dụng:** Variables và reset CSS chung cho toàn /user
- **CSS Variables:**
  ```css
  --primary-orange: #fb923c    /* Màu cam chủ đạo */
  --text-dark: #111827         /* Chữ đen đậm */
  --text-gray: #9ca3af         /* Chữ xám */
  --shadow-*: ...              /* Các kiểu shadow */
  ```

---

#### **sidebar.css** - Style sidebar
- **Tác dụng:** Định dạng sidebar + nav items
- **Key Classes:**
  - `.user-sidebar` - Container sidebar (250px width)
  - `.user-sidebar-logo` - Logo btn (gradient cam)
  - `.user-nav-item` - Nav items
  - `.user-nav-item.active` - Active state (gradient cam + white text)

---

#### **home.css** - Style trang chủ
- **Tác dụng:** Layout HomePage
- **Key Classes:**
  - `.user-home-page` - Main container (flex layout)
  - `.user-main-content` - Content area (auto scroll)
  - `.user-books-grid` - Grid layout sách (auto-fill 400px)
  - `.user-section-title` - Tiêu đề section
  - `.user-pagination-*` - Phân trang

---

#### **book-card.css** - Style card sách
- **Tác dụng:** Giao diện book card
- **Features:** Hover effect, shadow, responsive

---

#### **featured-section.css** - Style featured
- **Tác dụng:** Định dạng phần nổi bật

---

#### **reader.css** - Style trang đọc
- **Tác dụng:** Giao diện Ebook reader

---

#### **genre-card.css** - Style card thể loại
- **Tác dụng:** Hiển thị thể loại sách

---

---

## 🔄 Data Flow Diagram

```
UserLayout (shared state: bookType, activePage)
    ↓
HomePage (use context + useHomeLogic)
    ├─ BookFilters (chọn loại sách)
    ├─ AdvancedSearch (search nâng cao - ẩn nếu Ebook)
    ├─ BookGrid (hiển thị sách)
    ├─ EbookViewerModal (nếu click Ebook)
    └─ CreateBorrowSlipForm (nếu click Book)

Sidebar (header) → handleNavigate() → router → ReadingHistoryPage/EbookHistoryPage/SettingsPage
```

---

## 🎯 Key Technologies & Patterns

| Technology | Tác dụng |
|-----------|---------|
| **React Hooks** | useState, useEffect, useMemo, useContext, useOutletContext |
| **React Router** | Navigation, nested routes, outlet context |
| **TypeScript** | Type safety cho components & data |
| **CSS Modules** | Style organization (globals, sidebar, home, reader) |
| **Custom Hooks** | useHomeLogic - logic tập trung, tái sử dụng |
| **Context API** | Truyền bookType/activePage từ UserLayout → HomePage |

---

## ✅ Điểm mạnh

✅ **Clear separation**: Pages vs Components vs Styles  
✅ **Reusable components**: BookCard, BookFilters, AdvancedSearch  
✅ **Centralized logic**: useHomeLogic hook  
✅ **Performance**: useMemo, lazy modal loading  
✅ **Accessible**: Proper semantic HTML, ARIA labels  
✅ **Responsive**: Grid layout, responsive sidebar  

---

## ⚠️ Cần cải thiện

- ❌ SettingsPage chưa có thực hiện update user info
- ❌ Reader page (Ebook viewer) chưa hoàn thiện
- ❌ Notification page chưa implement
- ❌ Search/Help page chưa implement
- ❌ Error boundary chưa có

---

## 📍 File Dependency Map

```
App.tsx
  └─ UserLayout.tsx
      ├─ Sidebar.tsx
      └─ <Outlet>
          ├─ HomePage.tsx
          │   ├─ useHomeLogic.ts
          │   ├─ BookFilters.tsx
          │   ├─ AdvancedSearch.tsx
          │   ├─ BookGrid.tsx
          │   │   └─ BookCard.tsx
          │   ├─ FeaturedSection.tsx
          │   ├─ EbookViewerModal.tsx
          │   └─ CreateBorrowSlipForm.tsx
          ├─ ReadingHistoryPage.tsx
          ├─ EbookHistoryPage.tsx
          └─ SettingsPage.tsx
```

---

## 🚀 Sử dụng

**Thêm trang mới:**
1. Tạo file page mới trong `/pagesUser`
2. Add route trong `App.tsx` dưới `<UserLayout>`
3. Add nav item trong `sidebar.tsx`
4. Add handler trong `UserLayout.tsx` handleNavigate()

**Thêm component tái sử dụng:**
1. Tạo file component trong `/components/layoutUser`
2. Import và sử dụng trong page hoặc component khác
3. Tạo CSS file riêng nếu cần

**Thêm API call:**
1. Add function mới trong `/api/apiService.ts`
2. Import và gọi trong page hoặc hook
3. Handle loading/error state

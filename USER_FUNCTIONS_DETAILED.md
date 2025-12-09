# 📚 CHỨC NĂNG CHI TIẾT CÁC FILE TRONG /USER

## 📂 Danh sách tất cả files

### **Pages (pagesUser/)**
1. ✅ `UserLayout.tsx`
2. ✅ `HomePage.tsx`
3. ✅ `AdvancedSearch.tsx`
4. ✅ `BookFilters.tsx`
5. ✅ `BookGrid.tsx`
6. ✅ `ReadingHistoryPage.tsx`
7. ✅ `EbookHistoryPage.tsx`
8. ✅ `SettingsPage.tsx`
9. ✅ `useHomeLogic.ts`

### **Components (components/layoutUser/)**
10. ✅ `sidebar.tsx`
11. ✅ `featured-section.tsx`
12. ✅ `book-card.tsx`

### **Styles (styles/User/)**
13. ✅ `globals.css`
14. ✅ `sidebar.css`
15. ✅ `home.css`
16. ✅ `book-card.css`
17. ✅ `featured-section.css`
18. ✅ `reader.css`
19. ✅ `genre-card.css`

---

## 🔍 CHI TIẾT TỪNG FILE

---

## 📄 PAGES (src/pagesUser/)

### **1. UserLayout.tsx**
**Vị trí:** `src/pagesUser/UserLayout.tsx`  
**Loại:** Layout component (Container)  
**Kích thước:** ~74 dòng

**Chức năng chính:**
- 🏠 **Container chính** cho tất cả trang /user routes
- 🔐 **Bảo vệ route** bằng `useUserGuard()` hook (redirect nếu chưa login)
- 🎛️ **Quản lý shared state:**
  - `bookType`: "Book" | "Ebook" (mặc định "Book")
  - `activePage`: "home" | "history" | "ebook-history" | "settings"
- 🧭 **Navigation handler** - xử lý tất cả navigation logic:
  - Click nav item → gọi `handleNavigate()` → cập nhật state + router
- 📍 **URL sync** - useEffect detect URL change → cập nhật activePage
- 📤 **Context provider** - cung cấp bookType/activePage cho child routes

**Key Points:**
```
Render:
  ├─ Sidebar (header) - static, render 1 lần
  └─ <Outlet /> - child pages
      ├─ HomePage
      ├─ ReadingHistoryPage
      ├─ EbookHistoryPage
      └─ SettingsPage
```

**Import/Export:**
```typescript
import { useUserGuard } from "../hooks/useUserGuard";
import { Sidebar } from "../components/layoutUser/sidebar";

export const UserLayout: React.FC
```

---

### **2. HomePage.tsx**
**Vị trí:** `src/pagesUser/HomePage.tsx`  
**Loại:** Page component  
**Kích thước:** ~104 dòng

**Chức năng chính:**
- 📖 **Trang chủ** - hiển thị danh sách sách/ebook
- 🎨 **4 sections chính:**
  1. **Featured Section** - sách nổi bật
  2. **Book Filters** - nút chọn Book/Ebook + search ebook
  3. **Advanced Search** - tìm kiếm nâng cao (chỉ hiện khi không phải Ebook)
  4. **Book Grid** - grid danh sách sách
- 🔄 **Quản lý data flow:**
  - Lấy `bookType` từ UserLayout context
  - Gọi `useHomeLogic(bookType)` để lấy all data/handlers
  - Pass props xuống child components
- 🪟 **Modal management:**
  - Render `EbookViewerModal` nếu `ebookModalOpen === true`
  - Render `CreateBorrowSlipForm` nếu `borrowFormOpen === true`

**Logic:**
```
HomePage
  ├─ Get bookType từ context
  ├─ Call useHomeLogic(bookType)
  ├─ Render BookFilters (chọn loại sách)
  ├─ Render AdvancedSearch (chỉ nếu bookType !== "Ebook")
  ├─ Render BookGrid (show books)
  └─ Render Modals (Ebook viewer / Borrow form)
```

---

### **3. AdvancedSearch.tsx**
**Vị trí:** `src/pagesUser/AdvancedSearch.tsx`  
**Loại:** Sub-component (dùng trong HomePage)  
**Kích thước:** ~105 dòng

**Chức năng chính:**
- 🔍 **Tìm kiếm nâng cao** cho sách
- 📝 **4 input fields:**
  1. Text input - nhập tên sách (có autocomplete datalist)
  2. Select Category - chọn thể loại
  3. Select Tag - chọn nhãn/tag
  4. Select Author - chọn tác giả
- 🔎 **Search button** - gọi `handleSmartSearch()` từ HomePage
- 🎯 **Smart search logic:**
  - Nếu chọn Author → search theo authorId
  - Nếu chọn Category → search theo category + tags
  - Nếu nhập text → search theo title
  - Nếu bỏ trống → load tất cả sách

**UI:**
```
┌─ Tìm kiếm nâng cao ─────────────────────┐
├─ [Text input] [Category select]        │
├─ [Tag select] [Author select]          │
└─ [Tìm kiếm button]                     │
```

---

### **4. BookFilters.tsx**
**Vị trí:** `src/pagesUser/BookFilters.tsx`  
**Loại:** Sub-component (dùng trong HomePage)  
**Kích thước:** ~51 dòng

**Chức năng chính:**
- 📚 **Bộ lọc loại sách** - chọn Book hoặc Ebook
- 🎛️ **2 buttons:** 
  - "📖 Sách giấy" → setBookType("Book")
  - "💻 Ebook" → setBookType("Ebook")
- 🔍 **Conditional Ebook search:**
  - Khi bookType === "Ebook" → hiển thị ô tìm kiếm Ebook riêng
  - Ô tìm kiếm này filter theo: tên sách, tác giả, mã sách, thể loại

**UI:**
```
┌─ Loại sách ─────────────────┐
├─ [📖 Sách giấy] [💻 Ebook] │
│                             │
│ Nếu Ebook được chọn:        │
├─ [🔍 Tìm kiếm Ebook]      │
├─ [Input search box]        │
```

---

### **5. BookGrid.tsx**
**Vị trí:** `src/pagesUser/BookGrid.tsx`  
**Loại:** Sub-component (dùng trong HomePage)  
**Kích thước:** ~53 dòng

**Chức năng chính:**
- 📊 **Hiển thị danh sách sách** dưới dạng grid
- 🎴 **Render BookCard** cho mỗi cuốn sách
- ⚠️ **Xử lý trạng thái:**
  - Loading state - hiển thị "Đang tải..."
  - Empty state - "Không có sách nào" (khác message tùy theo bookType)
- 📱 **Grid layout:** auto-fill 400px columns
- 🔄 **Data transform:**
  - Nếu Ebook → lấy cover từ book.imageUrl
  - Nếu Book → lấy cover từ book.imageUrl
  - Pass structured data đến BookCard

**Output:**
```
📚 Danh sách Sách giấy (24)
┌─────────────────────────────────────┐
│ [Card 1]  [Card 2]  [Card 3]        │
│ [Card 4]  [Card 5]  [Card 6]        │
│ ...                                 │
```

---

### **6. ReadingHistoryPage.tsx**
**Vị trí:** `src/pagesUser/ReadingHistoryPage.tsx`  
**Loại:** Page component  
**Kích thước:** ~137 dòng

**Chức năng chính:**
- 📜 **Lịch sử mượn sách** - hiển thị tất cả sách đã mượn
- 📡 **Fetch data:**
  - Gọi API: `getBorrowSlipsByUserId(userId)` 
  - Lấy userId từ localStorage
- 🔄 **Data transform:**
  - Flatten phiếu mượn (slip) có many-to-one với details
  - Mỗi detail = 1 sách → hiển thị riêng
  - Format date từ array [yyyy, mm, dd, ...] → "DD/MM/YYYY HH:MM:SS"
- 📋 **Render table với cột:**
  1. Mã phiếu (slipCode)
  2. Tên sách (title)
  3. Tác giả (authors)
  4. Ngày đọc (date)
  5. Trạng thái (status) - colored badge
  6. Hành động - nút "Đọc tiếp" → router `/user/reader/{bookId}`
- ⚠️ **Error handling:**
  - Catch errors khi fetch
  - Hiển thị error message
  - Empty state nếu không có lịch sử

**Table Format:**
```
┌─────────────────────────────────────────┐
│ Mã phiếu │ Tên sách │ Tác giả │ Ngày   │
├─────────────────────────────────────────┤
│ PN001    │ Harry    │ J.K...  │ ...    │
│ PN001    │ Twilight │ Stephenie│...    │
```

---

### **7. EbookHistoryPage.tsx**
**Vị trí:** `src/pagesUser/EbookHistoryPage.tsx`  
**Loại:** Page component  
**Kích thước:** ~150 dòng

**Chức năng chính:**
- 📖 **Lịch sử đọc Ebook** - hiển thị Ebook đã đọc + tiến độ
- 📡 **Fetch data:**
  - Gọi API: `getReadingHistoryByUserId(userId)`
  - Lấy reading progress từ history
- 🎴 **Render grid cards** với mỗi card hiển thị:
  1. Ảnh bìa sách
  2. Tiêu đề + tác giả
  3. **Progress bar** - visual hiện thị tiến độ
  4. "Trang X/Y" - số trang hiện tại / tổng
  5. **% tiến độ** - tính = currentPage / totalPages * 100
  6. "Đọc tiếp" button → router `/user/reader/{bookId}`
- 🎨 **Card design:**
  - Hover effect - scale up
  - Clean layout, easy to scan
  - Color progress bar (blue #007bff)

**Card Format:**
```
┌─── Ebook Card ───┐
│ [📖 Cover]      │
│ Harry Potter    │
│ J.K. Rowling    │
│ 🕒 05/12/2025   │
│ ███░░░░░░ 35%   │
│ Trang 120/350   │
│ [Đọc tiếp btn]  │
```

---

### **8. SettingsPage.tsx**
**Vị trí:** `src/pagesUser/SettingsPage.tsx`  
**Loại:** Page component  
**Kích thước:** ~93 dòng

**Chức năng chính:**
- ⚙️ **Trang cài đặt** - thông tin tài khoản
- 📋 **Display user info:**
  - Username (disabled)
  - Email (disabled)
  - Full name (disabled)
  - Dữ liệu từ localStorage
- 🚪 **Logout button:**
  - Clear localStorage (token, userId, username, email)
  - Redirect `/login`
  - Red button (#dc3545) with hover effect
- 💡 **Future features:**
  - Change password (TODO)
  - Update profile (TODO)
  - Privacy settings (TODO)

**UI:**
```
⚙️ Cài đặt
┌─────────────────────────────┐
│ Thông tin tài khoản         │
├─────────────────────────────┤
│ Tên đăng nhập: user1        │
│ Email: user@email.com       │
│ Họ tên: (chưa cập nhật)     │
│                             │
│ [🚪 Đăng xuất btn]         │
```

---

### **9. useHomeLogic.ts**
**Vị trí:** `src/pagesUser/useHomeLogic.ts`  
**Loại:** Custom Hook  
**Kích thước:** ~158 dòng

**Chức năng chính:**
- 🎯 **Custom hook** - logic tập trung cho HomePage
- 📥 **Input:** `bookType` (Book/Ebook)
- 📤 **Output:** object với tất cả states + handlers

**States:**
```typescript
// Autocomplete data
categories, tags, authors

// Filter selections
selectedCategory, selectedTag, selectedAuthor

// Search
search (text search), ebookSearch (ebook-specific)

// Data
allBooks, displayBooks, loading

// Modal
ebookModalOpen, borrowFormOpen, selectedBookId, selectedBookTitle, selectedEbookCover
```

**3 Main Effects:**
1. **Fetch Autocomplete** (mount):
   - Load categories, tags, authors cho dropdowns
   - Run once when component mounts

2. **Fetch Books** (khi bookType thay đổi):
   - `bookType === "Ebook"` → gọi `getAllEbooks()`
   - `bookType === "Book"` → gọi `getAllBooks()`
   - Load tất cả sách cùng loại

3. **Filter Logic** (useMemo):
   - Nếu Ebook + có ebookSearch text → filter books
   - Filter theo: title, bookCode, authorNames, categoryName
   - Return `displayBooks` ready for render

**Handlers:**
- `handleSmartSearch()`: 
  - Nếu selectedAuthor → search by author
  - Nếu selectedCategory → search by category + tags
  - Nếu search text → search by title
  - Else → load all books

- `handleBookClick(book, coverUrl)`:
  - Set `selectedBookId` + `selectedBookTitle`
  - Nếu book.isEbook === true → open EbookViewerModal
  - Else → open BorrowSlipForm

- `closeModals()`:
  - Close all modals + reset state

---

## 🧩 COMPONENTS (src/components/layoutUser/)

### **10. sidebar.tsx**
**Vị trí:** `src/components/layoutUser/sidebar.tsx`  
**Loại:** Presentational component  
**Kích thước:** ~52 dòng

**Chức năng chính:**
- 🧭 **Navigation sidebar** cho /user
- 📚 **Logo button** - click → go home
- 🔘 **4 nav items** (buttons):
  ```
  🏠 Trang chủ → page="home"
  📚 Lịch sử mượn sách → page="history"
  📖 Lịch sử đọc Ebook → page="ebook-history"
  ⚙️ Cài đặt → page="settings"
  ```
- ✨ **Active highlighting:**
  - Current page button được highlight (gradient cam)
  - Inactive button - gray background
- 📤 **Props:**
  - `onNavigate(page, id?)`: callback khi click nav item
  - `activePage`: current page để highlight

**Styling:**
```css
Width: 250px (mở rộng)
Gradient background: cam-orange
Nav item: 50px height, flex layout
Active: gradient cam + shadow
Hover: translateX(5px)
```

---

### **11. featured-section.tsx**
**Vị trí:** `src/components/layoutUser/featured-section.tsx`  
**Loại:** Presentational component  
**Kích thước:** ? (chưa check chi tiết)

**Chức năng chính:**
- ⭐ **Featured books section** - sách nổi bật
- 🎨 **Render:**
  - Slides/carousel hoặc grid featured books
  - Load từ API (special books)
- 📱 **Responsive** - adapt screen size

---

### **12. book-card.tsx**
**Vị trí:** `src/components/layoutUser/book-card.tsx`  
**Loại:** Presentational component  
**Kích thước:** ? (chưa check chi tiết)

**Chức năng chính:**
- 📚 **Single book card** - reusable component
- 🖼️ **Display:**
  - Ảnh bìa sách (imageUrl)
  - Tiêu đề (title)
  - Tác giả (authors)
  - Rating stars (⭐⭐⭐⭐⭐)
  - Price (giá)
  - Status badge (Sách giấy / Ebook)
- 🔘 **Button:**
  - "Mượn sách" (Book) → mở borrow form
  - "Đọc Ebook" (Ebook) → mở ebook viewer
  - "Xem tiếp" (History) → router to reader
- 🎨 **Hover effect** - scale, shadow

**Props:**
```typescript
interface BookCardProps {
  book: Book;
  onRead?: () => void;
  onBorrow?: () => void;
}
```

---

## 🎨 STYLES (src/styles/User/)

### **13. globals.css**
**Vị trí:** `src/styles/User/globals.css`  
**Tác dụng:** CSS variables + reset chung

**Content:**
```css
:root {
  --primary-orange: #fb923c
  --primary-orange-hover: #f97316
  --bg-app: #f3f4f6
  --card-white: #ffffff
  --text-dark: #111827
  --text-gray: #9ca3af
  --text-blue: #3b82f6
  --rating-gold: #fbbf24
  --radius: 16px
  --shadow-sm: ...
  --shadow-md: ...
  --shadow-book: ...
}

* { reset }
body { font-family, bg-color }
::-webkit-scrollbar { custom scrollbar }
```

---

### **14. sidebar.css**
**Vị trí:** `src/styles/User/sidebar.css`  
**Tác dụng:** Style sidebar component

**Classes:**
- `.user-sidebar` - main container (250px, flex, shadow)
- `.user-sidebar-logo` - logo button (50x50, gradient cam, hover scale)
- `.user-sidebar-nav` - nav container (flex column, gap 12px)
- `.user-nav-item` - nav button (100% width, 50px height, flex)
- `.user-nav-item .nav-icon` - icon span (20px font-size)
- `.user-nav-item .nav-label` - label span (15px, truncate)
- `.user-nav-item:hover` - orange bg + translateX
- `.user-nav-item.active` - gradient cam + white text + shadow

---

### **15. home.css**
**Vị trị:** `src/styles/User/home.css`  
**Tác dụng:** Style HomePage sections

**Classes:**
- `.user-home-page` - main container (flex, 100vw, 100vh, bg-app)
- `.user-main-content` - content area (flex column, scroll, padding, gap)
- `.user-section-title` - section heading (18px, bold, dark)
- `.user-books-grid` - grid layout (auto-fill 400px columns, gap 24px)
- `.user-section-header` - flex header with align
- `.user-search-box` - search input container
- `.user-pagination-*` - pagination buttons + info

---

### **16. book-card.css**
**Vị trị:** `src/styles/User/book-card.css`  
**Tác dụng:** Style BookCard component

**Classes:**
- `.book-card` - main card
- `.book-cover` - image container
- `.book-title` - title text
- `.book-author` - author text
- `.book-rating` - star rating
- `.book-price` - price text
- `.book-button` - action button
- Hover effects, shadows, responsive

---

### **17. featured-section.css**
**Vị trị:** `src/styles/User/featured-section.css`  
**Tác dụng:** Style featured section

---

### **18. reader.css**
**Vị trị:** `src/styles/User/reader.css`  
**Tác dụng:** Style Ebook reader page

**Content:**
- Ebook viewer layout
- Page controls
- Navigation
- Reading tools

---

### **19. genre-card.css**
**Vị trị:** `src/styles/User/genre-card.css`  
**Tác dụng:** Style genre/category cards

---

## 🔗 RELATIONSHIPS & DEPENDENCIES

```
App.tsx
│
└─ UserLayout.tsx (layout)
   ├─ Sidebar.tsx (component) ← sidebar.css
   │
   └─ <Outlet> (router outlet)
      │
      ├─ HomePage.tsx (page)
      │  ├─ useHomeLogic.ts (hook)
      │  ├─ BookFilters.tsx (sub-component)
      │  ├─ AdvancedSearch.tsx (sub-component)
      │  ├─ BookGrid.tsx (sub-component)
      │  │  └─ BookCard.tsx (component) ← book-card.css
      │  ├─ FeaturedSection.tsx (component) ← featured-section.css
      │  ├─ EbookViewerModal.tsx
      │  └─ CreateBorrowSlipForm.tsx
      │  └─ home.css
      │
      ├─ ReadingHistoryPage.tsx (page)
      │  ├─ API: getBorrowSlipsByUserId()
      │  └─ home.css (reuse)
      │
      ├─ EbookHistoryPage.tsx (page)
      │  ├─ API: getReadingHistoryByUserId()
      │  └─ home.css (reuse)
      │
      └─ SettingsPage.tsx (page)
         └─ home.css (reuse)

CSS shared:
├─ globals.css (variables, reset)
└─ home.css (layout classes)
```

---

## 📊 FILE COUNT SUMMARY

| Loại | Số lượng | File |
|------|---------|------|
| Pages | 5 | UserLayout, HomePage, ReadingHistoryPage, EbookHistoryPage, SettingsPage |
| Sub-components | 3 | AdvancedSearch, BookFilters, BookGrid |
| Components | 3 | Sidebar, FeaturedSection, BookCard |
| Hooks | 1 | useHomeLogic |
| CSS | 7 | globals, sidebar, home, book-card, featured-section, reader, genre-card |
| **TOTAL** | **19** | - |

---

## 🎯 DATA FLOW SUMMARY

```
User Action (click nav)
    ↓
Sidebar.tsx onNavigate(page)
    ↓
UserLayout.tsx handleNavigate(page)
    ↓
Update state: bookType, activePage
    ↓
Router navigate to /user/{page}
    ↓
Render corresponding page
    (HomePage / ReadingHistoryPage / EbookHistoryPage / SettingsPage)
    ↓
If HomePage:
  - useHomeLogic(bookType) fetch data
  - Pass state/handlers to sub-components
  - Render BookFilters, AdvancedSearch, BookGrid
  - Handle user interactions
  - Show modals (Ebook viewer / Borrow form)
```

---

## ✅ CHECKLIST - Hiểu rõ từng file

- [ ] UserLayout - routing container
- [ ] HomePage - main page with sections
- [ ] AdvancedSearch - search UI
- [ ] BookFilters - book type selector
- [ ] BookGrid - list display
- [ ] ReadingHistoryPage - borrow history
- [ ] EbookHistoryPage - ebook reading progress
- [ ] SettingsPage - user account
- [ ] useHomeLogic - business logic hook
- [ ] Sidebar - navigation
- [ ] FeaturedSection - featured books
- [ ] BookCard - single book display
- [ ] All CSS files - understand styling

---

## 🚀 QUICK REFERENCE

| Task | File |
|------|------|
| Thêm nav item | sidebar.tsx + UserLayout.tsx |
| Thêm search filter | AdvancedSearch.tsx + useHomeLogic.ts |
| Tùy chỉnh book card | BookCard.tsx + book-card.css |
| Thêm page mới | tạo file + add route + add nav |
| Fix layout | home.css + globals.css |
| Fix sidebar UI | sidebar.css + sidebar.tsx |
| Fix bookType logic | useHomeLogic.ts + BookFilters.tsx |


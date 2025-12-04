import { useFetchData } from './useFetchData';
// Giả sử file API Service của bạn tên là apiService.ts
import * as api from '../api/apiService'; 

// Định nghĩa Interface sơ lược (Nên lấy từ file BookApi hoặc Model)
export interface Book { id: number; title: string; availableQuantity: number; totalQuantity: number; isActive: boolean; category: { categoryName: string; }; authors: { authorName: string; }[]; bookCode?: string; }
export interface Author { id: number; authorName: string; biography: string; }
export interface Category { id: number; categoryName: string; description: string; }
export interface BorrowSlip { id: number; user: string; book: string; status: string; }
export interface User { id: number; name: string; email: string; role: string; }
export interface Tag { id: number; tagName: string; description: string; }



// 1. Hook dùng cho BOOKS (BookManagement)
export const useBookData = (shouldFetch: boolean = true) => {
  return useFetchData<Book[]>(
    shouldFetch ? api.getAllBooks : () => Promise.resolve([] as Book[]),
    [] as Book[],
    [shouldFetch]
  );
};

// 2. Hook dùng cho AUTHORS (BookManagement)
export const useAuthorData = (shouldFetch: boolean = true) => {
  return useFetchData<Author[]>(
    shouldFetch ? api.getAllAuthors : () => Promise.resolve([] as Author[]),
    [] as Author[],
    [shouldFetch]
  );
};

// 3. Hook dùng cho CATEGORIES (BookManagement)
export const useCategoryData = (shouldFetch: boolean = true) => {
  return useFetchData<Category[]>(
    shouldFetch ? api.getAllCategories : () => Promise.resolve([] as Category[]),
    [] as Category[],
    [shouldFetch]
  );
};

// 4. Hook dùng cho TAGS (BookManagement)
export const useTagData = (shouldFetch: boolean = true) => {
  return useFetchData<Tag[]>(
    shouldFetch ? api.getAllTags : () => Promise.resolve([] as Tag[]),
    [] as Tag[],
    [shouldFetch]
  );
};

// 5. Hook dùng cho BORROW SLIPS (CirculationManagement)
export const useBorrowSlipData = (shouldFetch: boolean = true) => {
  return useFetchData<BorrowSlip[]>(
    shouldFetch ? api.getAllBorrowSlips : () => Promise.resolve([] as BorrowSlip[]),
    [] as BorrowSlip[],
    [shouldFetch]
  );
};

// 6. Hook dùng cho USERS (UserManagement)
export const useUserData = (shouldFetch: boolean = true) => {
  return useFetchData<User[]>(
    shouldFetch ? api.getAllUsers : () => Promise.resolve([] as User[]),
    [] as User[],
    [shouldFetch]
  );
};

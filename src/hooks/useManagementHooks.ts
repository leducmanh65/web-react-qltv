import { useFetchData } from './useFetchData';
// Giả sử file API Service của bạn tên là apiService.ts
import * as api from '../api/apiService'; 

// Định nghĩa Interface sơ lược (Nên lấy từ file BookApi hoặc Model)
export interface Book { 
  id: number; 
  title: string; 
  bookCode?: string;          // Thêm ? nếu có thể null
  publishYear?: number;       // Thêm trường này
  price?: number;             // Thêm trường này
  isbn?: string;              // Thêm trường này
  description?: string;       // Thêm trường này
  totalQuantity: number; 
  availableQuantity: number; 
  isActive: boolean; 
  isEbook?: boolean;          // Thêm trường này
  ebookUrl?: string;          // Thêm trường này
  ebookContent?: string;      // Thêm trường này
  category?: { id: number; categoryName: string; }; 
  authors?: { id: number; authorName: string; }[]; 
  tags?: { id: number; tagName: string; }[]; // Thêm trường tags
}
export interface Author { id: number; authorName: string; biography: string; }
export interface Category { id: number; categoryName: string; description: string; }
export interface BorrowSlip { id: number; slipCode: string; reader: { id: number; username: string; }; details: { id: number; book: { id: number; title: string; }; borrowDate: number[]; dueDate: number[]; }[]; status: string; }
export interface User { id: number; userCode: string; username: string; email: string; phoneNumber: string; roles: string[]; status: string; bookQuota: number; birthDate?: number[] | string; }
export interface Tag { id: number; tagName: string; description: string; }



// 1. Hook dùng cho BOOKS (BookManagement)
export const useBookData = (shouldFetch: boolean = true) => {
  return useFetchData<Book[]>(
    shouldFetch ? api.getAllBooks : () => Promise.resolve([] as Book[]),
    [] as Book[],
    [shouldFetch]
  );
};

// Hook dùng cho EBOOKS (EbookManagement) - sử dụng API getAllEbooks
export const useEbookData = (shouldFetch: boolean = true) => {
  return useFetchData<Book[]>(
    shouldFetch ? api.getAllEbooks : () => Promise.resolve([] as Book[]),
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

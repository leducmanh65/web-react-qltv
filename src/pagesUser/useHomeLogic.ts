import { useState, useEffect, useMemo } from "react";
import { 
  getAllBooks, getAllEbooks, getAllCategories, getAllTags, 
  getAllAuthors, getBooksByAuthorId, searchBooksByTitle, 
  getBooksByCategoryAndTags 
} from "../api/apiService"; 
import type { Book } from "../components/layoutUser/book-card"; 

export const useHomeLogic = (bookType: string) => {
  // --- STATES ---
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

  const [search, setSearch] = useState<string>("");
  const [ebookSearch, setEbookSearch] = useState<string>("");
  
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal States
  const [ebookModalOpen, setEbookModalOpen] = useState(false);
  const [borrowFormOpen, setBorrowFormOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>("");
  const [selectedEbookCover, setSelectedEbookCover] = useState<string>("");

  // --- FETCH DATA (Autocomplete) ---
  useEffect(() => {
    const fetchAutocomplete = async () => {
      try {
        const [catRes, tagRes, authorRes] = await Promise.all([
          getAllCategories(),
          getAllTags(),
          getAllAuthors()
        ]);
        setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
        setTags(Array.isArray(tagRes) ? tagRes : tagRes?.data || []);
        setAuthors(Array.isArray(authorRes) ? authorRes : authorRes?.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu gợi ý:", err);
      }
    };
    fetchAutocomplete();
  }, []);

  // --- FETCH BOOKS (Main Data) ---
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        let response: any;
        if (bookType === "Ebook") {
          response = await getAllEbooks();
        } else {
          response = await getAllBooks();
        }
        const booksData = Array.isArray(response) ? response : response?.data || [];
        setAllBooks(booksData);
      } catch (error) {
        console.error("Failed to fetch books:", error);
        setAllBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [bookType]);

  // --- FILTER LOGIC ---
  const filteredEbooks = useMemo(() => {
    if (bookType !== "Ebook" || !ebookSearch.trim()) return allBooks;
    const searchLower = ebookSearch.toLowerCase();
    
    return allBooks.filter((ebook: any) => {
      const book = ebook.book || {};
      const title = (book.title ?? "").toLowerCase();
      const bookCode = (book.bookCode ?? "").toLowerCase();
      const authorNames = book.authors?.map((a: any) => a.authorName).join(" ").toLowerCase() || "";
      const categoryName = (book.category?.categoryName ?? "").toLowerCase();
      
      return title.includes(searchLower) || 
             bookCode.includes(searchLower) || 
             authorNames.includes(searchLower) || 
             categoryName.includes(searchLower);
    });
  }, [allBooks, ebookSearch, bookType]);

  const displayBooks = bookType === "Ebook" ? filteredEbooks : allBooks;

  // --- HANDLERS ---
  const handleSmartSearch = async () => {
    setLoading(true);
    try {
      let booksData = [];
      if (selectedAuthor) {
        const res = await getBooksByAuthorId(selectedAuthor.id);
        booksData = res?.data || res || [];
      } else if (selectedCategory) {
        const tagIds = selectedTag ? [selectedTag.id] : [];
        const res = await getBooksByCategoryAndTags(selectedCategory.id, tagIds);
        booksData = res?.data || res || [];
      } else if (search) {
        const res = await searchBooksByTitle(search);
        booksData = res?.data || res || [];
      } else {
        const res = await getAllBooks();
        booksData = res?.data || res || [];
      }
      setAllBooks(booksData);
    } catch (err) {
      console.error("Smart search error:", err);
      setAllBooks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookClick = (book: Book, coverUrl?: string) => {
    setSelectedBookId(book.id);
    setSelectedBookTitle(book.title);
    if (book.isEbook) {
      setSelectedEbookCover(coverUrl || book.imageUrl || "");
      setEbookModalOpen(true);
    } else {
      setBorrowFormOpen(true);
    }
  };

  // Reset Modal Handler
  const closeModals = () => {
    setEbookModalOpen(false);
    setBorrowFormOpen(false);
    setSelectedBookId(null);
    setSelectedEbookCover("");
    setSelectedBookTitle("");
  };

  return {
    // Data
    categories, tags, authors, allBooks, displayBooks, loading,
    // Selections
    selectedCategory, setSelectedCategory,
    selectedTag, setSelectedTag,
    selectedAuthor, setSelectedAuthor,
    // Search & Filters
    search, setSearch,
    ebookSearch, setEbookSearch,
    // Modal Data
    ebookModalOpen, borrowFormOpen, selectedBookId, selectedBookTitle, selectedEbookCover,
    // Actions
    handleSmartSearch, handleBookClick, closeModals, setEbookModalOpen, setBorrowFormOpen, setSelectedBookId
  };
};
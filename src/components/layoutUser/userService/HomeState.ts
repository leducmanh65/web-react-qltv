// HomeState.ts
import { useState } from "react";
import type { Book } from "../book-card";

export const useHomeState = () => {
  // Autocomplete Data
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [authors, setAuthors] = useState<any[]>([]);

  // Selection
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [selectedTag, setSelectedTag] = useState<any>(null);
  const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

  // Main logic
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [bookType, setBookType] = useState<string>("All");
  const [search, setSearch] = useState<string>("");
  const [ebookSearch, setEbookSearch] = useState<string>("");

  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [ebookModalOpen, setEbookModalOpen] = useState(false);
  const [borrowFormOpen, setBorrowFormOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<number | null>(null);
  const [selectedBookTitle, setSelectedBookTitle] = useState<string>("");
  const [selectedEbookCover, setSelectedEbookCover] = useState<string>("");

  const BOOKS_PER_PAGE = 20;

  return {
    categories, setCategories,
    tags, setTags,
    authors, setAuthors,

    selectedCategory, setSelectedCategory,
    selectedTag, setSelectedTag,
    selectedAuthor, setSelectedAuthor,

    selectedGenre, setSelectedGenre,
    bookType, setBookType,
    search, setSearch,
    ebookSearch, setEbookSearch,

    allBooks, setAllBooks,
    loading, setLoading,
    currentPage, setCurrentPage,

    ebookModalOpen, setEbookModalOpen,
    borrowFormOpen, setBorrowFormOpen,
    selectedBookId, setSelectedBookId,
    selectedBookTitle, setSelectedBookTitle,
    selectedEbookCover, setSelectedEbookCover,

    BOOKS_PER_PAGE
  };
};

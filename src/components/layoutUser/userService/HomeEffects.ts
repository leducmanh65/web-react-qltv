// HomeEffects.ts
import { useEffect } from "react";
import {
  getAllBooks,
  getAllEbooks,
  getAllCategories,
  getAllTags,
  getAllAuthors,
} from "../../../api/apiService";

export const useHomeEffects = (state: any) => {

  // Fetch Autocomplete
  useEffect(() => {
    const fetchAutocomplete = async () => {
      try {
        const [catRes, tagRes, authorRes] = await Promise.all([
          getAllCategories(),
          getAllTags(),
          getAllAuthors()
        ]);

        state.setCategories(Array.isArray(catRes) ? catRes : catRes?.data || []);
        state.setTags(Array.isArray(tagRes) ? tagRes : tagRes?.data || []);
        state.setAuthors(Array.isArray(authorRes) ? authorRes : authorRes?.data || []);
      } catch (err) {
        console.error("Lỗi tải dữ liệu autocomplete:", err);
      }
    };

    fetchAutocomplete();
  }, []);

  // Fetch books
  useEffect(() => {
    const fetchBooks = async () => {
      state.setLoading(true);
      try {
        const response = state.bookType === "Ebook"
          ? await getAllEbooks()
          : await getAllBooks();

        const booksData = Array.isArray(response) ? response : response?.data || [];
        state.setAllBooks(booksData);
      } catch (e) {
        console.error("Failed to fetch books:", e);
        state.setAllBooks([]);
      } finally {
        state.setLoading(false);
      }
    };

    fetchBooks();
  }, [state.bookType]);
};

// HomeHandlers.ts
import {
  getAllBooks,
  getBooksByAuthorId,
  searchBooksByTitle,
  getBooksByCategoryAndTags
} from "../../../api/apiService";

export const useHomeHandlers = (state: any, navigate: any) => {

  const handleSmartSearch = async () => {
    state.setLoading(true);
    try {
      let books = [];

      if (state.selectedAuthor) {
        const res = await getBooksByAuthorId(state.selectedAuthor.id);
        books = res?.data || res || [];
      } else if (state.selectedCategory) {
        const tagIds = state.selectedTag ? [state.selectedTag.id] : [];
        const res = await getBooksByCategoryAndTags(state.selectedCategory.id, tagIds);
        books = res?.data || res || [];
      } else if (state.search) {
        const res = await searchBooksByTitle(state.search);
        books = res?.data || res || [];
      } else {
        const res = await getAllBooks();
        books = res?.data || res || [];
      }

      state.setAllBooks(books);
    } catch (err) {
      console.error("Lỗi smart search:", err);
      state.setAllBooks([]);
    } finally {
      state.setLoading(false);
    }
  };

  const handleBookClick = (book: any, cover?: string) => {
    state.setSelectedBookId(book.id);
    state.setSelectedBookTitle(book.title);

    if (book.isEbook) {
      state.setSelectedEbookCover(cover || book.imageUrl || "");
      state.setEbookModalOpen(true);
    } else {
      state.setBorrowFormOpen(true);
    }
  };

  const handleNavigate = (page: string, id?: string) => {
    if (page === "reader" && id) navigate(`/user/reader/${id}`);
    else navigate("/user");
  };

  return { handleSmartSearch, handleBookClick, handleNavigate };
};

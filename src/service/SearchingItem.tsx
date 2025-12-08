import { getBookById, searchBooksByTitle, getAuthorById, getCategoryById } from "../api/apiService";
import type { Author, Category, Tag, User, BorrowSlip } from "../hooks/useManagementHooks";

export const SUGGESTIONS: { label: string; path: string }[] = [
  { label: "Pages / Dashboard", path: "/admin/dashboard" },
  { label: "Pages / Book Management", path: "/admin/books" },
  { label: "Pages / Ebook Management", path: "/admin/ebooks" },
  { label: "Pages / User Management", path: "/admin/users" },
  { label: "Pages / Circulation Management", path: "/admin/circulation" },
  { label: "Pages / Settings", path: "/admin/settings" },
];

type SearchResult = any[] | null;

/**
 * searchItems: centralized search logic used by pages/components.
 * - query: text input
 * - activeTab: 'books' | 'authors' | 'categories' | 'tags' | 'users'
 * - ctx: local arrays for client-side filtering (authors, categories, tags, users)
 * Returns array of results or null when query is empty.
 */
export async function searchItems(
  query: string,
  activeTab: string,
  ctx?: { authors?: Author[]; categories?: Category[]; tags?: Tag[]; users?: User[]; borrowSlips?: BorrowSlip[] }
): Promise<SearchResult> {
  const q = query?.trim();
  if (!q) return null;

  const isNumeric = /^\d+$/.test(q);

  try {
    if (activeTab === "books") {
      if (isNumeric) {
        const book = await getBookById(parseInt(q));
        return book ? [book] : [];
      }
      const byTitle = await searchBooksByTitle(q);
      return Array.isArray(byTitle) ? byTitle : [];
    }

    if (activeTab === "authors") {
      if (isNumeric) {
        const a = await getAuthorById(parseInt(q));
        return a ? [a] : [];
      }
      const list = ctx?.authors || [];
      return list.filter((author) => author.authorName.toLowerCase().includes(q.toLowerCase()));
    }

    if (activeTab === "categories") {
      if (isNumeric) {
        const c = await getCategoryById(parseInt(q));
        return c ? [c] : [];
      }
      const list = ctx?.categories || [];
      return list.filter((cat) => cat.categoryName.toLowerCase().includes(q.toLowerCase()));
    }

    if (activeTab === "tags") {
      const list = ctx?.tags || [];
      if (isNumeric) return list.filter((t) => t.id === parseInt(q));
      return list.filter((t) => t.tagName.toLowerCase().includes(q.toLowerCase()));
    }

    if (activeTab === "users") {
      const list = ctx?.users || [];
      if (isNumeric) return list.filter((u) => u.id === parseInt(q));
      return list.filter((u) => 
        u.username.toLowerCase().includes(q.toLowerCase()) ||
        u.email.toLowerCase().includes(q.toLowerCase()) ||
        u.userCode?.toLowerCase().includes(q.toLowerCase())
      );
    }

    if (activeTab === "borrow-slips") {
      const list = ctx?.borrowSlips || [];
      if (isNumeric) return list.filter((b) => b.id === parseInt(q));
      return list.filter((b) => 
        b.slipCode?.toLowerCase().includes(q.toLowerCase()) ||
        b.reader?.username?.toLowerCase().includes(q.toLowerCase()) ||
        b.details?.[0]?.book?.title?.toLowerCase().includes(q.toLowerCase())
      );
    }

    return [];
  } catch (err) {
    console.error("searchItems error:", err);
    return [];
  }
}

export default searchItems;
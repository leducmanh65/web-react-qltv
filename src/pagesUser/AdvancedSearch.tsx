import React from "react";
import type { Book } from "../components/layoutUser/book-card";

interface AdvancedSearchProps {
  search: string;
  setSearch: (val: string) => void;
  allBooks: Book[];
  categories: any[];
  selectedCategory: any;
  setSelectedCategory: (val: any) => void;
  tags: any[];
  selectedTag: any;
  setSelectedTag: (val: any) => void;
  authors: any[];
  selectedAuthor: any;
  setSelectedAuthor: (val: any) => void;
  onSearch: () => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  search, setSearch, allBooks,
  categories, selectedCategory, setSelectedCategory,
  tags, selectedTag, setSelectedTag,
  authors, selectedAuthor, setSelectedAuthor,
  onSearch
}) => {
  return (
    <section style={{ margin: "20px 0", padding: "20px", background: "#f5f5f5", borderRadius: "8px" }}>
      <h3 className="user-section-title">Tìm kiếm nâng cao</h3>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {/* Input tìm kiếm */}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            placeholder="Nhập tên sách..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            list="book-suggestions"
            style={{ minWidth: 200, padding: "8px" }}
          />
          <datalist id="book-suggestions">
            {allBooks.slice(0, 10).map((b) => (
              <option key={b.id} value={b.title} />
            ))}
          </datalist>
        </div>

        {/* Select Category */}
        <select
          value={selectedCategory?.id || ""}
          onChange={(e) => {
            const val = e.target.value;
            const found = categories.find((c) => String(c.id) === val);
            setSelectedCategory(found || null);
          }}
          style={{ padding: "8px" }}
        >
          <option value="">-- Tất cả Thể loại --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.categoryName}</option>
          ))}
        </select>

        {/* Select Tag */}
        <select
          value={selectedTag?.id || ""}
          onChange={(e) => {
            const val = e.target.value;
            const found = tags.find((t) => String(t.id) === val);
            setSelectedTag(found || null);
          }}
          style={{ padding: "8px" }}
        >
          <option value="">-- Tất cả Tag --</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>{t.tagName}</option>
          ))}
        </select>

        {/* Select Author */}
        <select
          value={selectedAuthor?.id || ""}
          onChange={(e) => {
            const val = e.target.value;
            const found = authors.find((a) => String(a.id) === val);
            setSelectedAuthor(found || null);
          }}
          style={{ padding: "8px" }}
        >
          <option value="">-- Tất cả Tác giả --</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.authorName}</option>
          ))}
        </select>

        <button
          onClick={onSearch}
          style={{ padding: "8px 16px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
        >
          Tìm kiếm
        </button>
      </div>
    </section>
  );
};
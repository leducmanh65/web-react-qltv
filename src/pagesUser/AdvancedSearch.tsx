import React from "react";
import { Search, Filter } from "lucide-react";
import type { Book } from "../components/layoutUser/book-card";
import "../styles/User/home.css";

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
    <section className="user-filter__card">
      <h3 className="user-section__title" style={{ marginBottom: "20px" }}>
        <Filter size={20} color="var(--user-primary)" /> 
        Tìm kiếm nâng cao
      </h3>
      
      <div className="user-filter__row">
        {/* Input tìm kiếm tên sách */}
        <div style={{ position: "relative", flex: "2 1 300px" }}>
          <input
            type="text"
            className="user-filter__input"
            placeholder="Nhập tên sách cần tìm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            list="book-suggestions"
            style={{ paddingLeft: "42px" }}
          />
          <Search 
            size={18} 
            color="#95a5a6" 
            style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }} 
          />
          <datalist id="book-suggestions" >
            {allBooks.slice(0, 10).map((b) => (
              <option key={b.id} value={b.title} style={{backgroundColor :"#ffffff"}}/>
            ))}
          </datalist>
        </div>

        {/* Select Category */}
        <select
          className="user-filter__input"
          style={{ flex: 1 }}
          value={selectedCategory?.id || ""}
          onChange={(e) => {
            const val = e.target.value;
            const found = categories.find((c) => String(c.id) === val);
            setSelectedCategory(found || null);
          }}
        >
          <option value="">-- Tất cả Thể loại --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.categoryName}</option>
          ))}
        </select>

        {/* Select Tag */}
        <select
          className="user-filter__input"
          style={{ flex: 1 }}
          value={selectedTag?.id || ""}
          onChange={(e) => {
            const val = e.target.value;
            const found = tags.find((t) => String(t.id) === val);
            setSelectedTag(found || null);
          }}
        >
          <option value="">-- Tất cả Tag --</option>
          {tags.map((t) => (
            <option key={t.id} value={t.id}>{t.tagName}</option>
          ))}
        </select>

        {/* Select Author */}
        <select
          className="user-filter__input"
          style={{ flex: 1 }}
          value={selectedAuthor?.id || ""}
          onChange={(e) => {
            const val = e.target.value;
            const found = authors.find((a) => String(a.id) === val);
            setSelectedAuthor(found || null);
          }}
        >
          <option value="">-- Tất cả Tác giả --</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.authorName}</option>
          ))}
        </select>

        {/* Nút tìm kiếm */}
        <button className="user-filter__btn" onClick={onSearch}>
          <Search size={18} style={{ marginRight: 8 }} />
          Tìm kiếm
        </button>
      </div>
    </section>
  );
};
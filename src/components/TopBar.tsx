import { Search, Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SUGGESTIONS } from "../service/SearchingItem";

export default function TopBar({ title }: { title: string }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<typeof SUGGESTIONS>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setFiltered([]);
      setOpen(false);
      return;
    }
    const q = query.trim().toLowerCase();
    const f = SUGGESTIONS.filter(s => s.label.toLowerCase().includes(q));
    setFiltered(f);
    setActiveIndex(0);
    setOpen(f.length > 0);
  }, [query]);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[activeIndex] || filtered[0];
      if (item) {
        navigate(item.path);
        setOpen(false);
        setQuery('');
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      marginBottom: '30px' 
    }}>
      <div>
        <p style={{ fontSize: '14px', color: '#A3AED0' }}>Pages / {title}</p>
        <h2 style={{ fontSize: '30px', fontWeight: '700', color: '#2B3674' }}>{title}</h2>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        background: '#fff', 
        padding: '10px', 
        borderRadius: '30px',
        boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
        position: 'relative'
      }} ref={wrapperRef}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          background: '#F4F7FE', 
          padding: '10px 20px', 
          borderRadius: '20px',
          minWidth: 260,
          position: 'relative'
        }}>
          <Search size={18} color="#8F9BBA" />
          <input 
            placeholder="Search pages or commands..." 
            style={{ 
              border: 'none', 
              background: 'transparent', 
              marginLeft: '10px', 
              outline: 'none',
              width: '100%'
            }} 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setOpen(filtered.length > 0)}
          />

          {open && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 10,
              right: 10,
              background: '#fff',
              borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 50,
              maxHeight: 240,
              overflow: 'auto'
            }}>
              {filtered.map((s, idx) => (
                <div 
                  key={s.path}
                  onMouseDown={(ev) => { ev.preventDefault(); navigate(s.path); setOpen(false); setQuery(''); }}
                  style={{
                    padding: '10px 12px',
                    cursor: 'pointer',
                    background: idx === activeIndex ? '#F0F6FF' : 'transparent',
                    borderLeft: idx === activeIndex ? '3px solid #2B6BFF' : '3px solid transparent'
                  }}
                >
                  <div style={{ fontSize: 13, color: '#2B3674' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginLeft: '20px', cursor: 'pointer', color: '#A3AED0' }}>
            <Bell size={24} />
        </div>
      </div>
    </div>
  );
}
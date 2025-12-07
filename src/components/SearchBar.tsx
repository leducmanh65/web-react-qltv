import React from 'react';

export interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = 'Tìm kiếm sách...' }) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <input
                aria-label="search"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={{ padding: 10, borderRadius: 8, border: '1px solid #ddd', width: '100%' }}
            />
        </div>
    );
};

export default SearchBar;

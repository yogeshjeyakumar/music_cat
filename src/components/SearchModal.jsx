import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiX, FiTrendingUp } from 'react-icons/fi';

const TRENDING = ['The Weeknd', 'Dua Lipa', 'BTS', 'Olivia Rodrigo', 'Ed Sheeran', 'Billie Eilish'];

export default function SearchModal({ onClose }) {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSearch = (q) => {
    const term = (q || query).trim();
    if (!term) return;
    onClose();
    navigate(`/player?q=${encodeURIComponent(term)}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="sp-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sp-modal-box">
        <button className="sp-modal-close" onClick={onClose} id="close-search-modal-btn">
          <FiX />
        </button>

        <p className="sp-modal-title">Search Music</p>

        <form onSubmit={handleSubmit}>
          <div className="sp-modal-input-wrap">
            <FiSearch className="sp-modal-search-icon" />
            <input
              id="modal-search-input"
              ref={inputRef}
              className="sp-modal-input"
              type="text"
              placeholder="What do you want to listen to?"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <button id="modal-search-btn" type="submit" className="sp-search-btn">
            Search
          </button>
        </form>

        {/* Trending suggestions */}
        <div style={{ marginTop: 24 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiTrendingUp /> Trending
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TRENDING.map((t) => (
              <button
                key={t}
                className="sp-genre-pill"
                onClick={() => handleSearch(t)}
                style={{ cursor: 'pointer' }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

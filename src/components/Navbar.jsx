import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiMusic, FiBell, FiUser } from 'react-icons/fi';
import SearchModal from './SearchModal';
import logo from '../assets/logo.png';

export default function Navbar() {
  const [modalOpen, setModalOpen] = useState(false);
  const [inlineQuery, setInlineQuery] = useState('');
  const navigate = useNavigate();

  const handleInlineSearch = (e) => {
    e.preventDefault();
    if (inlineQuery.trim()) {
      navigate(`/player?q=${encodeURIComponent(inlineQuery.trim())}`);
      setInlineQuery('');
    }
  };

  return (
    <>
      <nav className="sp-navbar">
        <Link to="/" className="sp-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src={logo} alt="MUSIC CAT Logo" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          MUSIC<span>CAT</span>
        </Link>

        {/* Inline search (desktop) */}
        <form className="sp-search-bar" onSubmit={handleInlineSearch}>
          <FiSearch className="sp-search-icon" />
          <input
            id="navbar-search-input"
            className="sp-search-input"
            type="text"
            placeholder="Search songs, artists, albums..."
            value={inlineQuery}
            onChange={(e) => setInlineQuery(e.target.value)}
            onFocus={() => !inlineQuery && setModalOpen(true)}
          />
        </form>

        <div className="sp-nav-actions">
          {/* Mobile search toggle */}
          <button
            id="open-search-modal-btn"
            className="sp-icon-btn d-md-none"
            onClick={() => setModalOpen(true)}
            title="Search"
          >
            <FiSearch />
          </button>
          <button className="sp-icon-btn" title="Notifications"><FiBell /></button>
          <button className="sp-icon-btn" title="Profile"><FiUser /></button>
        </div>
      </nav>

      {modalOpen && <SearchModal onClose={() => setModalOpen(false)} />}
    </>
  );
}

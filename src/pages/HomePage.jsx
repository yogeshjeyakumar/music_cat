import React, { useEffect, useState } from 'react';
import { FiDisc } from 'react-icons/fi';
import SongCard from '../components/SongCard';
import { getAllSongs } from '../api/musicApi';
import { usePlayer } from '../context/PlayerContext';

const GENRES = [
  'All',
  'Tamil Hits',
  'Hindi Hits',
  'Melodies',
  'Kuthu Songs',
  'Anirudh Hits',
  'ARR Classics',
  'Ilayaraja Hits'
];

function SkeletonCard() {
  return (
    <div className="sp-card" style={{ pointerEvents: 'none' }}>
      <div className="sp-skeleton" style={{ width: '100%', aspectRatio: '1', borderRadius: 8, marginBottom: 12 }} />
      <div className="sp-skeleton" style={{ height: 14, borderRadius: 4, marginBottom: 6, width: '80%' }} />
      <div className="sp-skeleton" style={{ height: 12, borderRadius: 4, width: '60%' }} />
    </div>
  );
}

export default function HomePage() {
  const [songs, setSongs] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [genre, setGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const { setQueue } = usePlayer();

  useEffect(() => {
    getAllSongs()
      .then((data) => {
        setSongs(data);
        setFiltered(data);
        setQueue(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [setQueue]);

  useEffect(() => {
    if (genre === 'All') {
      setFiltered([...songs].reverse()); // Reverses list to show in opposite (descending) order
    } else {
      setFiltered(songs.filter((s) => s.genre === genre).reverse().slice(0, 30));
    }
  }, [genre, songs]);

  return (
    <main className="sp-page">
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, var(--accent-dark) 0%, var(--bg-secondary) 80%)',
        borderRadius: 16,
        padding: '32px 28px',
        marginBottom: 32,
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        border: '1px solid var(--border)',
      }}>
        <div style={{
          width: 64, height: 64, background: 'var(--accent)',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '1.8rem', flexShrink: 0,
          color: '#ffffff',
          boxShadow: '0 0 16px rgba(247,0,0,0.5)',
        }}>
          🐾
        </div>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: 4 }}>
            Good {getGreeting()}! 
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 500 }}>
            Welcome to <strong style={{ color: '#ffffff' }}>MUSIC CAT</strong> — Purr-fect beats and high fidelity audio.
          </p>
        </div>
      </div>

      {/* Genre Filter */}
      <div className="sp-genre-filters">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`sp-genre-pill ${genre === g ? 'active' : ''}`}
            onClick={() => setGenre(g)}
            id={`genre-${g.toLowerCase().replace(/[^a-z]/g, '')}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Section Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <h2 className="sp-section-title" style={{ marginBottom: 0 }}>
          {genre === 'All' ? 'All Songs' : genre}
          {!loading && <span className="sp-section-subtitle" style={{ marginLeft: 12 }}>{filtered.length} tracks</span>}
        </h2>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="sp-grid">
          {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="sp-empty">
          <div className="sp-empty-icon">🎵</div>
          <div className="sp-empty-text">No songs in this genre yet</div>
          <div className="sp-empty-sub">Try a different filter</div>
        </div>
      ) : (
        <div className="sp-grid">
          {filtered.map((song, i) => (
            <SongCard key={song.id} song={song} queue={filtered} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

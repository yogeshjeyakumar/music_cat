import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiMusic, FiHeart, FiShare2 } from 'react-icons/fi';
import { searchSongs, getRelatedSongs } from '../api/musicApi';
import { usePlayer } from '../context/PlayerContext';
import PlayerControls from '../components/PlayerControls';
import RelatedSongs from '../components/RelatedSongs';

export default function PlayerPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);

  const { currentSong, isPlaying, playSong, setQueue } = usePlayer();

  // ─── Fetch search results ────────────────────────────────────────────────────
  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    searchSongs(query)
      .then((data) => {
        const q = query.toLowerCase();
        // Sort results: matching songs on top, other songs on bottom
        const getScore = (song) => {
          const title = (song.title || '').toLowerCase();
          const artist = (song.artist || '').toLowerCase();
          if (title === q) return 0;
          if (title.startsWith(q)) return 1;
          if (title.includes(q)) return 2;
          if (artist === q) return 3;
          if (artist.startsWith(q)) return 4;
          if (artist.includes(q)) return 5;
          return 6;
        };

        const sortedData = [...data].sort((a, b) => getScore(a) - getScore(b));
        const limitedData = sortedData.slice(0, 20);

        setResults(limitedData);
        setQueue(limitedData);
        // Auto-play first result if nothing is currently playing or query changed
        if (limitedData.length > 0) {
          playSong(limitedData[0], limitedData, 0);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [query]);

  // ─── Fetch related when current song changes ─────────────────────────────────
  useEffect(() => {
    if (!currentSong?.id) return;
    getRelatedSongs(currentSong.id)
      .then(setRelated)
      .catch(console.error);
  }, [currentSong?.id]);

  const displaySong = currentSong || results[0];

  return (
    <main>
      {/* Back bar */}
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        borderBottom: '1px solid var(--border)',
      }}>
        <Link
          to="/"
          id="back-to-home-btn"
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            color: 'var(--text-secondary)', textDecoration: 'none',
            fontSize: '0.9rem', fontWeight: 500,
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <FiArrowLeft /> Back
        </Link>
        {query && (
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Results for: <strong style={{ color: 'var(--accent)' }}>"{query}"</strong>
          </span>
        )}
      </div>

      {loading ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '70vh', /* Covers full desktop window height */
          width: '100%',
          textAlign: 'center',
          padding: '40px 20px',
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 24, animation: 'pulse 1.5s infinite' }}>🎵</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.05em' }}>
            SEARCHING MUSIC CAT...
          </p>
        </div>
      ) : (results.length === 0 && !currentSong) ? (
        <div className="sp-empty" style={{ padding: '80px 20px' }}>
          <div className="sp-empty-icon">🔍</div>
          <div className="sp-empty-text">No results found</div>
          <div className="sp-empty-sub">Try searching for something else</div>
          <Link to="/" style={{ color: 'var(--accent)', marginTop: 16, display: 'inline-block' }}>
            ← Browse all songs
          </Link>
        </div>
      ) : (
        <div className="sp-player-layout">
          {/* ── Left: Player ── */}
          <div className="sp-player-main">
            {/* Album Art */}
            <div style={{ position: 'relative' }}>
              {displaySong?.cover_image ? (
                <img
                  className={`sp-album-art ${isPlaying ? 'playing' : ''}`}
                  src={displaySong.cover_image}
                  alt={displaySong?.title}
                  onError={(e) => { e.target.src = `https://picsum.photos/seed/${displaySong.id}/300/300`; }}
                />
              ) : (
                <div style={{
                  width: 280, height: 280, borderRadius: 16,
                  background: 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <FiMusic size={80} color="var(--text-muted)" />
                </div>
              )}
            </div>

            {/* Song Info */}
            <div style={{ width: '100%', maxWidth: 380 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div style={{ flex: 1 }}>
                  <h1 className="sp-player-song-title">
                    {displaySong?.title || 'No Song Playing'}
                  </h1>
                  <p className="sp-player-artist">{displaySong?.artist}</p>
                  {displaySong?.album && (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 4 }}>
                      {displaySong.album}
                    </p>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8, marginLeft: 16 }}>
                  <button
                    className="sp-ctrl-btn"
                    id="like-btn"
                    onClick={() => setLiked(!liked)}
                    title="Like"
                    style={{ color: liked ? '#e91e63' : undefined, fontSize: '1.2rem' }}
                  >
                    <FiHeart fill={liked ? '#e91e63' : 'none'} />
                  </button>
                  <button className="sp-ctrl-btn" id="share-btn" title="Share" style={{ fontSize: '1.2rem' }}>
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <PlayerControls />

            {/* Search results list (other found songs) */}
            {results.length > 1 && (
              <div style={{ width: '100%', maxWidth: 480 }}>
                <p style={{
                  fontSize: '0.85rem', fontWeight: 700,
                  color: 'var(--text-secondary)', marginBottom: 12,
                  textTransform: 'uppercase', letterSpacing: '0.05em',
                }}>
                  Search Results ({results.length})
                </p>
                <div style={{
                  background: 'var(--bg-secondary)', borderRadius: 12,
                  overflow: 'hidden', maxHeight: 260, overflowY: 'auto',
                }}>
                  {results.map((song, i) => {
                    const isActive = currentSong?.id === song.id;
                    return (
                      <div
                        key={song.id}
                        className="sp-related-item"
                        onClick={() => playSong(song, results, i)}
                        id={`result-song-${song.id}`}
                        style={{ borderBottom: '1px solid var(--border)' }}
                      >
                        <img
                          className="sp-related-img"
                          src={song.cover_image || `https://picsum.photos/seed/${song.id}/100/100`}
                          alt={song.title}
                        />
                        <div className="sp-related-info">
                          <div className="sp-related-name"
                            style={{ color: isActive ? 'var(--accent)' : undefined }}>
                            {song.title}
                          </div>
                          <div className="sp-related-artist">{song.artist}</div>
                        </div>
                        {song.genre && <span className="sp-card-genre" style={{ fontSize: '0.7rem' }}>{song.genre}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Related Songs ── */}
          <RelatedSongs songs={related} />
        </div>
      )}
    </main>
  );
}

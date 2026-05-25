import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiPlay, FiPause, FiSkipBack, FiSkipForward,
  FiVolume2, FiVolumeX, FiMusic, FiChevronUp, FiChevronDown,
} from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export default function MiniPlayer() {
  const {
    currentSong, isPlaying, progress, duration,
    volume, isMuted, togglePlay, nextSong, prevSong,
    seek, setVolume, toggleMute,
  } = usePlayer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMinimized, setIsMinimized] = useState(false);

  // Hide the miniplayer completely on the Player Page
  if (location.pathname === '/player') return null;

  if (!currentSong) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * (duration || 0));
  };

  if (isMinimized) {
    return (
      <div className="sp-mini-player minimized" id="mini-player">
        {/* Compact Song Info */}
        <div
          className="sp-mini-song-info"
          onClick={() => navigate('/player')}
          style={{ cursor: 'pointer', flex: 1 }}
          title="Open Player Page"
        >
          {currentSong.cover_image ? (
            <img
              className="sp-mini-thumb"
              src={currentSong.cover_image}
              alt={currentSong.title}
              style={{ width: 38, height: 38 }}
            />
          ) : (
            <div className="sp-mini-thumb-placeholder" style={{ width: 38, height: 38 }}><FiMusic size={16} /></div>
          )}
          <div style={{ minWidth: 0 }}>
            <div className="sp-mini-title" style={{ fontSize: '0.8rem' }}>{currentSong.title}</div>
            <div className="sp-mini-artist" style={{ fontSize: '0.7rem' }}>{currentSong.artist}</div>
          </div>
        </div>

        {/* Compact Play/Pause and Maximize Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <button className="sp-play-btn" onClick={togglePlay} id="mini-play-btn" title={isPlaying ? 'Pause' : 'Play'} style={{ width: 34, height: 34, fontSize: '0.8rem' }}>
            {isPlaying ? <FiPause /> : <FiPlay style={{ marginLeft: 2 }} />}
          </button>
          
          <button
            className="sp-ctrl-btn"
            onClick={() => setIsMinimized(false)}
            id="mini-maximize-btn"
            title="Maximize Player"
            style={{ color: 'var(--accent)' }}
          >
            <FiChevronUp size={22} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-mini-player" id="mini-player">
      {/* Song Info (Click to navigate to Player Page) */}
      <div
        className="sp-mini-song-info"
        onClick={() => navigate('/player')}
        style={{ cursor: 'pointer' }}
        title="Open Player Page"
      >
        {currentSong.cover_image ? (
          <img
            className="sp-mini-thumb"
            src={currentSong.cover_image}
            alt={currentSong.title}
          />
        ) : (
          <div className="sp-mini-thumb-placeholder"><FiMusic size={20} /></div>
        )}
        <div style={{ minWidth: 0 }}>
          <div className="sp-mini-title">{currentSong.title}</div>
          <div className="sp-mini-artist">{currentSong.artist}</div>
        </div>
      </div>

      {/* Center Controls */}
      <div className="sp-mini-controls">
        <div className="sp-mini-btns">
          <button className="sp-ctrl-btn" onClick={prevSong} id="mini-prev-btn" title="Previous">
            <FiSkipBack />
          </button>
          <button className="sp-play-btn" onClick={togglePlay} id="mini-play-btn" title={isPlaying ? 'Pause' : 'Play'}>
            {isPlaying ? <FiPause /> : <FiPlay style={{ marginLeft: 2 }} />}
          </button>
          <button className="sp-ctrl-btn" onClick={nextSong} id="mini-next-btn" title="Next">
            <FiSkipForward />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="sp-progress-wrap">
          <span className="sp-progress-time">{formatTime(progress)}</span>
          <div className="sp-progress-bar" onClick={handleSeek}>
            <div className="sp-progress-fill" style={{ width: `${pct}%` }} />
            <input
              type="range" min={0} max={duration || 0} value={progress}
              className="sp-progress-range"
              onChange={(e) => seek(Number(e.target.value))}
            />
          </div>
          <span className="sp-progress-time">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume & Minimize Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        {/* Volume */}
        <div className="sp-volume-wrap">
          <button className="sp-ctrl-btn" onClick={toggleMute} id="mini-mute-btn" title="Mute">
            {isMuted || volume === 0 ? <FiVolumeX /> : <FiVolume2 />}
          </button>
          <input
            id="mini-volume-slider"
            type="range"
            min={0} max={1} step={0.01}
            value={isMuted ? 0 : volume}
            className="sp-volume-slider"
            onChange={(e) => setVolume(Number(e.target.value))}
          />
        </div>

        {/* Minimize Action Toggle */}
        <button
          className="sp-ctrl-btn"
          onClick={() => setIsMinimized(true)}
          id="mini-minimize-btn"
          title="Minimize Player"
          style={{ color: 'var(--text-secondary)' }}
        >
          <FiChevronDown size={22} />
        </button>
      </div>
    </div>
  );
}

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlay, FiPause } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';

export default function SongCard({ song, queue = [], index = 0 }) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();
  const navigate = useNavigate();

  const isActive = currentSong?.id === song.id;

  const handleCardClick = (e) => {
    // If they clicked the play button, let handlePlayIconClick handle it
    if (e.target.closest('.sp-card-play-btn')) return;

    if (!isActive) {
      playSong(song, queue.length ? queue : [song], index);
    }
    navigate('/player');
  };

  const handlePlayIconClick = (e) => {
    e.stopPropagation();
    if (isActive) {
      togglePlay();
    } else {
      playSong(song, queue.length ? queue : [song], index);
    }
    navigate('/player');
  };

  return (
    <div
      className={`sp-card ${isActive ? 'active' : ''}`}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e)}
      id={`song-card-${song.id}`}
    >
      <div className="sp-card-img-wrap">
        <img
          className="sp-card-img"
          src={song.cover_image || `https://picsum.photos/seed/${song.id}/300/300`}
          alt={song.title}
          loading="lazy"
          onError={(e) => { e.target.src = `https://picsum.photos/seed/${song.id}x/300/300`; }}
        />
        <button
          className="sp-card-play-btn"
          onClick={handlePlayIconClick}
          id={`play-btn-${song.id}`}
          aria-label={isActive && isPlaying ? 'Pause' : 'Play'}
        >
          {isActive && isPlaying ? <FiPause /> : <FiPlay style={{ marginLeft: 2 }} />}
        </button>
      </div>

      <div className="sp-card-title" title={song.title}>{song.title}</div>
      <div className="sp-card-artist" title={song.artist}>{song.artist}</div>
      {song.genre && <span className="sp-card-genre">{song.genre}</span>}
    </div>
  );
}

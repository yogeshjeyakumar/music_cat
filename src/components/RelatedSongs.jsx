import React from 'react';
import { FiPlay, FiPause } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';

export default function RelatedSongs({ songs }) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayer();

  const formatDur = (sec) => {
    if (!sec) return '--:--';
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  };

  if (!songs?.length) {
    return (
      <div className="sp-related">
        <p className="sp-related-title">Related Songs</p>
        <div className="sp-empty">
          <div className="sp-empty-icon">🎵</div>
          <div className="sp-empty-sub">No related songs found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-related">
      <p className="sp-related-title">Related Songs</p>
      {songs.map((song, i) => {
        const isActive = currentSong?.id === song.id;
        return (
          <div
            key={song.id}
            className={`sp-related-item ${isActive ? 'active' : ''}`}
            onClick={() => isActive ? togglePlay() : playSong(song, songs, i)}
            id={`related-song-${song.id}`}
          >
            <img
              className="sp-related-img"
              src={song.cover_image || `https://picsum.photos/seed/${song.id}/100/100`}
              alt={song.title}
              onError={(e) => { e.target.src = `https://picsum.photos/seed/${song.id}r/100/100`; }}
            />
            <div className="sp-related-info">
              <div className="sp-related-name" style={{ color: isActive ? 'var(--accent)' : undefined }}>
                {song.title}
              </div>
              <div className="sp-related-artist">{song.artist}</div>
            </div>
            <span className="sp-related-dur">{formatDur(song.duration)}</span>
            <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-muted)', marginLeft: 4, fontSize: '0.8rem' }}>
              {isActive && isPlaying ? <FiPause /> : <FiPlay />}
            </span>
          </div>
        );
      })}
    </div>
  );
}

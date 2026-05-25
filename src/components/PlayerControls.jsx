import React, { useEffect, useState } from 'react';
import { FiPlay, FiPause, FiSkipBack, FiSkipForward } from 'react-icons/fi';
import { usePlayer } from '../context/PlayerContext';

function formatTime(sec) {
  if (!sec || isNaN(sec)) return '0:00';
  return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
}

export default function PlayerControls() {
  const { isPlaying, progress, duration, togglePlay, nextSong, prevSong, seek } = usePlayer();
  const pct = duration ? (progress / duration) * 100 : 0;

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    seek(ratio * (duration || 0));
  };

  return (
    <div className="sp-full-controls">
      <div className="sp-full-btns">
        <button className="sp-ctrl-btn" onClick={prevSong} id="full-prev-btn" title="Previous" style={{ fontSize: '1.4rem' }}>
          <FiSkipBack />
        </button>
        <button className="sp-full-play-btn" onClick={togglePlay} id="full-play-btn" title={isPlaying ? 'Pause' : 'Play'}>
          {isPlaying ? <FiPause /> : <FiPlay style={{ marginLeft: 3 }} />}
        </button>
        <button className="sp-ctrl-btn" onClick={nextSong} id="full-next-btn" title="Next" style={{ fontSize: '1.4rem' }}>
          <FiSkipForward />
        </button>
      </div>

      <div className="sp-full-progress">
        <div className="sp-full-bar" onClick={handleSeek}>
          <div className="sp-full-bar-fill" style={{ width: `${pct}%` }} />
          <input
            type="range" min={0} max={duration || 0} value={progress}
            className="sp-full-bar-range"
            onChange={(e) => seek(Number(e.target.value))}
          />
        </div>
        <div className="sp-full-times">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
}

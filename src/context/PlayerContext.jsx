import React, { createContext, useContext, useReducer, useRef, useEffect, useCallback } from 'react';
import { getAudioUrl } from '../api/musicApi';

const PlayerContext = createContext(null);

const initialState = {
  currentSong: null,
  queue: [],
  queueIndex: 0,
  isPlaying: false,
  volume: 0.8,
  progress: 0,
  duration: 0,
  isMuted: false,
};

function playerReducer(state, action) {
  switch (action.type) {
    case 'SET_SONG':
      return {
        ...state,
        currentSong: action.payload.song,
        queue: action.payload.queue || state.queue,
        queueIndex: action.payload.index ?? 0,
        isPlaying: true,
        progress: 0,
      };
    case 'SET_QUEUE':
      return { ...state, queue: action.payload };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    case 'SET_PROGRESS':
      return { ...state, progress: action.payload };
    case 'SET_DURATION':
      return { ...state, duration: action.payload };
    case 'SET_VOLUME':
      return { ...state, volume: action.payload, isMuted: action.payload === 0 };
    case 'TOGGLE_MUTE':
      return { ...state, isMuted: !state.isMuted };
    case 'NEXT_SONG': {
      const nextIndex = (state.queueIndex + 1) % state.queue.length;
      return {
        ...state,
        currentSong: state.queue[nextIndex] || state.currentSong,
        queueIndex: nextIndex,
        isPlaying: true,
        progress: 0,
      };
    }
    case 'PREV_SONG': {
      const prevIndex = state.queueIndex === 0 ? state.queue.length - 1 : state.queueIndex - 1;
      return {
        ...state,
        currentSong: state.queue[prevIndex] || state.currentSong,
        queueIndex: prevIndex,
        isPlaying: true,
        progress: 0,
      };
    }
    default:
      return state;
  }
}

export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, initialState);
  const audioRef = useRef(new Audio());

  // ─── Sync audio src when song changes ───────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    if (!state.currentSong) return;

    const url = getAudioUrl(state.currentSong);
    if (url && audio.src !== url) {
      audio.src = url;
      audio.load();
    } else if (!url) {
      // No audio file — simulate play with progress
      audio.src = '';
    }

    if (state.isPlaying) {
      if (url) audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [state.currentSong]);

  // ─── Play / Pause toggle ─────────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;
    const url = getAudioUrl(state.currentSong);
    if (!url) return;
    if (state.isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [state.isPlaying]);

  // ─── Volume ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    audioRef.current.volume = state.isMuted ? 0 : state.volume;
  }, [state.volume, state.isMuted]);

  // ─── Audio event listeners ───────────────────────────────────────────────────
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () =>
      dispatch({ type: 'SET_PROGRESS', payload: audio.currentTime });
    const onDurationChange = () =>
      dispatch({ type: 'SET_DURATION', payload: audio.duration || 0 });
    const onEnded = () => dispatch({ type: 'NEXT_SONG' });

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const playSong = useCallback((song, queue = [], index = 0) => {
    dispatch({ type: 'SET_SONG', payload: { song, queue, index } });
  }, []);

  const togglePlay = useCallback(() => dispatch({ type: 'TOGGLE_PLAY' }), []);

  const nextSong = useCallback(() => dispatch({ type: 'NEXT_SONG' }), []);

  const prevSong = useCallback(() => dispatch({ type: 'PREV_SONG' }), []);

  const seek = useCallback((time) => {
    audioRef.current.currentTime = time;
    dispatch({ type: 'SET_PROGRESS', payload: time });
  }, []);

  const setVolume = useCallback((vol) => {
    dispatch({ type: 'SET_VOLUME', payload: vol });
  }, []);

  const toggleMute = useCallback(() => dispatch({ type: 'TOGGLE_MUTE' }), []);

  const setQueue = useCallback((songs) => dispatch({ type: 'SET_QUEUE', payload: songs }), []);

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        audioRef,
        playSong,
        togglePlay,
        nextSong,
        prevSong,
        seek,
        setVolume,
        toggleMute,
        setQueue,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within <PlayerProvider>');
  return ctx;
}

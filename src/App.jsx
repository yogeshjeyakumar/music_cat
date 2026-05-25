import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PlayerProvider } from './context/PlayerContext';
import Navbar from './components/Navbar';
import MiniPlayer from './components/MiniPlayer';
import HomePage from './pages/HomePage';
import PlayerPage from './pages/PlayerPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

export default function App() {
  return (
    <PlayerProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/player" element={<PlayerPage />} />
        </Routes>
        <MiniPlayer />
      </BrowserRouter>
    </PlayerProvider>
  );
}

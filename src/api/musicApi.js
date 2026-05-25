import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://music-cat-zl6i.onrender.com';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Mock Data (fallback when backend is not running) ───────────────────────
const MOCK_SONGS = [
  {
    id: 1,
    title: 'Kavala',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    duration: 220,
    cover_image: 'https://picsum.photos/seed/kavala/300/300',
    audio_file: null,
    genre: 'Kuthu Songs',
  },
  {
    id: 2,
    title: 'Kesariya',
    artist: 'Arijit Singh',
    album: 'Brahmastra',
    duration: 268,
    cover_image: 'https://picsum.photos/seed/kesariya/300/300',
    audio_file: null,
    genre: 'Hindi Hits',
  },
  {
    id: 3,
    title: 'Pachai Nirame',
    artist: 'A.R. Rahman',
    album: 'Alaipayuthey',
    duration: 350,
    cover_image: 'https://picsum.photos/seed/pachai/300/300',
    audio_file: null,
    genre: 'Melodies',
  },
  {
    id: 4,
    title: 'Hukum',
    artist: 'Anirudh Ravichander',
    album: 'Jailer',
    duration: 207,
    cover_image: 'https://picsum.photos/seed/hukum/300/300',
    audio_file: null,
    genre: 'Anirudh Hits',
  },
  {
    id: 5,
    title: 'Urvashe Urvashe',
    artist: 'A.R. Rahman',
    album: 'Kadhalan',
    duration: 320,
    cover_image: 'https://picsum.photos/seed/urvasi/300/300',
    audio_file: null,
    genre: 'ARR Classics',
  },
  {
    id: 6,
    title: 'Naa Ready',
    artist: 'Anirudh Ravichander',
    album: 'Leo',
    duration: 248,
    cover_image: 'https://picsum.photos/seed/ready/300/300',
    audio_file: null,
    genre: 'Kuthu Songs',
  },
  {
    id: 7,
    title: 'Tum Hi Ho',
    artist: 'Arijit Singh',
    album: 'Aashiqui 2',
    duration: 262,
    cover_image: 'https://picsum.photos/seed/tumhiho/300/300',
    audio_file: null,
    genre: 'Hindi Hits',
  },
  {
    id: 8,
    title: 'Kanmani Anbodu',
    artist: 'Ilaiyaraaja, S. Janaki',
    album: 'Gunaa',
    duration: 312,
    cover_image: 'https://picsum.photos/seed/gunaa/300/300',
    audio_file: null,
    genre: 'Ilayaraja Hits',
  },
  {
    id: 9,
    title: 'Rowdy Baby',
    artist: 'Dhanush, Dhee',
    album: 'Maari 2',
    duration: 284,
    cover_image: 'https://picsum.photos/seed/rowdy/300/300',
    audio_file: null,
    genre: 'Tamil Hits',
  },
  {
    id: 10,
    title: 'Unna Nenachu',
    artist: 'Ilaiyaraaja, Sid Sriram',
    album: 'Psycho',
    duration: 285,
    cover_image: 'https://picsum.photos/seed/unna/300/300',
    audio_file: null,
    genre: 'Melodies',
  },
  {
    id: 11,
    title: 'Arabic Kuthu',
    artist: 'Anirudh Ravichander',
    album: 'Beast',
    duration: 280,
    cover_image: 'https://picsum.photos/seed/arabic/300/300',
    audio_file: null,
    genre: 'Kuthu Songs',
  },
  {
    id: 12,
    title: 'Hayyoda',
    artist: 'Anirudh Ravichander',
    album: 'Jawan',
    duration: 204,
    cover_image: 'https://picsum.photos/seed/hayyoda/300/300',
    audio_file: null,
    genre: 'Anirudh Hits',
  },
];

// ─── API Helpers ─────────────────────────────────────────────────────────────
const useMock = (error) => {
  return (
    error.code === 'ERR_NETWORK' ||
    error.code === 'ECONNREFUSED' ||
    error.response?.status === 404
  );
};

export const getAllSongs = async () => {
  try {
    const res = await api.get('/api/songs/');
    return res.data;
  } catch (err) {
    if (useMock(err)) return MOCK_SONGS;
    throw err;
  }
};

export const searchSongs = async (query) => {
  try {
    const res = await api.get(`/api/songs/search/?q=${encodeURIComponent(query)}`);
    return res.data;
  } catch (err) {
    if (useMock(err)) {
      const q = query.toLowerCase();
      const matchedSongs = MOCK_SONGS.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.artist.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q)
      );

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

      matchedSongs.sort((a, b) => getScore(a) - getScore(b));
      return matchedSongs.slice(0, 20);
    }
    throw err;
  }
};

export const getSongById = async (id) => {
  try {
    const res = await api.get(`/api/songs/${id}/`);
    return res.data;
  } catch (err) {
    if (useMock(err)) return MOCK_SONGS.find((s) => s.id === Number(id)) || MOCK_SONGS[0];
    throw err;
  }
};

export const getRelatedSongs = async (id) => {
  try {
    const res = await api.get(`/api/songs/related/${id}/`);
    return res.data;
  } catch (err) {
    if (useMock(err)) return MOCK_SONGS.filter((s) => s.id !== Number(id)).slice(0, 6);
    throw err;
  }
};

export const getAudioUrl = (song) => {
  if (!song) return null;
  if (song.audio_file) {
    return song.audio_file.startsWith('http')
      ? song.audio_file
      : `${BASE_URL}${song.audio_file}`;
  }
  return null;
};

export { MOCK_SONGS };
export default api;

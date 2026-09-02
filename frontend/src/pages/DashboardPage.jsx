import { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, ChevronDown, Check, Frown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotes, deleteNote } from '../api/noteApi';
import { attachLocalMeta, toggleNoteFavorite } from '../utils/noteLocalMeta';
import NoteCard from '../components/NoteCard';
import ConfirmModal from '../components/ConfirmModal';
import Toast from '../components/Toast';
import ViewNoteModal from '../components/ViewNoteModal';

const SORTS = {
  latest: (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
  oldest: (a, b) => new Date(a.updated_at) - new Date(b.updated_at),
  favorites: (a, b) => Number(b.favorite) - Number(a.favorite) || new Date(b.updated_at) - new Date(a.updated_at),
};

const SORT_OPTIONS = [
  { value: 'latest', label: 'Latest modified' },
  { value: 'oldest', label: 'Oldest modified' },
  { value: 'favorites', label: 'Favorites first' },
];

export default function DashboardPage() {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [pendingDelete, setPendingDelete] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);

  const sortDropdownRef = useRef(null);
  const latestRequestId = useRef(0);

  const fetchNotes = useCallback(async (query) => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError('');
    try {
      const data = await getNotes(query);
      if (requestId === latestRequestId.current) {
        setNotes(attachLocalMeta(data));
      }
    } catch (err) {
      if (requestId === latestRequestId.current) {
        setError(err.response?.data?.message || 'Failed to load notes');
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchNotes(search), 300);
    return () => clearTimeout(timeout);
  }, [search, fetchNotes]);

  useEffect(() => {
    if (location.state?.toast) {
      setToast(location.state.toast);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  async function confirmDelete() {
    const id = pendingDelete;
    setPendingDelete(null);
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      setToast('Note deleted');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete note');
    }
  }

  function handleToggleFavorite(id) {
    const updated = toggleNoteFavorite(id);
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, favorite: updated.favorite } : n)));
  }



  function renderNotesArea() {
    if (loading) {
      return <p className="text-stone-500">Loading...</p>;
    }

    if (sortedNotes.length === 0) {
      if (search.trim()) {
        return (
          <div className="flex flex-col items-center justify-center py-16 text-stone-500">
            <Frown className="w-12 h-12 text-amber-600/70 mb-3 stroke-[1.75]" />
            <p className="text-stone-600 font-medium">No results found for "{search}"</p>
          </div>
        );
      }
      return (
        <div className="flex flex-col items-center justify-center py-16 text-stone-500">
          <BookOpen className="w-12 h-12 text-amber-600/70 mb-3 stroke-[1.75]" />
          <p className="text-stone-600 font-medium">No notes yet.</p>
          <p className="text-stone-600 font-medium">Create your first one.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedNotes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onDelete={setPendingDelete}
            onToggleFavorite={handleToggleFavorite}
            onView={setViewingNote}
          />
        ))}
      </div>
    );
  }



  const sortedNotes = [...notes].sort(SORTS[sortBy]);
  const favoriteCount = notes.filter((n) => n.favorite).length;
  const currentSortLabel = SORT_OPTIONS.find((opt) => opt.value === sortBy)?.label;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200">
      <nav className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-amber-200 shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-amber-700">🗒️ Notes Galore</h1>
        <button type="button" onClick={logoutUser} className="text-red-500 hover:text-red-700 font-semibold">Logout</button>
      </nav>

      <div className="p-6 md:p-10 max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-stone-800 mb-4">Welcome, {user?.name}</h2>
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4">
            <div className="grid grid-cols-2 gap-4 max-w-xs w-full">
              <div className="bg-white/80 rounded-xl border border-amber-200 p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{notes.length}</p>
                <p className="text-xs text-stone-500">Total notes</p>
              </div>
              <div className="bg-white/80 rounded-xl border border-amber-200 p-4 text-center">
                <p className="text-2xl font-bold text-amber-700">{favoriteCount}</p>
                <p className="text-xs text-stone-500">Favorited</p>
              </div>
            </div>
            <Link to="/notes/new" className="px-5 py-2 bg-amber-500 text-white rounded-2xl font-semibold hover:bg-amber-600 transition shadow-md">
              + New Note
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="text"
            placeholder="Search notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2 bg-white border border-stone-200/80 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 shadow-sm text-stone-800 text-sm placeholder-stone-400 transition-all"
          />

          <div className="relative" ref={sortDropdownRef}>
            <button 
              type="button"
              onClick={() => setIsSortOpen((prev) => !prev)}
              className="w-full sm:w-auto flex items-center justify-between gap-3 px-3.5 py-2 bg-white border border-stone-200/80 rounded-xl text-stone-700 text-sm font-medium shadow-sm hover:bg-stone-50/80 hover:border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400 transition-all cursor-pointer min-w-[170px]"
            >
              <span className="text-stone-500 font-normal">
                Sort: <span className="text-stone-800 font-medium">{currentSortLabel}</span>
              </span>
              <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${isSortOpen ? 'rotate-180 text-stone-600' : ''}`} />
            </button>

            {isSortOpen && (
              <div className="absolute right-0 mt-1.5 w-full min-w-[190px] bg-white border border-stone-100 rounded-xl shadow-lg shadow-stone-900/5 p-1 z-30 flex flex-col gap-0.5">
                {SORT_OPTIONS.map((option) => {
                  const isSelected = sortBy === option.value;
                  return (
                    <button 
                      key={option.value}
                      type="button"
                      onClick={() => {
                        setSortBy(option.value);
                        setIsSortOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors text-left ${
                        isSelected
                          ? 'bg-amber-50/80 text-amber-900 font-medium'
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span>{option.label}</span>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {renderNotesArea()}
      </div>

      <ConfirmModal
        open={pendingDelete !== null}
        title="Delete this note?"
        message="This can't be undone."
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <ViewNoteModal
        note={viewingNote}
        onClose={() => setViewingNote(null)}
      />

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
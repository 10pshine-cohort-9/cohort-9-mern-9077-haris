import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { getNote, createNote, updateNote } from '../api/noteApi';
import RichTextEditor from '../components/RichTextEditor';
import { getNoteMeta, setNoteColor, toggleNoteFavorite } from '../utils/noteLocalMeta';

const NOTE_COLORS = [
  { name: 'yellow', swatch: 'bg-yellow-300' },
  { name: 'orange', swatch: 'bg-orange-300' },
  { name: 'rose', swatch: 'bg-rose-300' },
  { name: 'sky', swatch: 'bg-sky-300' },
  { name: 'emerald', swatch: 'bg-emerald-300' },
  { name: 'violet', swatch: 'bg-violet-300' },
];

export default function NoteEditorPage() {
  const { id } = useParams();
  const isNew = !id;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [color, setColor] = useState('yellow');
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    getNote(id)
      .then((note) => {
        setTitle(note.title);
        setContent(note.content || '');
        const meta = getNoteMeta(id);
        setColor(meta.color);
        setIsFavorite(meta.favorite);
      })
      .catch(() => setError('Could not load that note'))
      .finally(() => setLoading(false));
  }, [id, isNew]);

  async function handleSave() {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      let noteId = id;
      if (isNew) {
        const created = await createNote({ title, content });
        noteId = created.id;
      } else {
        await updateNote(id, { title, content });
      }
      setNoteColor(noteId, color);
      navigate('/dashboard', { state: { toast: isNew ? 'Note created' : 'Note updated' } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  }

  function handleFavoriteClick() {
    if (isNew) return;
    const updated = toggleNoteFavorite(id);
    setIsFavorite(updated.favorite);
  }

  if (loading) return <p className="p-10 text-stone-500">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-100 to-amber-200 p-6 md:p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-amber-200 p-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-700">{isNew ? 'New Note' : 'Edit Note'}</h2>
          <button type="button"
            onClick={handleFavoriteClick}
            disabled={isNew}
            title={isNew ? 'Save the note first to favorite it' : 'Favorite'}
            className={isNew ? 'cursor-not-allowed opacity-40' : ''}
          >
            <Heart size={22} className={isFavorite ? 'fill-red-500 text-red-500' : 'text-stone-400'} />
          </button>
        </div>

        {error && (
          <div className="text-sm text-red-700 mb-4 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</div>
        )}

        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={200}
          className="w-full px-4 py-2 mb-4 border border-amber-200 rounded-md text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
        />

        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-stone-500 mr-1">Color:</span>
          {NOTE_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={() => setColor(c.name)}
              className={`w-6 h-6 rounded-full ${c.swatch} ${color === c.name ? 'ring-2 ring-offset-2 ring-stone-500' : ''}`}
              aria-label={c.name}
            />
          ))}
        </div>

        <RichTextEditor content={content} onChange={setContent} />

        <div className="flex gap-3 mt-6">
          <button type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-amber-500 text-white rounded-2xl font-semibold hover:bg-amber-600 transition shadow-md disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save'}
          </button>
          <Link to="/dashboard" className="px-6 py-2 text-stone-600 hover:text-stone-800 font-semibold">Cancel</Link>
        </div>
      </div>
    </div>
  );
}
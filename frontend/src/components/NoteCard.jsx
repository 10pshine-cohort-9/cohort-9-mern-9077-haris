import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const NOTE_COLORS = {
  yellow: 'bg-yellow-200',
  orange: 'bg-orange-200',
  rose: 'bg-rose-200',
  sky: 'bg-sky-200',
  emerald: 'bg-emerald-200',
  violet: 'bg-violet-200',
};

function stripHtml(html) {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function NoteCard({ note, onDelete, onToggleFavorite, onView }) {
  const preview = stripHtml(note.content).slice(0, 120);
  const rotation = note.id % 2 === 0 ? 'rotate-1' : '-rotate-2';
  const bgColor = NOTE_COLORS[note.color] || NOTE_COLORS.yellow;

  return (
    <div className={`relative p-5 rounded-bl-xl shadow-md hover:shadow-xl transition-all duration-200 ${bgColor} ${rotation} hover:rotate-0 hover:scale-105 group flex flex-col min-h-[200px]`}>
      
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-white/40 rotate-2 shadow-sm" />

      <div className="flex justify-between items-start mt-2 mb-2 gap-2">
        <h3 className="font-bold text-amber-900 text-lg truncate">{note.title}</h3>
        <button onClick={() => onToggleFavorite(note.id)} className="shrink-0" aria-label="Toggle favorite">
          <Heart size={18} className={note.favorite ? 'fill-red-500 text-red-500' : 'text-amber-900/30'} />
        </button>
      </div>

      <p className="text-amber-800/80 text-sm flex-1 line-clamp-3">
        {preview || 'No content yet'}
      </p>

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-amber-900/10">
        <span className="text-xs text-amber-900/50">
          {new Date(note.updated_at).toLocaleDateString()}
        </span>
        <div className="flex gap-3">
          <button 
            onClick={() => onView(note)} 
            className="text-blue-700 hover:text-blue-900 text-sm font-bold transition-colors"
          >
            View
          </button>
          <Link 
            to={`/notes/${note.id}`} 
            className="text-amber-700 hover:text-amber-900 text-sm font-bold transition-colors"
          >
            Edit
          </Link>
          <button 
            onClick={() => onDelete(note.id)} 
            className="text-red-500 hover:text-red-700 text-sm font-bold transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
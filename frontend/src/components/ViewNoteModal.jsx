import React from 'react';
import { X } from 'lucide-react';

const COLOR_MAP = {
  yellow: 'bg-yellow-100 border-yellow-200 text-amber-950',
  orange: 'bg-orange-100 border-orange-200 text-orange-950',
  rose: 'bg-rose-100 border-rose-200 text-rose-950',
  sky: 'bg-sky-100 border-sky-200 text-sky-950',
  emerald: 'bg-emerald-100 border-emerald-200 text-emerald-950',
  violet: 'bg-violet-100 border-violet-200 text-violet-950',
};

export default function ViewNoteModal({ note, onClose }) {
  if (!note) return null;

  const colorClass = COLOR_MAP[note.color] || COLOR_MAP.yellow;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div 
        className={`relative w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 sm:p-8 rounded-2xl shadow-2xl border ${colorClass} animate-in fade-in zoom-in-95 duration-200`}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-stone-500 hover:text-stone-800 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6 pb-4 border-b border-black/10 pr-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">{note.title}</h2>
          <p className="text-xs sm:text-sm opacity-70">
            Last modified: {new Date(note.updated_at || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <div 
          className="note-content text-stone-800"
          dangerouslySetInnerHTML={{ __html: note.content || '<p class="text-stone-400 italic">No content</p>' }}
        />
      </div>
    </div>
  );
}
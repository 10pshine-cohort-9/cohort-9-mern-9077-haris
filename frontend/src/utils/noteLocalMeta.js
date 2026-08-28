const STORAGE_KEY = 'notesGalore.noteMeta';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

const writeAll = (meta) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(meta));
  } catch {
  }
};

export function getNoteMeta(id) {
  return readAll()[id] || { color: 'yellow', favorite: false };
}

export function setNoteColor(id, color) {
  const all = readAll();
  all[id] = { ...getNoteMeta(id), color };
  writeAll(all);
  return all[id];
}

export function toggleNoteFavorite(id) {
  const all = readAll();
  const updated = { ...getNoteMeta(id), favorite: !getNoteMeta(id).favorite };
  all[id] = updated;
  writeAll(all);
  return updated;
}

export function attachLocalMeta(notes) {
  return notes.map((note) => ({ ...note, ...getNoteMeta(note.id) }));
}
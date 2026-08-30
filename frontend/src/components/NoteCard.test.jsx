import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import NoteCard from './NoteCard';

const mockNote = {
  id: 1,
  title: 'Test Note',
  content: '<p>Some <strong>content</strong> here</p>',
  color: 'yellow',
  favorite: false,
  updated_at: '2026-01-01T00:00:00.000Z',
};

function renderCard(note = mockNote, props = {}) {
  return render(
    <MemoryRouter>
      <NoteCard note={note} onDelete={() => {}} onToggleFavorite={() => {}} onView={() => {}} {...props} />
    </MemoryRouter>
  );
}

describe('NoteCard', () => {
  it('renders the title and a plain-text preview of the content', () => {
    renderCard();
    expect(screen.getByText('Test Note')).toBeInTheDocument();
    expect(screen.getByText(/Some content here/)).toBeInTheDocument();
  });

  it('calls onView with the note when View is clicked', () => {
    const onView = vi.fn();
    renderCard(mockNote, { onView });
    fireEvent.click(screen.getByText('View'));
    expect(onView).toHaveBeenCalledWith(mockNote);
  });

  it('calls onDelete with the note id when Delete is clicked', () => {
    const onDelete = vi.fn();
    renderCard(mockNote, { onDelete });
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('shows a filled heart when the note is favorited', () => {
    const { container } = renderCard({ ...mockNote, favorite: true });
    expect(container.querySelector('svg')).toHaveClass('fill-red-500');
  });
});
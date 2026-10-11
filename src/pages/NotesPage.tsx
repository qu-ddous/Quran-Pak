import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText, Plus, Edit3, Trash2, Save, X, ExternalLink, AlertTriangle } from 'lucide-react';
import { getNotes, saveNote, deleteNote, generateId } from '../db/userDb';
import { useToast } from '../context/ToastContext';
import type { Note } from '../db/userDb';
import { LoadingSpinner, EmptyState, PageHeader } from '../components/ui/SharedComponents';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState({ surahNumber: 1, ayahNumber: 1, text: '' });
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'Notes — Noor Quran';
    getNotes().then(setNotes).finally(() => setLoading(false));
  }, []);

  const startEdit = (note: Note) => {
    setEditingId(note.id);
    setEditText(note.text);
  };

  const saveEdit = async (note: Note) => {
    const trimmed = editText.trim();
    if (!trimmed) { showToast('Note cannot be empty', 'error'); return; }
    const updated: Note = { ...note, text: trimmed, updatedAt: Date.now() };
    await saveNote(updated);
    setNotes((prev) => prev.map((n) => (n.id === note.id ? updated : n)));
    setEditingId(null);
    showToast('Note saved', 'success');
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this note? This cannot be undone.')) return;
    await deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    showToast('Note deleted', 'info');
  };

  const addNote = async () => {
    const trimmed = newNote.text.trim();
    if (!trimmed) { showToast('Note cannot be empty', 'error'); return; }
    if (newNote.surahNumber < 1 || newNote.surahNumber > 114) { showToast('Invalid Surah number', 'error'); return; }
    const note: Note = {
      id: generateId(),
      surahNumber: newNote.surahNumber,
      ayahNumber: newNote.ayahNumber,
      text: trimmed,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await saveNote(note);
    setNotes((prev) => [note, ...prev]);
    setNewNote({ surahNumber: 1, ayahNumber: 1, text: '' });
    setShowAdd(false);
    showToast('Note added', 'success');
  };

  if (loading) return <LoadingSpinner text="Loading notes…" />;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 64px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <PageHeader
          title="My Notes"
          subtitle="Personal notes attached to Surah and Ayah references. Stored locally on this device only."
        />
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary" style={{ flexShrink: 0, marginTop: 4 }}>
          <Plus size={16} aria-hidden="true" /> Add Note
        </button>
      </div>

      {/* Privacy notice */}
      <div style={{ display: 'flex', gap: 8, padding: '10px 14px', background: '#fff8e1', border: '1px solid #f59e0b', borderRadius: 8, marginBottom: 24, fontSize: '0.82rem', color: '#92400e' }}>
        <AlertTriangle size={14} style={{ flexShrink: 0, marginTop: 1 }} aria-hidden="true" />
        Notes are stored only on this device in your browser's IndexedDB. They are never sent to a server. Clearing your browser data will delete them.
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700 }}>New Note</h3>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Surah</label>
              <input type="number" min={1} max={114} value={newNote.surahNumber}
                onChange={(e) => setNewNote(p => ({ ...p, surahNumber: parseInt(e.target.value) || 1 }))}
                style={{ width: 80, padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--color-text-muted)', marginBottom: 4 }}>Ayah</label>
              <input type="number" min={1} value={newNote.ayahNumber}
                onChange={(e) => setNewNote(p => ({ ...p, ayahNumber: parseInt(e.target.value) || 1 }))}
                style={{ width: 80, padding: '8px 10px', border: '1.5px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', fontFamily: 'inherit' }}
              />
            </div>
          </div>
          <textarea
            value={newNote.text}
            onChange={(e) => setNewNote(p => ({ ...p, text: e.target.value }))}
            placeholder="Write your note here…"
            aria-label="Note text"
            rows={4}
            style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--color-border)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button onClick={addNote} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.875rem' }}>
              <Save size={14} aria-hidden="true" /> Save Note
            </button>
            <button onClick={() => setShowAdd(false)} className="btn-ghost" style={{ padding: '8px 14px', fontSize: '0.875rem' }}>
              <X size={14} aria-hidden="true" /> Cancel
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 ? (
        <EmptyState
          title="No notes yet"
          message="Tap 'Add Note' to attach a personal note to any Surah and Ayah reference."
          icon={<FileText size={40} style={{ color: 'var(--color-text-muted)', opacity: 0.4 }} aria-hidden="true" />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notes.map((note) => (
            <div key={note.id} className="card" style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <div style={{ fontWeight: 700, color: 'var(--color-brand)', fontSize: '0.875rem' }}>
                  Surah {note.surahNumber}, Ayah {note.ayahNumber}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Link to={`/surah/${note.surahNumber}#ayah-${note.ayahNumber}`} aria-label={`Open Surah ${note.surahNumber} ayah ${note.ayahNumber}`} className="btn-ghost" style={{ padding: 6 }}>
                    <ExternalLink size={14} aria-hidden="true" />
                  </Link>
                  <button onClick={() => startEdit(note)} aria-label="Edit note" className="btn-ghost" style={{ padding: 6 }}>
                    <Edit3 size={14} aria-hidden="true" />
                  </button>
                  <button onClick={() => handleDelete(note.id)} aria-label="Delete note" className="btn-ghost" style={{ padding: 6, color: '#c0392b' }}>
                    <Trash2 size={14} aria-hidden="true" />
                  </button>
                </div>
              </div>

              {editingId === note.id ? (
                <>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    aria-label="Edit note text"
                    rows={4}
                    style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--color-brand)', borderRadius: 6, background: 'var(--color-surface)', color: 'var(--color-text)', fontSize: '0.9rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                    <button onClick={() => saveEdit(note)} className="btn-primary" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
                      <Save size={12} aria-hidden="true" /> Save
                    </button>
                    <button onClick={() => setEditingId(null)} className="btn-ghost" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                      <X size={12} aria-hidden="true" /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ margin: '0 0 8px', color: 'var(--color-text)', lineHeight: 1.6, fontSize: '0.93rem', whiteSpace: 'pre-wrap' }}>
                    {note.text}
                  </p>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    Updated {new Date(note.updatedAt).toLocaleDateString()}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

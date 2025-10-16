import type { Note } from '../../types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  readonly notes: Note[];
  readonly onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (!notes.length) {
    return <p className={styles.empty}>No notes yet</p>;
  }

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.item}>
          <h3 className={styles.title}>{note.title}</h3>
          <p className={styles.content}>{note.content}</p>
          <span className={styles.tag}>{note.tag}</span>
          <button
            type="button"
            className={styles.delete}
            onClick={() => onDelete(note.id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
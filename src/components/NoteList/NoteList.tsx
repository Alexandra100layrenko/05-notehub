import type { Note } from '../../types/note';
import styles from './NoteList.module.css';

interface NoteListProps {
  readonly notes: Note[];
  readonly onDelete: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  if (!notes || notes.length === 0) return null;

  return (
    <ul className={styles.list}>
      {notes.map((note) => (
        <li key={note.id} className={styles.listItem}>
          <h2 className={styles.title}>{note.title}</h2>
          <p className={styles.content}>{note.content}</p>
          <div className={styles.footer}>
            <span className={styles.tag}>{note.tag}</span>
            <button className={styles.button} onClick={() => onDelete(note.id)} type="button">
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

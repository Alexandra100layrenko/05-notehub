import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '../../services/noteService';
import styles from './NoteList.module.css';

interface NoteListProps {
  readonly notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDelete = (id: string) => {
    mutation.mutate(id);
  };

  if (!notes.length) {
    return <p className={styles.empty}>Нотаток поки немає</p>;
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
            onClick={() => handleDelete(note.id)}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? 'Видаляю...' : 'Видалити'}
          </button>
        </li>
      ))}
    </ul>
  );
}

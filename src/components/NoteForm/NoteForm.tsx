import { useState } from 'react';
import type { NoteTag } from '../../types/note';
import styles from './NoteForm.module.css';

interface NoteFormProps {
  readonly onSubmit: (payload: { title: string; content: string; tag: NoteTag }) => void;
  readonly onCancel: () => void;
}

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState<NoteTag>('work');

  const titleId = 'note-title';
  const contentId = 'note-content';
  const tagId = 'note-tag';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, tag });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit} autoComplete="off">
      <div className={styles.field}>
        <label htmlFor={titleId}>Title</label>
        <input
          type="text"
          id={titleId}
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={contentId}>Content</label>
        <textarea
          id={contentId}
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor={tagId}>Tag</label>
        <select
          id={tagId}
          name="tag"
          value={tag}
          onChange={(e) => setTag(e.target.value as NoteTag)}
        >
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
        </select>
      </div>

      <div className={styles.actions}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
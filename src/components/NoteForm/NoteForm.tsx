import { Formik, Form, Field, ErrorMessage as FormikErrorMessage } from 'formik'
import * as Yup from 'yup';
import styles from './NoteForm.module.css';
import type { Note, NoteTag } from '../../types/note';

interface NoteFormProps {
  readonly onSubmit: (payload: Omit<Note, 'id'>) => void;
  readonly onCancel: () => void;
}

const tags: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const Schema = Yup.object().shape({
  title: Yup.string().min(3).max(50).required('Title is required'),
  content: Yup.string().max(500),
  tag: Yup.mixed().oneOf(tags).required('Tag is required'),
});

export default function NoteForm({ onSubmit, onCancel }: NoteFormProps) {
  return (
    <Formik
      initialValues={{ title: '', content: '', tag: 'Todo' as NoteTag }}
      validationSchema={Schema}
      onSubmit={(values, { setSubmitting }) => {
        onSubmit(values);
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" name="title" className={styles.input} />
            <FormikErrorMessage name="title" component="div" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={styles.textarea} />
            <FormikErrorMessage name="content" component="div" className={styles.error} />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={styles.select}>
              {tags.map((t) => <option key={t} value={t}>{t}</option>)}
            </Field>
            <FormikErrorMessage name="tag" component="div" className={styles.error} />
          </div>

          <div className={styles.actions}>
            <button type="button" className={styles.cancelButton} onClick={onCancel}>Cancel</button>
            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>Create note</button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

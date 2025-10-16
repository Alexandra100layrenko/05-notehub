import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';

import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import type { FetchNotesResponse } from '../../services/noteService';
import type { Note } from '../../types/note';
import styles from './App.module.css';

export default function App() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, isSuccess, isFetching } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, debouncedSearch),
    placeholderData: (prev) => prev ?? undefined,
  });

  const createMutation = useMutation({
    mutationFn: (payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => createNote(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note created');
      setIsModalOpen(false);
      setPage(1);
    },
    onError: () => toast.error('Failed to create note'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      toast.success('Note deleted');
    },
    onError: () => toast.error('Failed to delete note'),
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch notes.');
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data?.notes?.length === 0) {
      toast('No notes found.', { icon: 'ℹ️' });
    }
  }, [isSuccess, data]);

  const handleCreate = (payload: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => createMutation.mutate(payload);
  const handleDelete = (id: string) => deleteMutation.mutate(id);

  return (
    <div className={styles.app}>
      <header className={styles.toolbar}>
        <SearchBox
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
        {data && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={page - 1}
            onPageChange={(selected) => setPage(selected + 1)}
          />
        )}
        <button className={styles.button} onClick={() => setIsModalOpen(true)}>
          Create note +
        </button>
      </header>

      <main>
        {isLoading || isFetching ? <Loader /> : null}
        {isError && <ErrorMessage />}
        {data?.notes?.length ? <NoteList notes={data.notes} onDelete={handleDelete} /> : null}
      </main>

      {isModalOpen && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <NoteForm onSubmit={handleCreate} onCancel={() => setIsModalOpen(false)} />
        </Modal>
      )}

      <Toaster position="top-right" />
    </div>
  );
}
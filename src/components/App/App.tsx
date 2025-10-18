import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';

import SearchBox from '../SearchBox/SearchBox';
import NoteList from '../NoteList/NoteList';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import Pagination from '../Pagination/Pagination';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import Loader from '../Loader/Loader';

import { fetchNotes, type FetchNotesResponse } from '../../services/noteService';
import styles from './App.module.css';

export default function App() {
  const [page, setPage] = useState<number>(1);
  const [search, setSearch] = useState<string>('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const { data, isLoading, isError, isFetching, isSuccess } = useQuery<FetchNotesResponse>({
    queryKey: ['notes', page, debouncedSearch, perPage],
    queryFn: () => fetchNotes(page, perPage, debouncedSearch),
    placeholderData: (prev) => prev,
  });

  useEffect(() => {
    if (isError) toast.error('Failed to fetch notes.');
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data?.notes?.length === 0) {
      toast('No notes found.', { icon: 'ℹ️' });
    }
  }, [isSuccess, data]);

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
        {data?.notes?.length ? <NoteList notes={data.notes} /> : null}
      </main>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>

      <Toaster position="top-right" />
    </div>
  );
}

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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch] = useDebounce(search, 500);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const perPage = 12;

  const { data, isLoading, isError, isFetching, isSuccess, error } = useQuery<
    FetchNotesResponse,
    Error,
    FetchNotesResponse,
    [string, number, string, number]
  >({
    queryKey: ['notes', page, debouncedSearch, perPage],
    queryFn: () => fetchNotes({ page, perPage, search: debouncedSearch }),
    staleTime: 1000, // 1 секунда, данные считаются свежими
  });

  // Ошибки запроса
  useEffect(() => {
    if (isError && error) {
      toast.error(`Failed to fetch notes: ${error.message}`);
    }
  }, [isError, error]);

  // Пустой результат
  useEffect(() => {
    if (isSuccess && data?.notes.length === 0) {
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

        {data?.totalPages && data.totalPages > 1 && (
          <Pagination
            pageCount={data.totalPages}
            forcePage={page - 1}
            onPageChange={(selected) => setPage(selected + 1)}
          />
        )}

        <button
          type="button"
          className={styles.button}
          onClick={() => setIsModalOpen(true)}
        >
          Create note +
        </button>
      </header>

      <main>
        {(isLoading || isFetching) && <Loader />}
        {isError && <ErrorMessage />}
        {data?.notes?.length ? <NoteList notes={data.notes} /> : null}
      </main>

      {isModalOpen && (<Modal onClose={() => setIsModalOpen(false)}>
        <NoteForm onCancel={() => setIsModalOpen(false)} />
      </Modal>)
      }

      <Toaster position="top-right" />
    </div>
  );
}
import axios, { AxiosError } from 'axios';
import type { Note } from '../types/note';

const API_BASE = 'https://notehub-public.goit.study/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

/*console.log('TOKEN:', import.meta.env.VITE_NOTEHUB_TOKEN)*/

export interface FetchNotesResponse {
  data: Note[];        // массив заметок
  page: number;
  perPage: number;
  totalPages: number;
  totalItems: number;
}

export const fetchNotes = async (
  page = 1,
  perPage = 12,
  search = ''
): Promise<FetchNotesResponse> => {
  try {
    const res = await api.get<FetchNotesResponse>('/notes', {
      params: { page, perPage, search },
    });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ fetchNotes error:', err.message);
    throw new Error('Failed to fetch notes');
  }
};

export const createNote = async (
  note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Note> => {
  try {
    const res = await api.post<Note>('/notes', note);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ createNote error:', err.message);
    throw new Error('Failed to create note');
  }
};

export const deleteNote = async (id: string): Promise<{ id: string }> => {
  try {
    const res = await api.delete<{ id: string }>(`/notes/${id}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    console.error('❌ deleteNote error:', err.message);
    throw new Error('Failed to delete note');
  }
};

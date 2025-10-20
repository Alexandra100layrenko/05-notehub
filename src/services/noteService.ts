// src/services/noteService.ts
import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_URL = import.meta.env.VITE_API_URL;
const USER_EMAIL = import.meta.env.VITE_USER_EMAIL;

let API_TOKEN = ''; 

// Отримання токена по email
const getToken = async () => {
  if (!API_TOKEN) {
    const { data } = await axios.post<{ token: string }>(
      `${API_URL}/auth`,
      { email: USER_EMAIL },
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
    );
    API_TOKEN = data.token;
  }
  return API_TOKEN;
};

// Інстанс axios
const api = axios.create({
  baseURL: API_URL,
  headers: { Accept: 'application/json' },
});

// Додаємо токен у кожний запит
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Тип для відповіді на список нотаток
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// GET /notes
export const fetchNotes = async (
  page = 1,
  perPage = 12,
  search = '',
  tag?: NoteTag,
  sortBy: 'created' | 'updated' = 'created'
): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search, tag, sortBy },
  });
  return data;
};

// POST /notes
export const createNote = async (note: {
  title: string;
  content: string | null;   // ✅ тепер відповідає API
  tag: NoteTag;
}): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', note);
  return data;
};

// DELETE /notes/{id}
export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};
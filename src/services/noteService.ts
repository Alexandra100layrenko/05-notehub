// src/services/noteService.ts
import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_URL = import.meta.env.VITE_API_URL;
const USER_EMAIL = import.meta.env.VITE_USER_EMAIL;

let API_TOKEN = ''; 


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


const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
});


api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Ответы API
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
  content: string;
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

// GET /notes/{id}
export const getNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

// PATCH /notes/{id}
export const updateNote = async (
  id: string,
  note: Partial<{ title: string; content: string; tag: NoteTag }>
): Promise<Note> => {
  const { data } = await api.patch<Note>(`/notes/${id}`, note);
  return data;
};

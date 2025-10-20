// src/services/noteService.ts
import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios';
import type { Note, NoteTag } from '../types/note';

const API_URL = import.meta.env.VITE_API_URL;
const USER_EMAIL = import.meta.env.VITE_USER_EMAIL;

let API_TOKEN: string | null = null;

// Получаем токен один раз
const getToken = async (): Promise<string> => {
  if (!API_TOKEN) {
    const response = await axios.post<{ token: string }>(
      `${API_URL}/auth`,
      { email: USER_EMAIL },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );
    API_TOKEN = response.data.token;
  }
  return API_TOKEN;
};

// Инстанс axios без токена
const api = axios.create({
  baseURL: API_URL,
  headers: {
    Accept: 'application/json',
  },
});

// Подставляем токен перед каждым запросом
api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();
  // Гарантируем, что headers точно есть
  config.headers = config.headers ?? {};
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search: string;
  tag?: NoteTag;
  sortBy: 'created' | 'updated';
}

// Fetch notes
export const fetchNotes = async ({
  page = 1,
  perPage = 12,
  search = '',
  tag,
  sortBy = 'created',
}: Partial<FetchNotesParams> = {}): Promise<FetchNotesResponse> => {
  const params: FetchNotesParams = { page, perPage, search, sortBy };
  if (tag) params.tag = tag;
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
};

// Create note
export interface CreateNotePayload {
  title: string;
  content?: string | null;
  tag: NoteTag;
}

export const createNote = async (note: CreateNotePayload): Promise<Note> => {
  // Минимальная валидация на клиенте
  if (!note.title || note.title.trim().length < 3) {
    throw new Error('Title must be at least 3 characters');
  }
  if (!note.tag) {
    throw new Error('Tag is required');
  }

  const payload = {
    ...note,
    content: note.content?.trim() || null,
  };

  const { data } = await api.post<Note>('/notes', payload);
  return data;
};

// Delete note
export const deleteNote = async (id: string): Promise<Note> => {
  if (!id) {
    throw new Error('Note ID is required');
  }
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

import { ApiError } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export function getApiUrl(): string {
  return API_URL;
}

export function imageUrl(path: string): string {
  return `${API_URL}${path}`;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers);

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(data.message || 'Error en la solicitud', data.field);
  }

  return data as T;
}

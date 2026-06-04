import * as SecureStore from 'expo-secure-store';
import { TOKEN_KEY } from '@/constants/storage';

export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function buildHeaders(): Promise<Record<string, string>> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: 'Request failed' })) as { message?: string };
    throw new ApiError(res.status, body.message ?? 'Request failed');
  }
  return res.json() as Promise<T>;
}

export const api = {
  get: async <T>(url: string): Promise<T> => {
    const headers = await buildHeaders();
    return fetch(url, { headers }).then(res => handleResponse<T>(res));
  },

  post: async <T>(url: string, body?: unknown): Promise<T> => {
    const headers = await buildHeaders();
    return fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    }).then(res => handleResponse<T>(res));
  },

  put: async <T>(url: string, body?: unknown): Promise<T> => {
    const headers = await buildHeaders();
    return fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    }).then(res => handleResponse<T>(res));
  },

  patch: async <T>(url: string): Promise<T> => {
    const headers = await buildHeaders();
    return fetch(url, { method: 'PATCH', headers }).then(res => handleResponse<T>(res));
  },

  delete: async (url: string): Promise<{ message: string }> => {
    const headers = await buildHeaders();
    return fetch(url, { method: 'DELETE', headers }).then(res => handleResponse<{ message: string }>(res));
  },
};

import { API_URL } from '@/constants/config';
import { TOKEN_KEY } from '@/constants/storage';

/** Custom error that carries the HTTP status code alongside the message. */
export class ApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

function buildHeaders(): Record<string, string> {
  const token = localStorage.getItem(TOKEN_KEY);
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
  get: <T>(path: string) =>
    fetch(`${API_URL}${path}`, { headers: buildHeaders() })
      .then(res => handleResponse<T>(res)),

  post: <T>(path: string, body?: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(res => handleResponse<T>(res)),

  put: <T>(path: string, body?: unknown) =>
    fetch(`${API_URL}${path}`, {
      method: 'PUT',
      headers: buildHeaders(),
      body: JSON.stringify(body),
    }).then(res => handleResponse<T>(res)),

  patch: <T>(path: string) =>
    fetch(`${API_URL}${path}`, { method: 'PATCH', headers: buildHeaders() })
      .then(res => handleResponse<T>(res)),

  delete: (path: string) =>
    fetch(`${API_URL}${path}`, { method: 'DELETE', headers: buildHeaders() })
      .then(res => handleResponse<{ message: string }>(res)),
};

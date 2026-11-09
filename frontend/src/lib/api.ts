export class ApiError extends Error { constructor(public code: string) { super(code); } }
export async function api<T>(path: string, body?: unknown, method?: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch('/api' + path, {
      method: method || (body === undefined ? 'GET' : 'POST'),
      credentials: 'same-origin',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(15000),
    });
  } catch { throw new ApiError('SERVICE_UNAVAILABLE'); }
  const data = await response.json().catch(() => ({ code: 'SERVICE_UNAVAILABLE' }));
  if (!response.ok) throw new ApiError(data.code || 'SERVICE_UNAVAILABLE');
  return data as T;
}

/**
 * API Client - Requisições autenticadas via proxy Next.js
 *
 * O Next.js valida autenticação Logto no servidor e repassa para Spring Boot
 * Tokens nunca saem do servidor (HttpOnly + proxy)
 */

/**
 * Faz requisição GET através do proxy autenticado
 */
export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(`/api/proxy${path}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<T>(response);
}

/**
 * Faz requisição POST através do proxy autenticado
 */
export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/proxy${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return handleResponse<T>(response);
}

/**
 * Faz requisição DELETE através do proxy autenticado
 */
export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(`/api/proxy${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return handleResponse<T>(response);
}

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const detail = typeof payload === 'string' ? payload : JSON.stringify(payload);
    throw new Error(`API Error: ${response.status} ${response.statusText} - ${detail}`);
  }

  return payload as T;
}

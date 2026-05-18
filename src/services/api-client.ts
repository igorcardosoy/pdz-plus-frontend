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
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
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
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
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
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

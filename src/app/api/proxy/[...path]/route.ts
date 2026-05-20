/**
 * Proxy genérico para requisições autenticadas para Spring Boot
 * 
 * Uso:
 * GET /api/proxy/movies → GET http://localhost:8080/movies (com auth)
 * POST /api/proxy/history → POST http://localhost:8080/history (com auth)
 */

import { logtoConfig } from '@/app/logto';
import { getAccessToken, getLogtoContext } from '@logto/next/server-actions';
import { CookieStorage, PersistKey } from '@logto/node';
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_PDZ_API_URL || 'http://localhost:8080';

export async function GET(request: NextRequest) {
  return proxyRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return proxyRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return proxyRequest(request, 'DELETE');
}

async function proxyRequest(request: NextRequest, method: string) {
  try {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated || !claims) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const resourceIndicator = process.env.LOGTO_API_INDICATOR || '';
    let accessToken: string | null = null;
    let tokenSource: 'access_token' | 'id_token' = 'access_token';

    if (resourceIndicator) {
      try {
        accessToken = await getAccessToken(logtoConfig, resourceIndicator);
      } catch (err) {
        console.warn('Failed to get access token with resource indicator:', String(err));
      }
    }

    if (!accessToken || accessToken.split('.').length !== 3) {
      const idToken = await getIdTokenFromRequest(request);

      if (!idToken) {
        return NextResponse.json(
          {
            error: 'No JWT available',
            help: 'Configure a API Resource ou permita ID token para o backend.',
          },
          { status: 401 }
        );
      }

      accessToken = idToken;
      tokenSource = 'id_token';
    }

    const url = new URL(request.url);
    const pathArray = url.pathname.split('/');
    const apiPath = '/' + pathArray.slice(3).join('/');

    const backendUrl = `${BACKEND_URL}${apiPath}${url.search}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // JWT para autenticação no backend
      'X-User-Id': claims.sub || '', // Passa ID do usuário
      'X-User-Name': (claims.name || claims.username || '') as string,
    };

    let body: string | undefined = undefined;
    if (['POST', 'PUT'].includes(method)) {
      body = await request.text();
    }

    console.info('[proxy] backendUrl=%s tokenSource=%s', backendUrl, tokenSource);

    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    const contentType = response.headers.get('content-type') || '';
    const isJson = contentType.includes('application/json');
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Backend request failed',
          status: response.status,
          backendUrl,
          tokenSource,
          tokenMeta: getJwtMeta(accessToken),
          backendResponse: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getIdTokenFromRequest(request: NextRequest) {
  const rawCookies = request.headers.get('cookie') || '';
  const cookieList: Record<string, string> = {};

  rawCookies.split(';').map(s => s.trim()).filter(Boolean).forEach(pair => {
    const [k, ...rest] = pair.split('=');
    if (!k) return;
    const rawValue = rest.join('=') || '';
    try {
      cookieList[k] = decodeURIComponent(rawValue);
    } catch {
      cookieList[k] = rawValue;
    }
  });

  const storage = new CookieStorage({
    cookieKey: `logto_${logtoConfig.appId}`,
    encryptionKey: logtoConfig.cookieSecret,
    isSecure: logtoConfig.cookieSecure,
    getCookie: (name) => cookieList[name],
    setCookie: () => {},
  });

  await storage.init();
  return storage.getItem(PersistKey.IdToken);
}

function getJwtMeta(token: string | null) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(parts[1].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8')
    );

    return {
      aud: payload.aud,
      iss: payload.iss,
      sub: payload.sub,
      exp: payload.exp,
    };
  } catch {
    return null;
  }
}

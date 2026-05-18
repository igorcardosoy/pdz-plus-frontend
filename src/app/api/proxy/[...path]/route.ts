/**
 * Proxy genérico para requisições autenticadas para Spring Boot
 * 
 * Uso:
 * GET /api/proxy/movies → GET http://localhost:8080/movies (com auth)
 * POST /api/proxy/history → POST http://localhost:8080/history (com auth)
 */

import { logtoConfig } from '@/app/logto';
import { getAccessToken, getLogtoContext } from '@logto/next/server-actions';
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

    const accessToken = await getAccessToken(logtoConfig, 
      process.env.LOGTO_API_INDICATOR || 'https://backend.pdz.li'
    );

    if (!accessToken) {
      return NextResponse.json(
        { error: 'No access token available' },
        { status: 401 }
      );
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

    const response = await fetch(backendUrl, {
      method,
      headers,
      body,
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

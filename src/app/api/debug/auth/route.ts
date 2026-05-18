import { logtoConfig } from '@/app/logto';
import { getAccessToken, getLogtoContext } from '@logto/next/server-actions';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

    if (!isAuthenticated || !claims) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const accessToken = await getAccessToken(
      logtoConfig,
      process.env.LOGTO_API_INDICATOR || 'https://backend.pdz.li'
    );

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token available' }, { status: 401 });
    }

    // Fazer uma requisição ao debug endpoint do backend
    const backendUrl = `${process.env.NEXT_PUBLIC_PDZ_API_URL || 'http://localhost:8080'}/pdz-api/debug/me`;

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'X-User-Id': claims.sub || '',
        'X-User-Name': (claims.name || claims.username || '') as string,
      },
    });

    const data = await response.json();

    return NextResponse.json({
      frontend: {
        isAuthenticated,
        claims,
        accessToken: accessToken.substring(0, 50) + '...',
        audience: process.env.LOGTO_API_INDICATOR || 'https://backend.pdz.li',
      },
      backend: {
        status: response.status,
        data,
      },
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    );
  }
}


import { logtoConfig } from '@/app/logto';
import { getAccessToken, getLogtoContext } from '@logto/next/server-actions';
import { CookieStorage, PersistKey } from '@logto/node';
import { NextRequest, NextResponse } from 'next/server';

// Agora aceitamos o objeto NextRequest para inspecionar cookies/headers do pedido
export async function GET(request: NextRequest) {
  try {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
    // informações adicionais de debug: cookies e headers
    const rawCookies = request.headers.get('cookie') || '';
    const cookieList: Record<string, string> = {};
    // preencher cookieList com pares simples
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

    if (!isAuthenticated || !claims) {
      return NextResponse.json({ error: 'Not authenticated', cookies: cookieList, rawCookies }, { status: 401 });
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
      const idToken = await getIdTokenFromCookies(cookieList);

      if (!idToken) {
        return NextResponse.json(
          {
            error: 'No JWT available',
            details: 'Neither access token nor ID token is available.',
            resourceIndicator,
          },
          { status: 401 }
        );
      }

      accessToken = idToken;
      tokenSource = 'id_token';
    }

    // Para facilitar o debug local, não chamamos o backend aqui — apenas retornamos o token
    // e o contexto Logto para que você possa inspecionar/colar o token no jwt.io ou testar via curl.
    return NextResponse.json({
      frontend: {
        isAuthenticated: true,
        sub: claims.sub,
        name: claims.name,
        email: claims.email,
        // full token included for debugging only (remover em prod)
        accessToken: accessToken,
        logtoContext: { isAuthenticated, claims },
        resourceIndicator: resourceIndicator || null,
        tokenSource,
      },
      cookies: cookieList,
      rawCookies,
    });
  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: String(error),
        help: 'Verifique os logs do servidor Next.js',
      },
      { status: 500 }
    );
  }
}

async function getIdTokenFromCookies(cookies: Record<string, string>) {
  const storage = new CookieStorage({
    cookieKey: `logto_${logtoConfig.appId}`,
    encryptionKey: logtoConfig.cookieSecret,
    isSecure: logtoConfig.cookieSecure,
    getCookie: (name) => cookies[name],
    setCookie: () => {},
  });

  await storage.init();
  return storage.getItem(PersistKey.IdToken);
}







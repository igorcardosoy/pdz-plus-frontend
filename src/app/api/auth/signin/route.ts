import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: 'Missing credentials' }, { status: 400 });
    }

    const apiUrl = process.env.NEXT_PUBLIC_PDZ_API_URL;
    if (!apiUrl) {
      return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
    }

    const backendResp = await fetch(`${apiUrl}/auth/signin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    if (!backendResp.ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const data = await backendResp.json();
    const token = data.token;

    if (!token) {
      return NextResponse.json({ error: 'Token not returned' }, { status: 500 });
    }

    const res = NextResponse.json(data);
    const maxAge = 60 * 60 * 24; // 1 day
    res.cookies.set('jwt', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge,
      secure: process.env.NODE_ENV === 'production',
    });
    return res;
  } catch (e: any) {
    return NextResponse.json({ error: 'Login error' }, { status: 500 });
  }
}

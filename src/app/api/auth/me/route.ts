import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('jwt')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const apiUrl = process.env.NEXT_PUBLIC_PDZ_API_URL;
  if (!apiUrl) {
    return NextResponse.json({ error: 'API base URL not configured' }, { status: 500 });
  }

  try {
    const backendResp = await fetch(`${apiUrl}/users`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!backendResp.ok) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const user = await backendResp.json();
    return NextResponse.json(user);
  } catch (e: any) {
    return NextResponse.json({ error: 'Error fetching user' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const query = url.searchParams.get('query');
  const limit = url.searchParams.get('limit') || '10';
  const apikey = process.env.JACKETT_API_KEY;
  const jackettUrl = process.env.JACKETT_API_URL;

  if (!jackettUrl || !apikey) {
    return NextResponse.json({ error: 'Jackett config missing' }, { status: 500 });
  }

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  const endpoint = `${jackettUrl}/api/v2.0/indexers/all/results?query=${encodeURIComponent(
    query
  )}&limit=${limit}&apikey=${apikey}`;

  try {
    const resp = await fetch(endpoint, { cache: 'no-store' });
    if (!resp.ok) {
      return NextResponse.json({ error: 'Jackett error', status: resp.status }, { status: resp.status });
    }
    const data = await resp.json();
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: 'Proxy error', details: e.message }, { status: 500 });
  }
}

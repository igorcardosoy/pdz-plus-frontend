import { getLogtoContext } from '@logto/next/server-actions';
import { NextRequest, NextResponse } from 'next/server';
import { logtoConfig } from '../../../logto';

export async function GET(req: NextRequest) {
  const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);
  
  if (!isAuthenticated) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  return NextResponse.json(claims);
}

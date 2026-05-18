import { signOut } from '@logto/next/server-actions';
import { NextRequest, NextResponse } from 'next/server';
import { logtoConfig } from '../../../logto';

export async function GET(req: NextRequest) {
  await signOut(logtoConfig);
  return NextResponse.json({ success: true });
}

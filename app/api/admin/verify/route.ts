import { NextResponse } from 'next/server';
import { verifyAdminPassword } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = body?.password as string | undefined;
    if (verifyAdminPassword(password)) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}

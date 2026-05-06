import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { fetchOrdersFromDb } from '@/lib/db/orders';

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json([]);
  }

  try {
    const orders = await fetchOrdersFromDb();
    return NextResponse.json(orders);
  } catch (error) {
    console.error('admin orders GET:', error);
    return NextResponse.json(
      { error: 'Failed to load orders' },
      { status: 500 }
    );
  }
}

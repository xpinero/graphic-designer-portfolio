import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { fetchOrderById, updateOrderStatus } from '@/lib/db/orders';
import type { OrderStatus } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

const STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'completed',
  'cancelled',
];

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    const order = await fetchOrderById(id);
    if (!order) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    console.error('admin order GET:', error);
    return NextResponse.json({ error: 'Failed to load order' }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let body: { password?: string; status?: OrderStatus };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!isAdminRequest(request, body.password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  if (!body.status || !STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  try {
    await updateOrderStatus(id, body.status);
    const order = await fetchOrderById(id);
    return NextResponse.json(order);
  } catch (error) {
    console.error('admin order PATCH:', error);
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

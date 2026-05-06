import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { updateProduct, deleteProduct, getProductByIdFromDb } from '@/lib/db/products';
import type { Product } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;
  let body: Partial<Product> & { password?: string; digital_file_path?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { password, digital_file_path, ...patch } = body;

  if (!isAdminRequest(request, password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    await updateProduct(id, patch, digital_file_path);
    revalidateTag('products', 'max');
    const updated = await getProductByIdFromDb(id);
    return NextResponse.json(updated);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Update failed';
    console.error('admin PATCH product:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  const { id } = await context.params;

  let password: string | undefined;
  const ct = request.headers.get('content-type');
  if (ct?.includes('application/json')) {
    try {
      const body = await request.json();
      password = body?.password;
    } catch {
      /* ignore */
    }
  }

  if (!isAdminRequest(request, password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  try {
    await deleteProduct(id);
    revalidateTag('products', 'max');
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Delete failed';
    console.error('admin DELETE product:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

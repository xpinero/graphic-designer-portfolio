import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isAdminRequest } from '@/lib/admin-auth';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { fetchProductsFromDb, insertProduct } from '@/lib/db/products';
import { products as staticProducts } from '@/lib/products';
import type { Product } from '@/lib/types';

export async function GET(request: Request) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(staticProducts);
    }
    const products = await fetchProductsFromDb();
    return NextResponse.json(products);
  } catch (error) {
    console.error('admin GET products:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: Product & { password?: string; digital_file_path?: string | null };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { password, digital_file_path, ...productInput } = body as Product & {
    password?: string;
    digital_file_path?: string | null;
  };

  if (!isAdminRequest(request, password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Supabase is not configured; cannot create products in production.' },
      { status: 503 }
    );
  }

  if (!productInput.id || !productInput.name) {
    return NextResponse.json(
      { error: 'id and name are required' },
      { status: 400 }
    );
  }

  const product: Product = {
    id: productInput.id,
    name: productInput.name,
    description: productInput.description ?? '',
    category: productInput.category,
    price: Number(productInput.price),
    images: productInput.images ?? [],
    variants: productInput.variants,
    isDigital: Boolean(productInput.isDigital),
    digitalFileUrl: productInput.digitalFileUrl,
    inventory: productInput.inventory,
    featured: Boolean(productInput.featured),
    createdAt: productInput.createdAt ?? new Date().toISOString(),
  };

  try {
    await insertProduct(product, digital_file_path ?? null);
    revalidateTag('products', 'max');
    return NextResponse.json({ ok: true, product });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Insert failed';
    console.error('admin POST product:', error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

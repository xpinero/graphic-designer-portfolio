import { NextResponse } from 'next/server';
import { unstable_cache } from 'next/cache';
import { getProductsForShop } from '@/lib/db/products';

const getCachedProducts = unstable_cache(
  async () => getProductsForShop(),
  ['shop-products'],
  { tags: ['products'], revalidate: 60 }
);

export async function GET() {
  try {
    const products = await getCachedProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('GET /api/products:', error);
    return NextResponse.json(
      { error: 'Failed to load products' },
      { status: 500 }
    );
  }
}

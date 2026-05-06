import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { products as staticProducts } from '@/lib/products';
import type { Product } from '@/lib/types';
import { rowToProduct, productToRow, type ProductRow } from './product-mapper';

export async function fetchProductsFromDb(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('fetchProductsFromDb:', error);
    throw error;
  }

  return (data as ProductRow[]).map(rowToProduct);
}

export async function getProductsForShop(): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return staticProducts;
  }
  return fetchProductsFromDb();
}

export async function getProductByIdFromDb(id: string): Promise<Product | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getProductByIdFromDb:', error);
    return null;
  }
  if (!data) return null;
  return rowToProduct(data as ProductRow);
}

export async function insertProduct(product: Product, digitalFilePath?: string | null) {
  const supabase = getSupabaseAdmin();
  const row = productToRow(product, digitalFilePath);
  const { error } = await supabase.from('products').insert({
    ...row,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

export async function updateProduct(
  id: string,
  patch: Partial<Product> & { id?: string },
  digitalFilePath?: string | null
) {
  const supabase = getSupabaseAdmin();
  const existing = await getProductByIdFromDb(id);
  if (!existing) throw new Error('Product not found');

  const { data: existingRow } = await supabase
    .from('products')
    .select('digital_file_path')
    .eq('id', id)
    .single();

  const merged: Product = {
    ...existing,
    ...patch,
    id,
  };
  const pathToUse =
    digitalFilePath !== undefined
      ? digitalFilePath
      : (existingRow as { digital_file_path: string | null } | null)?.digital_file_path ?? null;

  const row = productToRow(merged, pathToUse);
  const { id: _omit, ...updatePayload } = row;
  const { error } = await supabase
    .from('products')
    .update({
      ...updatePayload,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);
  if (error) throw error;
}

export async function deleteProduct(id: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}

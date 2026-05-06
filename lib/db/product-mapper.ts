import type { Product, ProductCategory, ProductVariant } from '@/lib/types';

export type ProductRow = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  images: string[];
  variants: ProductVariant[] | null;
  is_digital: boolean;
  digital_file_path: string | null;
  digital_file_url: string | null;
  inventory: number | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export function rowToProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    category: row.category as ProductCategory,
    price: Number(row.price),
    images: Array.isArray(row.images) ? row.images : [],
    variants: row.variants ?? undefined,
    isDigital: row.is_digital,
    digitalFileUrl: row.digital_file_url ?? undefined,
    inventory: row.inventory ?? undefined,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export function productToRow(
  p: Partial<Product> & { id: string },
  digitalFilePath?: string | null
): Omit<ProductRow, 'created_at' | 'updated_at'> {
  return {
    id: p.id,
    name: p.name ?? '',
    description: p.description ?? '',
    category: (p.category ?? 'print') as string,
    price: p.price ?? 0,
    images: p.images ?? [],
    variants: p.variants ?? null,
    is_digital: p.isDigital ?? false,
    digital_file_path: digitalFilePath ?? null,
    digital_file_url: p.digitalFileUrl ?? null,
    inventory: p.inventory ?? null,
    featured: p.featured ?? false,
  };
}

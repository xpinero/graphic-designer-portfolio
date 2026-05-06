/**
 * Seed Supabase `products` from lib/products.ts (static seed data).
 * Requires: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *
 * Run: npm run seed:supabase
 */

import { createClient } from '@supabase/supabase-js';
import { products } from '../lib/products';
import { productToRow } from '../lib/db/product-mapper';

async function main() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const p of products) {
    const row = productToRow(p, null);
    const { error } = await supabase.from('products').upsert(
      {
        ...row,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Upsert failed', p.id, error);
      process.exit(1);
    }
    console.log('Upserted', p.id);
  }

  const { error: settingsError } = await supabase.from('site_settings').upsert(
    {
      id: 1,
      shop_manual_enabled: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'id' }
  );

  if (settingsError) {
    console.warn('site_settings upsert:', settingsError.message);
  } else {
    console.log('site_settings OK');
  }

  console.log('Done.');
}

main();

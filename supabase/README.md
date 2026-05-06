# Supabase setup

1. Create a project at [supabase.com](https://supabase.com).
2. In **SQL Editor**, run the contents of [`migrations/001_initial.sql`](migrations/001_initial.sql).
3. In **Storage**, create buckets:
   - `product-images` — **public**
   - `digital-products` — **private** (no public access)
4. Copy **Project URL**, **anon key**, and **service_role** key into Vercel / `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (optional for future client use)
   - `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose to browser)

5. Seed products (from your machine, with env vars set):

```bash
npm run seed:supabase
```

If Supabase env vars are missing, the app falls back to [`lib/products.ts`](lib/products.ts) and [`data/settings.json`](data/settings.json).

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Product, ProductCategory } from '@/lib/types';
import { adminHeaders } from '@/lib/admin-fetch';
import toast from 'react-hot-toast';
import { Trash2, Upload } from 'lucide-react';

const CATEGORIES: ProductCategory[] = ['print', 'original', 'digital', 'service'];

function emptyForm(): Partial<Product> & { id: string } {
  return {
    id: '',
    name: '',
    description: '',
    category: 'print',
    price: 0,
    images: [],
    isDigital: false,
    featured: false,
    inventory: undefined,
    digitalFileUrl: '',
    variants: undefined,
  };
}

export default function AdminProductsPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [imagesText, setImagesText] = useState('');
  const [variantsText, setVariantsText] = useState('');

  useEffect(() => {
    const p = sessionStorage.getItem('admin_password');
    if (!p) {
      router.replace('/admin');
      return;
    }
    setPassword(p);
  }, [router]);

  const load = async (pw: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products', { headers: adminHeaders(pw) });
      if (res.status === 401) {
        sessionStorage.removeItem('admin_password');
        router.replace('/admin');
        return;
      }
      if (!res.ok) throw new Error('Load failed');
      const data = (await res.json()) as Product[];
      setProducts(data);
    } catch {
      toast.error('Could not load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!password) return;
    load(password);
  }, [password]);

  const startCreate = () => {
    const f = emptyForm();
    f.id = `prod_${crypto.randomUUID().slice(0, 8)}`;
    setForm(f);
    setImagesText('');
    setVariantsText('');
  };

  const startEdit = (p: Product) => {
    setForm({ ...p });
    setImagesText(p.images.join('\n'));
    setVariantsText(p.variants ? JSON.stringify(p.variants, null, 2) : '');
  };

  const parseImages = (): string[] =>
    imagesText
      .split(/[\n,]/)
      .map((s) => s.trim())
      .filter(Boolean);

  const parseVariants = (): Product['variants'] => {
    const t = variantsText.trim();
    if (!t) return undefined;
    return JSON.parse(t) as Product['variants'];
  };

  const saveProduct = async () => {
    if (!password) return;
    const images = parseImages();
    let variants: Product['variants'];
    try {
      variants = parseVariants();
    } catch {
      toast.error('Variants must be valid JSON');
      return;
    }

    const payload: Product = {
      id: form.id!,
      name: form.name || '',
      description: form.description || '',
      category: (form.category as ProductCategory) || 'print',
      price: Number(form.price) || 0,
      images,
      variants,
      isDigital: Boolean(form.isDigital),
      digitalFileUrl: form.digitalFileUrl || undefined,
      inventory:
        form.inventory === undefined || form.inventory === ('' as unknown as number)
          ? undefined
          : Number(form.inventory),
      featured: Boolean(form.featured),
      createdAt: form.createdAt || new Date().toISOString(),
    };

    setSaving(true);
    try {
      const existing = products.some((p) => p.id === payload.id);
      const res = existing
        ? await fetch(`/api/admin/products/${encodeURIComponent(payload.id)}`, {
            method: 'PATCH',
            headers: adminHeaders(password),
            body: JSON.stringify({ ...payload, password }),
          })
        : await fetch('/api/admin/products', {
            method: 'POST',
            headers: adminHeaders(password),
            body: JSON.stringify({ ...payload, password }),
          });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Save failed');
      }
      toast.success(existing ? 'Product updated' : 'Product created');
      await load(password);
      setForm(emptyForm());
      setImagesText('');
      setVariantsText('');
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!password || !confirm('Delete this product?')) return;
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: adminHeaders(password),
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      toast.error('Delete failed');
      return;
    }
    toast.success('Deleted');
    load(password);
  };

  const uploadFile = async (file: File, kind: 'image' | 'digital') => {
    if (!password) return;
    const init = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        password,
        filename: file.name,
        kind,
        contentType: file.type,
      }),
    });
    if (!init.ok) {
      toast.error('Could not start upload');
      return;
    }
    const { signedUrl, publicUrl } = await init.json();
    const put = await fetch(signedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type || 'application/octet-stream',
      },
    });
    if (!put.ok) {
      toast.error('Upload failed');
      return;
    }
    if (kind === 'image' && publicUrl) {
      setImagesText((prev) => (prev ? `${prev}\n${publicUrl}` : publicUrl));
      toast.success('Image uploaded — URL added to list');
    } else {
      toast.success('Digital file uploaded (path stored via API only for now)');
    }
  };

  if (!password && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Products</h1>
          <Link href="/admin" className="text-accent hover:underline text-sm">
            ← Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-foreground/60">Loading…</p>
        ) : (
          <>
            <div className="flex gap-2 mb-6">
              <button
                type="button"
                onClick={startCreate}
                className="px-4 py-2 bg-accent text-background rounded-lg text-sm font-medium"
              >
                New product
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-muted p-6 rounded-lg space-y-3">
                <h2 className="font-semibold text-lg">{form.id ? `Edit ${form.id}` : 'Editor'}</h2>
                <label className="block text-xs font-medium">ID</label>
                <input
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                  disabled={products.some((p) => p.id === form.id)}
                />
                <label className="block text-xs font-medium">Name</label>
                <input
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
                <label className="block text-xs font-medium">Category</label>
                <select
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as ProductCategory }))
                  }
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <label className="block text-xs font-medium">Price (USD)</label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: Number(e.target.value) }))}
                />
                <label className="block text-xs font-medium">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm min-h-[80px]"
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                />
                <div className="block text-xs font-medium mb-1">
                  Image URLs (one per line){' '}
                  <span className="inline-flex items-center gap-1 ml-2 cursor-pointer text-accent">
                    <Upload size={14} />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="admin-img-upload"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadFile(f, 'image');
                        e.target.value = '';
                      }}
                    />
                    <label htmlFor="admin-img-upload" className="cursor-pointer">
                      Upload
                    </label>
                  </span>
                </div>
                <textarea
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm font-mono text-xs min-h-[72px]"
                  placeholder="https://..."
                  value={imagesText}
                  onChange={(e) => setImagesText(e.target.value)}
                />
                <label className="block text-xs font-medium">Variants JSON (optional)</label>
                <textarea
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm font-mono text-xs min-h-[100px]"
                  value={variantsText}
                  onChange={(e) => setVariantsText(e.target.value)}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form.isDigital)}
                    onChange={(e) => setForm((f) => ({ ...f, isDigital: e.target.checked }))}
                  />
                  Digital product
                </label>
                <label className="block text-xs font-medium">Digital file URL (optional)</label>
                <input
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                  value={form.digitalFileUrl || ''}
                  onChange={(e) => setForm((f) => ({ ...f, digitalFileUrl: e.target.value }))}
                />
                <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) uploadFile(f, 'digital');
                      e.target.value = '';
                    }}
                  />
                  <span className="text-accent">Upload digital file</span>
                </label>
                <label className="block text-xs font-medium">Inventory (blank = unlimited)</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 rounded border border-border bg-background text-sm"
                  value={form.inventory ?? ''}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      inventory: e.target.value === '' ? undefined : Number(e.target.value),
                    }))
                  }
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={Boolean(form.featured)}
                    onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  />
                  Featured
                </label>
                <button
                  type="button"
                  disabled={saving || !form.id}
                  onClick={saveProduct}
                  className="w-full py-2 bg-accent text-background rounded-lg font-medium disabled:opacity-50"
                >
                  {saving ? 'Saving…' : 'Save product'}
                </button>
              </div>

              <div className="bg-muted p-6 rounded-lg">
                <h2 className="font-semibold text-lg mb-4">Catalog ({products.length})</h2>
                <ul className="space-y-2 max-h-[70vh] overflow-y-auto">
                  {products.map((p) => (
                    <li
                      key={p.id}
                      className="flex justify-between items-start gap-2 border-b border-border pb-2 text-sm"
                    >
                      <div>
                        <button
                          type="button"
                          className="text-left font-medium text-foreground hover:text-accent"
                          onClick={() => startEdit(p)}
                        >
                          {p.name}
                        </button>
                        <div className="text-xs text-foreground/60">{p.id}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(p.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        aria-label="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

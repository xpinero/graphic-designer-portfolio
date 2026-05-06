'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { adminHeaders } from '@/lib/admin-fetch';
import type { OrderRow } from '@/lib/db/orders';
import type { OrderStatus } from '@/lib/types';
import toast from 'react-hot-toast';

const STATUSES: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'completed',
  'cancelled',
];

export default function AdminOrdersPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

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
      const res = await fetch('/api/admin/orders', { headers: adminHeaders(pw) });
      if (res.status === 401) {
        sessionStorage.removeItem('admin_password');
        router.replace('/admin');
        return;
      }
      if (!res.ok) throw new Error('load');
      const data = (await res.json()) as OrderRow[];
      setOrders(data);
    } catch {
      toast.error('Could not load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!password) return;
    load(password);
  }, [password]);

  const setStatus = async (id: string, status: OrderStatus) => {
    if (!password) return;
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: 'PATCH',
      headers: adminHeaders(password),
      body: JSON.stringify({ password, status }),
    });
    if (!res.ok) {
      toast.error('Update failed');
      return;
    }
    toast.success('Status updated');
    load(password);
  };

  if (!password && !loading) return null;

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <Link href="/admin" className="text-accent hover:underline text-sm">
            ← Dashboard
          </Link>
        </div>

        {loading ? (
          <p className="text-foreground/60">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-foreground/60">
            No orders in database yet. After Supabase is configured, completed checkouts will
            appear here (Stripe webhook).
          </p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div key={o.id} className="bg-muted rounded-lg p-4 border border-border">
                <div className="flex flex-wrap justify-between gap-2 items-start">
                  <div>
                    <div className="font-mono text-xs text-foreground/60">{o.id}</div>
                    <div className="font-medium">
                      {o.customer_email || '—'} ·{' '}
                      {(o.amount_total / 100).toFixed(2)} {o.currency?.toUpperCase()}
                    </div>
                    <div className="text-xs text-foreground/60">
                      {new Date(o.created_at).toLocaleString()} · Session{' '}
                      <span className="font-mono">{o.stripe_checkout_session_id.slice(0, 20)}…</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as OrderStatus)}
                      className="text-sm px-2 py-1 rounded border border-border bg-background"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="text-sm text-accent"
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    >
                      {expanded === o.id ? 'Hide' : 'Details'}
                    </button>
                  </div>
                </div>
                {expanded === o.id && (
                  <pre className="mt-3 text-xs overflow-x-auto bg-background p-3 rounded border border-border max-h-64 overflow-y-auto">
                    {JSON.stringify(
                      {
                        items_snapshot: o.items_snapshot,
                        line_items_snapshot: o.line_items_snapshot,
                        shipping_address: o.shipping_address,
                      },
                      null,
                      2
                    )}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

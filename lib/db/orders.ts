import { getSupabaseAdmin } from '@/lib/supabase/admin';
import type { OrderStatus } from '@/lib/types';

export type OrderRow = {
  id: string;
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  amount_total: number;
  currency: string;
  items_snapshot: unknown;
  line_items_snapshot: unknown;
  shipping_address: unknown;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
};

export async function insertOrderFromStripeSession(payload: {
  stripe_checkout_session_id: string;
  stripe_payment_intent_id: string | null;
  customer_email: string | null;
  customer_name: string | null;
  amount_total: number;
  currency: string;
  items_snapshot: unknown;
  line_items_snapshot: unknown;
  shipping_address: unknown;
}): Promise<{ inserted: boolean }> {
  const supabase = getSupabaseAdmin();

  const { data: existing } = await supabase
    .from('orders')
    .select('id')
    .eq('stripe_checkout_session_id', payload.stripe_checkout_session_id)
    .maybeSingle();

  if (existing) {
    return { inserted: false };
  }

  const { error } = await supabase.from('orders').insert({
    stripe_checkout_session_id: payload.stripe_checkout_session_id,
    stripe_payment_intent_id: payload.stripe_payment_intent_id,
    customer_email: payload.customer_email,
    customer_name: payload.customer_name,
    amount_total: payload.amount_total,
    currency: payload.currency,
    items_snapshot: payload.items_snapshot,
    line_items_snapshot: payload.line_items_snapshot,
    shipping_address: payload.shipping_address,
    status: 'processing',
    updated_at: new Date().toISOString(),
  });

  if (error) throw error;
  return { inserted: true };
}

export async function fetchOrdersFromDb(): Promise<OrderRow[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as OrderRow[];
}

export async function fetchOrderById(id: string): Promise<OrderRow | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as OrderRow | null;
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

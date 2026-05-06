import { NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { insertOrderFromStripeSession } from '@/lib/db/orders';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json(
        { error: 'Missing STRIPE_WEBHOOK_SECRET' },
        { status: 500 }
      );
    }

    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const sessionThin = event.data.object as Stripe.Checkout.Session;
        const stripe = getStripe();

        const session = await stripe.checkout.sessions.retrieve(sessionThin.id, {
          expand: ['line_items'],
        });

        // Latest stripe-node types omit `shipping_details` but the API still returns it when shipping is collected.
        const sessionWithShipping = session as Stripe.Checkout.Session & {
          shipping_details?: unknown;
        };

        let itemsMeta: unknown = [];
        try {
          itemsMeta = session.metadata?.items
            ? JSON.parse(session.metadata.items)
            : [];
        } catch {
          itemsMeta = [];
        }

        const lineItems =
          session.line_items?.data?.map((li) => ({
            description: li.description,
            quantity: li.quantity,
            amount_subtotal: li.amount_subtotal,
            amount_total: li.amount_total,
            currency: li.currency,
          })) ?? null;

        const paymentIntentId =
          typeof session.payment_intent === 'string'
            ? session.payment_intent
            : session.payment_intent?.id ?? null;

        const shippingAddress =
          sessionWithShipping.shipping_details ??
          (session.customer_details?.address
            ? {
                name: session.customer_details.name,
                email: session.customer_details.email,
                address: session.customer_details.address,
              }
            : null);

        if (isSupabaseConfigured()) {
          try {
            const { inserted } = await insertOrderFromStripeSession({
              stripe_checkout_session_id: session.id,
              stripe_payment_intent_id: paymentIntentId,
              customer_email:
                session.customer_email ?? session.customer_details?.email ?? null,
              customer_name: session.customer_details?.name ?? null,
              amount_total: session.amount_total ?? 0,
              currency: session.currency ?? 'usd',
              items_snapshot: itemsMeta,
              line_items_snapshot: lineItems,
              shipping_address: shippingAddress,
            });
            console.log('Order persisted:', session.id, { inserted });
          } catch (persistErr) {
            console.error('Order persist failed:', persistErr);
            throw persistErr;
          }
        } else {
          console.log('Order completed (no DB):', session.id);
        }

        break;
      }

      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';
import { stripe, formatAmountForStripe } from '@/lib/stripe';
import { CartItem } from '@/lib/types';
import { getPublicShopSettings } from '@/lib/shop-settings';

export async function POST(request: Request) {
  try {
    const { shopEnabled } = getPublicShopSettings();
    if (!shopEnabled) {
      return NextResponse.json(
        { error: 'The shop is currently closed' },
        { status: 403 }
      );
    }

    const { items, customerEmail } = await request.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    const hasPhysicalProducts = items.some((item: CartItem) => !item.product.isDigital);
    
    const lineItems = items.map((item: CartItem) => {
      const variantsText = item.selectedVariants
        ? Object.entries(item.selectedVariants)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', ')
        : '';
      
      const description = variantsText
        ? `${item.product.description} (${variantsText})`
        : item.product.description;

      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.product.name,
            description: description.substring(0, 500),
            images: item.product.images.map(img => 
              img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_SITE_URL}${img}`
            ),
          },
          unit_amount: formatAmountForStripe(item.price),
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      customer_email: customerEmail,
      shipping_address_collection: hasPhysicalProducts
        ? {
            allowed_countries: ['US', 'CA', 'GB', 'AU'],
          }
        : undefined,
      shipping_options: hasPhysicalProducts
        ? [
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 0,
                  currency: 'usd',
                },
                display_name: 'Free shipping',
                delivery_estimate: {
                  minimum: {
                    unit: 'business_day',
                    value: 5,
                  },
                  maximum: {
                    unit: 'business_day',
                    value: 7,
                  },
                },
              },
            },
            {
              shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: {
                  amount: 1500,
                  currency: 'usd',
                },
                display_name: 'Express shipping',
                delivery_estimate: {
                  minimum: {
                    unit: 'business_day',
                    value: 2,
                  },
                  maximum: {
                    unit: 'business_day',
                    value: 3,
                  },
                },
              },
            },
          ]
        : undefined,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout`,
      metadata: {
        items: JSON.stringify(items.map((item: CartItem) => ({
          productId: item.product.id,
          quantity: item.quantity,
          selectedVariants: item.selectedVariants,
        }))),
      },
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

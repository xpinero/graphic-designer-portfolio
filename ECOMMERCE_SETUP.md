# E-commerce Setup Guide

Complete guide to set up and test the e-commerce functionality.

## Quick Start

The e-commerce features have been added to your portfolio website! Here's what's new:

### New Pages
- `/shop` - Browse and purchase products
- `/checkout` - Secure checkout with Stripe
- `/success` - Order confirmation page
- `/admin` - Admin dashboard (password: admin123)

### New Features
- Shopping cart with persistent state
- Product filtering and search
- Product variants (sizes, formats, etc.)
- Stripe payment processing
- Order management
- Digital product delivery

## Setup Stripe (Required for Testing)

### 1. Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Click "Sign up" and create a free account
3. You'll start in **Test Mode** automatically (perfect for development)

### 2. Get Your API Keys

1. Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Copy your **Secret key** (starts with `sk_test_`)

### 3. Update Environment Variables

Edit `.env.local` and add your keys:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE
```

### 4. Restart the Development Server

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Testing the E-commerce Flow

### Test Card Numbers

Stripe provides test card numbers for different scenarios:

**Successful Payment:**
- Card: `4242 4242 4242 4242`
- Expiry: Any future date (e.g., 12/25)
- CVC: Any 3 digits (e.g., 123)
- ZIP: Any 5 digits (e.g., 12345)

**Payment Declined:**
- Card: `4000 0000 0000 0002`

**Requires Authentication:**
- Card: `4000 0025 0000 3155`

### Complete Purchase Flow

1. **Browse Products**
   - Visit http://localhost:3000/shop
   - Browse the 10 sample products
   - Use filters to sort by category
   - Search for products

2. **Add to Cart**
   - Click on a product to view details
   - Select variants if available (size, format, etc.)
   - Choose quantity
   - Click "Add to Cart"
   - Cart icon in navigation shows item count

3. **View Cart**
   - Click the shopping cart icon in navigation
   - Review items
   - Update quantities or remove items
   - Click "Proceed to Checkout"

4. **Checkout**
   - Enter your email address
   - Click "Continue to Payment"
   - You'll be redirected to Stripe Checkout
   - Enter test card: 4242 4242 4242 4242
   - Complete the form
   - Click "Pay"

5. **Order Confirmation**
   - You'll be redirected to the success page
   - See order details and confirmation
   - Cart is automatically cleared

## Product Types

The shop includes 4 types of products:

### 1. Digital Downloads
- Instant delivery after purchase
- No shipping required
- Examples: Design files, digital art

### 2. Prints
- Physical products that require shipping
- Multiple size and format options
- Shipping address collected at checkout

### 3. Originals
- One-of-a-kind artwork
- Limited inventory (usually 1)
- Physical shipping

### 4. Services
- Design consultations, custom work
- No physical product
- Digital delivery of results

## Admin Dashboard

Access the admin dashboard at http://localhost:3000/admin

**Default Password:** `admin123`

### Features:
- View product statistics
- See all products in a table
- Quick links to Stripe dashboard
- Product and order management (coming soon)

### Change Admin Password

Edit `.env.local`:
```bash
ADMIN_PASSWORD=your_secure_password_here
```

## Webhook Setup (Optional - For Production)

Webhooks allow Stripe to notify your app about payment events.

### Development Testing

1. Install Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE
   ```

### Production Webhooks

1. Go to [Stripe Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your production URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select events to listen for:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the signing secret and add to production environment variables

## Customization

### Add/Edit Products

Edit `lib/products.ts`:

```typescript
{
  id: 'prod_11',
  name: 'Your Product Name',
  description: 'Product description',
  category: 'print', // or 'digital', 'original', 'service'
  price: 99,
  images: ['/products/your-image.jpg'],
  isDigital: false,
  inventory: 10,
  featured: true,
  createdAt: new Date().toISOString(),
}
```

### Add Product Variants

```typescript
variants: [
  {
    name: 'Size',
    options: [
      { value: '8x10', priceModifier: 0 },
      { value: '11x14', priceModifier: 30 },
    ],
  },
]
```

### Shipping Rates

Edit `app/api/checkout/route.ts` to customize shipping options.

### Email Notifications

To send real emails:

1. Sign up for [Resend](https://resend.com)
2. Get your API key
3. Add to `.env.local`:
   ```bash
   RESEND_API_KEY=re_YOUR_KEY_HERE
   ```
4. Implement email sending in webhook handler

## Troubleshooting

### Cart Not Persisting
- Check browser localStorage
- Clear cache and reload

### Stripe Checkout Not Loading
- Verify API keys are correct
- Check browser console for errors
- Ensure keys start with `pk_test_` and `sk_test_`

### Payment Failing
- Use test card: 4242 4242 4242 4242
- Check Stripe dashboard for error details
- Verify webhook secret if using webhooks

### Images Not Loading
- Ensure images exist in `public/products/`
- Check image paths in product data
- Verify Next.js Image component configuration

## Going to Production

### 1. Switch to Live Mode

1. Go to Stripe Dashboard
2. Toggle from "Test mode" to "Live mode"
3. Get your live API keys
4. Update production environment variables

### 2. Update Environment Variables

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_KEY
STRIPE_SECRET_KEY=sk_live_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_SECRET
```

### 3. Test with Real Cards

- Use real credit cards in live mode
- Start with small test purchases
- Verify order flow end-to-end

### 4. Enable Webhooks

- Set up production webhook endpoint
- Test webhook delivery
- Monitor Stripe dashboard for events

## Support Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe Test Cards**: https://stripe.com/docs/testing
- **Stripe Dashboard**: https://dashboard.stripe.com
- **Next.js Docs**: https://nextjs.org/docs

## Security Notes

- Never commit `.env.local` to git (it's in .gitignore)
- Use strong admin passwords in production
- Enable Stripe's fraud detection
- Use HTTPS in production
- Regularly update dependencies

## Next Steps

1. Test the complete purchase flow
2. Add your real products
3. Upload actual product images
4. Set up Stripe account
5. Configure email notifications
6. Test on mobile devices
7. Deploy to production

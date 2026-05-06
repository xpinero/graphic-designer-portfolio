import { timingSafeEqual } from 'node:crypto';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const REQUIRED_ENV: { name: string; description: string }[] = [
  { name: 'STRIPE_SECRET_KEY', description: 'Stripe server secret for checkout and orders' },
  { name: 'STRIPE_WEBHOOK_SECRET', description: 'Stripe webhook signing secret' },
  { name: 'NEXT_PUBLIC_SITE_URL', description: 'Public site URL for checkout redirects and images' },
  { name: 'ADMIN_PASSWORD', description: 'Password for shop settings API' },
];

const OPTIONAL_ENV: { name: string; description: string }[] = [
  { name: 'RESEND_API_KEY', description: 'Resend email (optional)' },
  { name: 'SENDGRID_API_KEY', description: 'SendGrid email (optional)' },
];

function isConfigured(name: string): boolean {
  const v = process.env[name];
  return typeof v === 'string' && v.trim().length > 0;
}

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function bearerToken(request: Request): string | null {
  const auth = request.headers.get('authorization');
  if (!auth || !auth.startsWith('Bearer ')) return null;
  const raw = auth.slice('Bearer '.length).trim();
  return raw.length > 0 ? raw : null;
}

export async function GET(request: Request) {
  const healthSecret = process.env.HEALTH_CHECK_SECRET?.trim();
  if (!healthSecret) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const token = bearerToken(request);
  if (!token || !timingSafeStringEqual(token, healthSecret)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const requiredChecks = REQUIRED_ENV.map(({ name, description }) => ({
    name,
    description,
    configured: isConfigured(name),
  }));

  const optionalChecks = OPTIONAL_ENV.map(({ name, description }) => ({
    name,
    description,
    configured: isConfigured(name),
  }));

  const missingRequired = requiredChecks.filter((c) => !c.configured).map((c) => c.name);

  const ok = missingRequired.length === 0;

  return NextResponse.json(
    {
      ok,
      service: 'graphic-designer-portfolio',
      nodeEnv: process.env.NODE_ENV,
      missingRequired,
      required: requiredChecks,
      optional: optionalChecks,
    },
    { status: ok ? 200 : 503 }
  );
}

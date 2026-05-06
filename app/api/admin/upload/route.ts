import { NextResponse } from 'next/server';
import { isAdminRequest } from '@/lib/admin-auth';
import { getSupabaseAdmin } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

const IMAGE_BUCKET = 'product-images';
const DIGITAL_BUCKET = 'digital-products';

function safeSegment(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 180) || 'file';
}

export async function POST(request: Request) {
  let body: {
    password?: string;
    filename: string;
    contentType?: string;
    kind?: 'image' | 'digital';
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!isAdminRequest(request, body.password)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  const kind = body.kind === 'digital' ? 'digital' : 'image';
  const bucket = kind === 'digital' ? DIGITAL_BUCKET : IMAGE_BUCKET;
  const path = `uploads/${Date.now()}-${safeSegment(body.filename)}`;

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path);

    if (error || !data) {
      console.error('createSignedUploadUrl:', error);
      return NextResponse.json(
        { error: error?.message ?? 'Could not create upload URL' },
        { status: 500 }
      );
    }

    const base = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace(/\/$/, '');
    const publicUrl =
      kind === 'image'
        ? `${base}/storage/v1/object/public/${bucket}/${data.path}`
        : null;

    return NextResponse.json({
      signedUrl: data.signedUrl,
      path: data.path,
      token: data.token,
      bucket,
      publicUrl,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Upload init failed';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

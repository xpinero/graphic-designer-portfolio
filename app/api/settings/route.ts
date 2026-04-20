import { NextResponse } from 'next/server';
import {
  getPublicShopSettings,
  readPersistedSettings,
  savePersistedSettings,
} from '@/lib/shop-settings';

export async function GET() {
  try {
    const publicSettings = getPublicShopSettings();
    return NextResponse.json(publicSettings);
  } catch (error) {
    console.error('Failed to read settings:', error);
    return NextResponse.json({
      manualShopEnabled: true,
      scheduledClosureActive: false,
      shopEnabled: true,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shopEnabled: manualShopEnabled, password } = body;

    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (typeof manualShopEnabled !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid shopEnabled' },
        { status: 400 }
      );
    }

    const current = readPersistedSettings();
    savePersistedSettings({ ...current, shopEnabled: manualShopEnabled });

    return NextResponse.json(getPublicShopSettings());
  } catch (error) {
    console.error('Failed to update settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

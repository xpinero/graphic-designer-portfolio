import fs from 'fs';
import path from 'path';
import { isScheduledShopClosure } from '@/lib/shop-schedule';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getSupabaseAdmin } from '@/lib/supabase/admin';

export const settingsPath = path.join(process.cwd(), 'data', 'settings.json');

export type PersistedSettings = {
  shopEnabled: boolean;
};

export function readPersistedSettings(): PersistedSettings {
  try {
    const data = fs.readFileSync(settingsPath, 'utf8');
    const parsed = JSON.parse(data) as PersistedSettings;
    return {
      shopEnabled: typeof parsed.shopEnabled === 'boolean' ? parsed.shopEnabled : true,
    };
  } catch {
    return { shopEnabled: true };
  }
}

export function savePersistedSettings(settings: PersistedSettings): void {
  const dir = path.dirname(settingsPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
}

export type PublicShopSettings = {
  manualShopEnabled: boolean;
  scheduledClosureActive: boolean;
  shopEnabled: boolean;
};

async function readManualShopEnabled(): Promise<boolean> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('site_settings')
        .select('shop_manual_enabled')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('site_settings read:', error);
        return readPersistedSettings().shopEnabled;
      }
      if (data && typeof data.shop_manual_enabled === 'boolean') {
        return data.shop_manual_enabled;
      }
    } catch (e) {
      console.error('readManualShopEnabled:', e);
    }
  }
  return readPersistedSettings().shopEnabled;
}

export async function saveManualShopEnabled(enabled: boolean): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('site_settings').upsert(
      {
        id: 1,
        shop_manual_enabled: enabled,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
    if (error) throw error;
    return;
  }
  savePersistedSettings({ shopEnabled: enabled });
}

/** @deprecated Prefer resolvePublicShopSettings in API routes */
export function getPublicShopSettings(now: Date = new Date()): PublicShopSettings {
  const { shopEnabled: manualShopEnabled } = readPersistedSettings();
  const scheduledClosureActive = isScheduledShopClosure(now);
  return {
    manualShopEnabled,
    scheduledClosureActive,
    shopEnabled: manualShopEnabled && !scheduledClosureActive,
  };
}

export async function resolvePublicShopSettings(
  now: Date = new Date()
): Promise<PublicShopSettings> {
  const manualShopEnabled = await readManualShopEnabled();
  const scheduledClosureActive = isScheduledShopClosure(now);
  return {
    manualShopEnabled,
    scheduledClosureActive,
    shopEnabled: manualShopEnabled && !scheduledClosureActive,
  };
}

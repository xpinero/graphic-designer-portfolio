import fs from 'fs';
import path from 'path';
import { isScheduledShopClosure } from '@/lib/shop-schedule';

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
  /** User preference from admin (stored in data/settings.json) */
  manualShopEnabled: boolean;
  /** True during Fri 4pm ET – Sat 11pm ET */
  scheduledClosureActive: boolean;
  /** What visitors see: manual && !scheduled */
  shopEnabled: boolean;
};

export function getPublicShopSettings(now: Date = new Date()): PublicShopSettings {
  const { shopEnabled: manualShopEnabled } = readPersistedSettings();
  const scheduledClosureActive = isScheduledShopClosure(now);
  return {
    manualShopEnabled,
    scheduledClosureActive,
    shopEnabled: manualShopEnabled && !scheduledClosureActive,
  };
}

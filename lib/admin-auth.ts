export function verifyAdminPassword(secret: string | undefined): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !secret) return false;
  return secret === expected;
}

export function getAdminSecretFromRequest(request: Request): string | undefined {
  const auth = request.headers.get('authorization');
  if (auth?.startsWith('Bearer ')) {
    return auth.slice(7).trim();
  }
  return undefined;
}

export function isAdminRequest(request: Request, bodyPassword?: string): boolean {
  const bearer = getAdminSecretFromRequest(request);
  if (verifyAdminPassword(bearer)) return true;
  if (bodyPassword && verifyAdminPassword(bodyPassword)) return true;
  return false;
}

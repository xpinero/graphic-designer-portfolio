export function adminHeaders(password: string): HeadersInit {
  return {
    Authorization: `Bearer ${password}`,
    'Content-Type': 'application/json',
  };
}

export function sessionCacheKeyFactory(sessionId: string | number): string {
  return `session-cache-key-strategy:[${sessionId || 'none'}]`;
}

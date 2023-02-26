import { SessionEntity } from 'arcadia-dal';
import { createHash } from 'crypto';

export function getSessionHash(session: SessionEntity): string {
  const data = `${session.id}`;
  return createHash('sha256')
    .update(data)
    .digest('hex');
}

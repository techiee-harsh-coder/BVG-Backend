import { Request } from 'express';

export function getHost(req: Request): string {
  return `${req.protocol}://${req.get('host')}`;
}
import { Request } from 'express';

export interface ClerkRequest extends Request {
  clerk_id?: string;
}

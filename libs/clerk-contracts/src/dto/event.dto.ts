import { ClerkUser } from './clerk.user.dto';
import { ClerkHeaders } from './req.dto';

export class Event {
  headers: ClerkHeaders;
  body: Data;
}

export class Data {
  data: ClerkUser;
  object: string;
  type: string;
}

import { ClerkUser, DeletedUser } from './clerk.user.dto';
import { ClerkHeaders } from './req.dto';

export class Event {
  headers: ClerkHeaders;
  body: Data;
}

export class Data {
  data: ClerkUser | DeletedUser;
  object: string;
  type: string;
}

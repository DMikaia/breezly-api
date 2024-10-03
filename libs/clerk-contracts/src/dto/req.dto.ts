export class ClerkHeaders {
  svix_id: string;
  svix_timestamp: string;
  svix_signature: string;
}

export interface Payload {
  body: any;
  headers: ClerkHeaders;
}

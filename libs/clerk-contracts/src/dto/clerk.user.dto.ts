export class EmailAddress {
  email_address: string;
  id: string;
}

export class ClerkUser {
  id: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_image_url?: string;
  email_addresses: EmailAddress[];
  primary_email_address_id: string;
  created_at: number;
  updated_at: number;
}

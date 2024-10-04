import { ClerkUser, Data, DeletedUser } from '../dto';

export const create_body: Data = {
  data: {
    id: 'clerk_1',
    username: 'user123',
    first_name: 'John',
    last_name: 'Doe',
    email_addresses: [
      {
        email_address: 'user@example.com',
        id: '1',
      },
    ],
    profile_image_url: 'http://example.com/image.jpg',
    created_at: 123,
    updated_at: 123,
    primary_email_address_id: '1',
  } as ClerkUser,
  object: 'event',
  type: 'user.created',
};

export const update_body: Data = {
  data: {
    id: 'clerk_1',
    username: 'user123',
    first_name: 'John',
    last_name: 'Doe',
    email_addresses: [
      {
        email_address: 'user@example.com',
        id: '1',
      },
    ],
    profile_image_url: 'http://example.com/image.jpg',
    created_at: 123,
    updated_at: 123,
    primary_email_address_id: '1',
  } as ClerkUser,
  object: 'event',
  type: 'user.updated',
};

export const wrong_body: Data = {
  data: {
    id: 'clerk_1',
    username: 'user123',
    first_name: 'John',
    last_name: 'Doe',
    email_addresses: [
      {
        email_address: 'user@example.com',
        id: '1',
      },
    ],
    profile_image_url: 'http://example.com/image.jpg',
    created_at: 123,
    updated_at: 123,
    primary_email_address_id: '1',
  } as ClerkUser,
  object: 'event',
  type: 'random.event',
};

export const delete_body: Data = {
  data: {
    deleted: true,
    id: 'clerk_1',
  } as DeletedUser,
  object: 'event',
  type: 'user.deleted',
};

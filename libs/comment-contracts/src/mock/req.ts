export const create_req: unknown = {
  cookies: { session_id: 'session_123' },
  clerk_id: 'clerk_123',
  body: {
    blog_id: 1,
    content: 'First comment',
  },
  get: jest.fn(),
  header: jest.fn(),
};

export const update_req: unknown = {
  cookies: { session_id: 'session_123' },
  clerk_id: 'clerk_123',
  body: {
    blog_id: 1,
    content: 'First comment',
  },
  get: jest.fn(),
  header: jest.fn(),
};

export const delete_req: unknown = {
  cookies: { session_id: 'session_123' },
  clerk_id: 'clerk_123',
  body: {},
  get: jest.fn(),
  header: jest.fn(),
};

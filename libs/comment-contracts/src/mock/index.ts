export const queried_comment = {
  id: 10,
  blog_id: 1,
  content: 'First comment',
  created_at: new Date(123),
  updated_at: new Date(123),
  user_id: 'clerk_123',
};

export const find_one = {
  id: 10,
};

export const find_all = {
  id: 1,
  limit: 1,
  offset: 9,
};

export const comment = {
  blog_id: 1,
  content: 'First comment',
  user_id: 'clerk_123',
};

export const delete_comment = {
  id: 1,
  user_id: 'clerk_123',
};

import { index, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { blogs, comments, notifications } from '../index';

export const users = pgTable(
  'users',
  {
    id: serial('user_id').primaryKey(),
    clerk_id: text('clerk_id').notNull().unique(),
    email: text('email').unique().notNull(),
    username: text('username').unique().notNull(),
    first_name: text('first_name'),
    last_name: text('last_name'),
    profile_image_url: text('profile_image_url'),
    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (users) => ({
    user_index: index('user_index').on(
      users.clerk_id,
      users.email,
      users.username,
    ),
  }),
);

export const userRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  comments: many(comments),
  notifications: many(notifications),
}));

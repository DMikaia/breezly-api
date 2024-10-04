import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { comments } from '../comments';
import { users } from '../users';

export const blogs = pgTable(
  'blogs',
  {
    id: serial('blog_id').primaryKey(),
    author_id: integer('author_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    title: text('title').notNull(),
    thumbnail: text('thumbnail').notNull(),
    content: text('content').notNull(),
    tags: text('tags').array().default([]),
    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (blogs) => ({
    author_id_index: index('blog_author_id_index').on(blogs.author_id),
    created_at_index: index('blog_created_at_index').on(blogs.created_at),
  }),
);

export const blogsRelations = relations(blogs, ({ many, one }) => ({
  user: one(users, {
    fields: [blogs.author_id],
    references: [users.id],
  }),
  comments: many(comments),
}));

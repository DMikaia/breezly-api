import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { relations, sql } from 'drizzle-orm';
import { blogs, users } from '../index';

export const comments = pgTable(
  'comments',
  {
    id: serial('comment_id').primaryKey(),
    blog_id: integer('blog_id')
      .references(() => blogs.id, { onDelete: 'cascade' })
      .notNull(),
    user_id: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    content: text('content').notNull(),
    created_at: timestamp('created_at').default(sql`CURRENT_TIMESTAMP`),
    updated_at: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP`),
  },
  (comments) => ({
    blog_id_index: index('comment_blog_id_index').on(comments.blog_id),
    user_id_index: index('comment_user_id_index').on(comments.user_id),
  }),
);

export const commentsRelations = relations(comments, ({ one }) => ({
  blog: one(blogs, {
    fields: [comments.blog_id],
    references: [blogs.id],
  }),
  user: one(users, {
    fields: [comments.user_id],
    references: [users.id],
  }),
}));
